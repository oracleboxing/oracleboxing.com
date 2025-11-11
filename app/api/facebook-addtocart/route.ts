import { NextRequest, NextResponse } from 'next/server';
import { extractFacebookParams } from '@/lib/fb-param-builder';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, content_ids, content_name, value, currency, button_location, page_url, cookie_data, fbclid } = body;

    // Extract Facebook parameters using Parameter Builder
    const fbParams = extractFacebookParams(request);

    const eventTime = Math.floor(Date.now() / 1000);

    // Parse cookie data into separate fields for custom_data
    // Each field value must be ≤500 chars
    const customData: Record<string, any> = {
      content_ids: content_ids,
      content_name: content_name,
      content_type: 'product',
      value: value,
      currency: currency,
      button_location: button_location,
    };

    if (cookie_data && typeof cookie_data === 'object') {
      // Add individual cookie fields, ensuring each is ≤500 chars
      Object.keys(cookie_data).forEach(key => {
        // Skip user_agent - it's already sent in user_data section
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

    const eventData = {
      event_name: 'AddToCart',
      event_time: eventTime,
      event_id: event_id,
      event_source_url: page_url,
      action_source: 'website',
      user_data: {
        // Use Parameter Builder extracted values (supports IPv4 and IPv6)
        client_ip_address: fbParams.client_ip_address,
        client_user_agent: fbParams.client_user_agent,
        // Use fbc from cookies or build from fbclid
        fbc: fbParams.fbc || (fbclid ? `fb.1.${eventTime * 1000}.${fbclid}` : undefined),
        // Use fbp from cookies
        fbp: fbParams.fbp,
      },
      custom_data: customData,
    };

    const payload = {
      data: [eventData],
      access_token: FB_ACCESS_TOKEN,
    };

    console.log('📊 Sending AddToCart to Facebook CAPI:', {
      event_id,
      content_ids,
      content_name,
      value,
      currency,
      button_location,
      page_url,
      custom_data_keys: Object.keys(customData),
      client_ip_address: fbParams.client_ip_address,
      ip_type: fbParams.client_ip_address?.includes(':') ? 'IPv6' : 'IPv4',
      has_fbc: !!fbParams.fbc,
      has_fbp: !!fbParams.fbp,
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
      console.error('Facebook CAPI AddToCart error:', result);
      return NextResponse.json(
        { success: false, error: result },
        { status: response.status }
      );
    }

    console.log('Facebook CAPI AddToCart success:', result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending AddToCart to Facebook CAPI:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
