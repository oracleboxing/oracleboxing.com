import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getProductByMetadata } from '@/lib/products';
import { Currency, getStripePriceId } from '@/lib/currency';
import { createWorkflowLogger } from '@/lib/workflow-logger';

// Helper function to flatten cookie data into individual Stripe metadata fields
// Each cookie field becomes a separate metadata field with "cookie_" prefix
function prepareCookieDataForStripe(cookieData: any): Record<string, string> {
  if (!cookieData) return {};

  const flattenedCookieData: Record<string, string> = {};

  // Flatten all cookie data fields with "cookie_" prefix
  for (const [key, value] of Object.entries(cookieData)) {
    if (value !== null && value !== undefined) {
      // Convert value to string and prefix with "cookie_"
      flattenedCookieData[`cookie_${key}`] = String(value);
    }
  }

  return flattenedCookieData;
}

export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'upsell-coaching', workflowType: 'checkout', notifySlack: true });
  try {
    const body = await req.json();
    const { customerEmail, customerName, originalSessionId, isMembership = false, currency = 'USD', trackingParams, cookieData } = body;
    try { await logger.started('Coaching upsell requested', { email: customerEmail, name: customerName, isMembership, currency, originalSessionId }); } catch {}

    // Use the specific price IDs requested by the user
    // Both prices use the same product: prod_THuQf0h3DatQUL
    let priceId: string;

    if (isMembership) {
      // Membership buyers use USD-only price
      priceId = 'price_1SLLX4QNEdHwdojXfZImwLss';
    } else {
      // Non-membership buyers use multi-currency price
      priceId = 'price_1SLLY7QNEdHwdojXVriclpjV';
    }

    // Get base URL for redirect
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';

    // Split customer name into first and last name for metadata
    const nameParts = customerName?.trim().split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

    // Create Stripe checkout session for the upsell
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${baseUrl}/success/final?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        // Customer info
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_email: customerEmail,
        customer_phone: '',

        // Funnel tracking
        funnel_type: 'upsell',
        type: 'coaching',
        entry_product: 'coach1',

        // Upsell tracking
        upsell_type: 'coaching',
        original_session_id: originalSessionId || '',
        is_membership_upsell: isMembership.toString(),

        // Additional tracking
        fbclid: trackingParams?.fbclid || '',
        session_id: trackingParams?.session_id || '',
        event_id: trackingParams?.event_id || '',

        // Cookie tracking data - each field as separate metadata (includes all UTM and attribution data)
        ...prepareCookieDataForStripe(cookieData),
      },
      payment_intent_data: {
        metadata: {
          // Customer info
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_email: customerEmail,
          customer_phone: '',

          // Funnel tracking
          funnel_type: 'upsell',
          type: 'coaching',
          entry_product: 'coach1',

          // Product details
          product_name: '1-Month 1-on-1 Coaching',
          product_id: 'prod_THuQf0h3DatQUL',

          // Upsell tracking
          upsell_type: 'coaching',
          original_session_id: originalSessionId || '',
          is_membership_upsell: isMembership.toString(),

          // Additional tracking
          fbclid: trackingParams?.fbclid || '',
          session_id: trackingParams?.session_id || '',
          event_id: trackingParams?.event_id || '',

          // Cookie tracking data - each field as separate metadata (includes all UTM and attribution data)
          ...prepareCookieDataForStripe(cookieData),
        },
      },
    });

    try { await logger.completed(`Coaching upsell session created for ${customerEmail}`, { sessionId: session.id, email: customerEmail, isMembership, priceId }); } catch {}


    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Route /api/upsell/coaching failed:', error);
    try { await logger.failed(error.message, { stack: error.stack }); } catch {}
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
