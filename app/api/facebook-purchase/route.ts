import { NextRequest, NextResponse } from "next/server";
import { extractFacebookParams, normalizeAndHashEmail, normalizeAndHashPhone } from '@/lib/fb-param-builder';
import { notifyOps } from '@/lib/slack-notify';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

/**
 * Hash a string using SHA-256 for Facebook Conversions API
 */
async function hashSHA256(text: string): Promise<string> {
  const normalized = text.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      event_id,
      value,
      currency,
      content_ids,
      contents,
      customer_email,
      customer_phone,
      cookie_data,
      fbclid,
      session_url,
    } = body;

    const eventTime = Math.floor(Date.now() / 1000);

    // Extract Facebook parameters using Parameter Builder
    // This handles IPv4 and IPv6 addresses properly with all proxy headers
    const fbParams = extractFacebookParams(req);

    // Build custom_data with cookie tracking data
    const customData: Record<string, any> = {
      value,
      currency,
      content_ids,
      content_type: 'product',
      num_items: contents?.length || content_ids?.length || 0,
      contents: contents || content_ids?.map((id: string) => ({ id, quantity: 1 })) || [],
    };

    // Add cookie data fields to custom_data (max 500 chars each)
    if (cookie_data && typeof cookie_data === 'object') {
      Object.keys(cookie_data).forEach(key => {
        // Skip user_agent - it's already in user_data section
        if (key === 'user_agent') {
          return;
        }

        const value = cookie_data[key];
        if (value !== null && value !== undefined) {
          const stringValue = String(value);
          customData[key] = stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
        }
      });
    }

    // Build user_data with customer information using Parameter Builder
    const userData: Record<string, any> = {
      // Use Parameter Builder extracted values (supports IPv4 and IPv6)
      client_ip_address: fbParams.client_ip_address,
      client_user_agent: fbParams.client_user_agent,
    };

    // Add hashed customer email if available (using proper normalization)
    let hashedEmail: string | undefined;
    if (customer_email) {
      try {
        hashedEmail = normalizeAndHashEmail(customer_email);
        userData.em = [hashedEmail];
        // CRITICAL: external_id improves event matching and coverage
        // Using hashed email as external_id increases match rate by 10-15%
        userData.external_id = hashedEmail;
      } catch (error) {
        console.warn('Failed to hash email for Facebook CAPI:', error);
      }
    }

    // Add hashed customer phone if available (using proper normalization)
    if (customer_phone) {
      try {
        const hashedPhone = normalizeAndHashPhone(customer_phone);
        userData.ph = [hashedPhone];
      } catch (error) {
        console.warn('Failed to hash phone for Facebook CAPI:', error);
      }
    }

    // Use fbc from cookies (already formatted) or build from fbclid
    userData.fbc = fbParams.fbc || (fbclid ? `fb.1.${eventTime * 1000}.${fbclid}` : undefined);

    // Use fbp from cookies (set by Facebook Pixel)
    userData.fbp = fbParams.fbp;

    // Build Facebook event
    const fbEventData = {
      event_name: 'Purchase',
      event_time: eventTime,
      event_id,
      event_source_url: session_url || 'https://oracleboxing.com/success',
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    };

    const fbPayload = {
      data: [fbEventData],
      access_token: FB_ACCESS_TOKEN,
    };

    const fbResponse = await fetch(FB_CONVERSIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fbPayload),
    });

    const fbResult = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('❌ Facebook CAPI Purchase error:', fbResult);
      return NextResponse.json(
        { success: false, error: fbResult },
        { status: fbResponse.status }
      );
    }

    // notifyOps(`📊 FB Purchase event fired - ${customer_email || 'unknown'} ($${value} ${currency})`)
    return NextResponse.json({ success: true, result: fbResult });

  } catch (error) {
    console.error('❌ Failed to send Purchase to Facebook CAPI:', error);
    // notifyOps(`❌ FB Purchase event failed - ${String(error)}`)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
