import { NextRequest, NextResponse } from 'next/server';
import { extractFacebookParams } from '@/lib/fb-param-builder';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, cookie_data, page_url, fbclid, fbp, fbc } = body;

    // Extract Facebook parameters using Parameter Builder
    // This handles IPv4 and IPv6 addresses properly with all proxy headers
    const fbParams = extractFacebookParams(request);

    const eventTime = Math.floor(Date.now() / 1000);

    console.log('📊 Facebook Parameters for PageView:', {
      client_ip: fbParams.client_ip_address,
      ipType: fbParams.client_ip_address?.includes(':') ? 'IPv6' : 'IPv4',
      fbc: fbParams.fbc,
      fbp: fbParams.fbp,
      user_agent_length: fbParams.client_user_agent?.length,
    });

    // Parse cookie data into separate fields for custom_data
    // Each field value must be ≤500 chars
    const customData: Record<string, any> = {};

    if (cookie_data && typeof cookie_data === 'object') {
      // Add individual cookie fields, ensuring each is ≤500 chars
      Object.keys(cookie_data).forEach(key => {
        const value = cookie_data[key];
        if (value !== null && value !== undefined) {
          const stringValue = String(value);
          customData[key] = stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
        }
      });
    }

    const eventData = {
      event_name: 'PageView',
      event_time: eventTime,
      event_id: event_id,
      event_source_url: page_url,
      action_source: 'website',
      user_data: {
        // Use Parameter Builder extracted values (supports IPv4 and IPv6)
        client_ip_address: fbParams.client_ip_address,
        client_user_agent: fbParams.client_user_agent,
        // Use fbc from multiple sources (priority: cookies from client > parameter builder > build from fbclid)
        fbc: fbc || fbParams.fbc || (fbclid ? `fb.1.${eventTime * 1000}.${fbclid}` : undefined),
        // Use fbp from multiple sources (priority: cookies from client > parameter builder)
        fbp: fbp || fbParams.fbp,
      },
      custom_data: customData,
    };

    const payload = {
      data: [eventData],
      access_token: FB_ACCESS_TOKEN,
    };

    console.log('📊 Sending PageView to Facebook CAPI:', {
      event_id,
      custom_data_keys: Object.keys(customData),
      custom_data: customData,
      page_url,
      client_ip_address: fbParams.client_ip_address,
      ip_type: fbParams.client_ip_address?.includes(':') ? 'IPv6' : 'IPv4',
      has_fbc: !!fbParams.fbc,
      has_fbp: !!fbParams.fbp,
      user_agent: fbParams.client_user_agent?.substring(0, 50) + '...',
    });

    const response = await fetch(FB_CONVERSIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Facebook CAPI PageView error:', result);
      return NextResponse.json(
        { success: false, error: result },
        { status: response.status }
      );
    }

    console.log('Facebook CAPI PageView success:', result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending PageView to Facebook CAPI:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
