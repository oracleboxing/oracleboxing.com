import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { products } from '@/lib/products'
import { createWorkflowLogger } from '@/lib/workflow-logger'

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
  const logger = createWorkflowLogger({ workflowName: 'upsell-charge', workflowType: 'checkout', notifySlack: true });
  try {
    const body = await req.json()
    const { session_id, price_id, product_id, trackingParams, cookieData } = body
    try { await logger.started('Upsell charge requested', { session_id, price_id, product_id }); } catch {}

    // Validate inputs
    if (!session_id || !price_id || !product_id) {
      console.error('❌ UPSELL: Missing parameters')
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get the original checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'subscription', 'payment_intent.latest_charge']
    })
    // Get the original currency from the session
    const originalCurrency = session.currency || 'usd'

    // Get customer and payment method
    let customerId: string | null = null
    let paymentMethodId: string | null = null

    if (session.payment_intent) {
      // One-time payment
      const paymentIntent = typeof session.payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve(session.payment_intent)
        : session.payment_intent

      paymentMethodId = paymentIntent.payment_method as string

      // If no customer on session, try to get from payment intent's latest charge
      if (!session.customer && paymentIntent.latest_charge) {
        const chargeId = typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge.id
        const charge = await stripe.charges.retrieve(chargeId)
        customerId = charge.customer as string
      } else {
        customerId = session.customer as string
      }
    } else if (session.subscription) {
      // Subscription payment
      const subscription = typeof session.subscription === 'string'
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription

      customerId = subscription.customer as string
      paymentMethodId = subscription.default_payment_method as string
    } else {
      customerId = session.customer as string
    }

    if (!customerId) {
      console.error('❌ UPSELL: No customer found')
      return NextResponse.json(
        { error: 'Invalid session - no customer found' },
        { status: 400 }
      )
    }

    if (!paymentMethodId) {
      console.error('❌ UPSELL: No payment method found')
      return NextResponse.json(
        { error: 'No payment method found' },
        { status: 400 }
      )
    }

    // Get the price from Stripe to determine if it's recurring
    const priceObj = await stripe.prices.retrieve(price_id)
    const isRecurring = priceObj.type === 'recurring'

    // Check if this is a subscription (recurring) product
    if (isRecurring) {
      // Create a subscription for recurring products

      // Get customer details for metadata
      const customer = await stripe.customers.retrieve(customerId);
      const customerEmail = customer.deleted ? '' : customer.email || '';
      const customerName = customer.deleted ? '' : customer.name || '';

      // Split customer name into first and last name for metadata
      const nameParts = customerName?.trim().split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      // Attach payment method to customer first
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price_id }],
        default_payment_method: paymentMethodId,
        metadata: {
          // Customer info
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_email: customerEmail,
          customer_phone: '',

          // Funnel tracking
          funnel_type: 'upsell',
          type: 'membership',
          entry_product: product_id,

          // Product details
          product_name: '6-Week Membership',
          product_id: product_id,

          // Upsell tracking
          source: 'upsell',
          original_session_id: session_id,

          // Tracking params (referrer and UTM)
          referrer: trackingParams?.referrer || 'direct',
          utm_source: trackingParams?.utm_source || '',
          utm_medium: trackingParams?.utm_medium || '',
          utm_campaign: trackingParams?.utm_campaign || '',
          utm_term: trackingParams?.utm_term || '',
          utm_content: trackingParams?.utm_content || '',
          fbclid: trackingParams?.fbclid || '',
          session_id: trackingParams?.session_id || '',
          event_id: trackingParams?.event_id || '',

          // Cookie tracking data - each field as separate metadata
          ...prepareCookieDataForStripe(cookieData),
        },
      })

      try { await logger.completed(`Upsell subscription created for ${customerEmail}`, { subscriptionId: subscription.id, email: customerEmail, productId: product_id, type: 'subscription' }); } catch {}


      return NextResponse.json({
        success: true,
        subscription_id: subscription.id,
        status: subscription.status,
      })
    } else {
      // Create a one-time payment for non-recurring products

      // Use the price from the Stripe Price object
      const amount = priceObj.unit_amount || 0;
      const currency = priceObj.currency;

      // Get customer details for metadata
      const customer = await stripe.customers.retrieve(customerId);
      const customerEmail = customer.deleted ? '' : customer.email || '';
      const customerName = customer.deleted ? '' : customer.name || '';

      // Split customer name into first and last name for metadata
      const nameParts = customerName?.trim().split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      const upsellPaymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          // Customer info
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_email: customerEmail,
          customer_phone: '',

          // Funnel tracking
          funnel_type: 'upsell',
          type: product_id === 'tracksuit' ? 'tracksuit' : 'coaching',
          entry_product: product_id,

          // Product details
          product_name: priceObj.nickname || product_id,
          product_id: product_id,
          price_id: price_id,

          // Upsell tracking
          source: 'upsell',
          original_session_id: session_id,

          // Tracking params (referrer and UTM)
          referrer: trackingParams?.referrer || 'direct',
          utm_source: trackingParams?.utm_source || '',
          utm_medium: trackingParams?.utm_medium || '',
          utm_campaign: trackingParams?.utm_campaign || '',
          utm_term: trackingParams?.utm_term || '',
          utm_content: trackingParams?.utm_content || '',
          fbclid: trackingParams?.fbclid || '',
          session_id: trackingParams?.session_id || '',
          event_id: trackingParams?.event_id || '',

          // Cookie tracking data - each field as separate metadata
          ...prepareCookieDataForStripe(cookieData),
        },
      })

      // Check if requires action (3DS)
      if (upsellPaymentIntent.status === 'requires_action') {
        return NextResponse.json({
          requires_action: true,
          client_secret: upsellPaymentIntent.client_secret,
        })
      }

      // Check if succeeded
      if (upsellPaymentIntent.status === 'succeeded') {
        try { await logger.completed(`Upsell payment succeeded for ${customerEmail}`, { paymentIntentId: upsellPaymentIntent.id, email: customerEmail, amount: amount / 100, currency, productId: product_id, type: 'one-time' }); } catch {}


        // Send Facebook Purchase event for upsell
        try {
          const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1474540100541059';
          const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
          const FB_CONVERSIONS_API_URL = `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events`;

          // Hash email for Facebook
          async function hashSHA256(text: string): Promise<string> {
            const normalized = text.toLowerCase().trim();
            const encoder = new TextEncoder();
            const data = encoder.encode(normalized);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          }

          const eventTime = Math.floor(Date.now() / 1000);
          const hashedEmail = customerEmail ? await hashSHA256(customerEmail) : null;

          // Build Facebook event
          const fbEventData = {
            event_name: 'Purchase',
            event_time: eventTime,
            event_id: `server_upsell_${upsellPaymentIntent.id}`,
            event_source_url: 'https://oracleboxing.com/success',
            action_source: 'website',
            user_data: {
              em: hashedEmail ? [hashedEmail] : [],
            },
            custom_data: {
              value: amount / 100,
              currency: currency.toUpperCase(),
              content_ids: [product_id],
              content_type: 'product',
              num_items: 1,
              contents: [{
                id: product_id,
                quantity: 1,
                item_price: amount / 100,
              }],
              // Add cookie tracking data if available
              ...(cookieData || {}),
            },
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
            console.error('❌ Facebook CAPI upsell Purchase error:', fbResult);
          }
        } catch (fbError) {
          console.error('❌ Failed to send upsell Purchase to Facebook CAPI:', fbError);
        }

        return NextResponse.json({
          success: true,
          payment_intent_id: upsellPaymentIntent.id,
        })
      }

      // Handle other statuses
      return NextResponse.json(
        { error: `Payment ${upsellPaymentIntent.status}` },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Route /api/upsell/charge failed:', error)

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: 'Your card was declined' },
        { status: 402 }
      )
    }

    if (error.type === 'StripeInvalidRequestError') {
      console.error('❌ UPSELL: Invalid request - check session ID format')
    }

    try { await logger.failed(error.message, { type: error.type, code: error.code }); } catch {}

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
