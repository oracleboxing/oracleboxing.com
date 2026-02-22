import { NextRequest, NextResponse } from 'next/server';
import { extractFacebookParams } from '@/lib/fb-param-builder';
import { notifyOps } from '@/lib/slack-notify';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

/**
 * Hash a string using SHA-256 for Facebook Conversions API
 */
async function hashSHA256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            event_id,
            email,
            value,
            currency,
            products,
            page_url,
            cookie_data,
            fbclid,
            fbp,
            fbc
        } = body;

        // Validate required fields
        if (!event_id || !email) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: event_id, email' },
                { status: 400 }
            );
        }

        // Extract Facebook parameters using Parameter Builder
        const fbParams = extractFacebookParams(request);
        const eventTime = Math.floor(Date.now() / 1000);

        // Hash email for Facebook
        const hashedEmail = await hashSHA256(email);

        // Parse cookie data into separate fields for custom_data
        const customData: Record<string, any> = {
            value: value || 0,
            currency: currency || 'USD',
            content_ids: products || [],
            content_type: 'product',
            num_items: products?.length || 1,
        };

        if (cookie_data && typeof cookie_data === 'object') {
            Object.keys(cookie_data).forEach(key => {
                // Skip user_agent - it's already sent in user_data section
                if (key === 'user_agent') return;

                const val = cookie_data[key];
                if (val !== null && val !== undefined) {
                    const stringValue = String(val);
                    customData[key] = stringValue.length > 500 ? stringValue.substring(0, 500) : stringValue;
                }
            });
        }

        const eventData = {
            event_name: 'InitiateCheckout',
            event_time: eventTime,
            event_id: event_id,
            event_source_url: page_url,
            action_source: 'website',
            user_data: {
                em: [hashedEmail],
                client_ip_address: fbParams.client_ip_address,
                client_user_agent: fbParams.client_user_agent,
                fbc: fbc || fbParams.fbc || (fbclid ? `fb.1.${eventTime * 1000}.${fbclid}` : undefined),
                fbp: fbp || fbParams.fbp,
            },
            custom_data: customData,
        };

        const payload = {
            data: [eventData],
            access_token: FB_ACCESS_TOKEN,
        };

        const response = await fetch(FB_CONVERSIONS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('❌ Facebook CAPI InitiateCheckout error:', result);
            return NextResponse.json(
                { success: false, error: result },
                { status: response.status }
            );
        }

        // notifyOps(`📊 FB Initiate Checkout event fired - ${email}`)
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error sending InitiateCheckout to Facebook CAPI:', error);
        // notifyOps(`❌ FB Initiate Checkout event failed - ${String(error)}`)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
