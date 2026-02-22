import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

/**
 * Handle PaymentIntent retrieval (from custom checkout v2)
 * PaymentIntents store all metadata and customer info differently than Checkout Sessions
 */
async function handlePaymentIntent(paymentIntentId: string) {
  // Retrieve the PaymentIntent with customer expansion
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ['customer'],
  });

  // Get currency and format amount
  const currency = paymentIntent.currency?.toUpperCase() || 'USD';
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'CAD': 'CA$',
    'AUD': 'A$',
    'AED': 'AED ',
  };
  const currencySymbol = currencySymbols[currency] || '$';
  const amountPaid = `${currencySymbol}${(paymentIntent.amount / 100).toFixed(2)}`;

  // Extract customer info from metadata or expanded customer
  const metadata = paymentIntent.metadata || {};
  const customer = paymentIntent.customer as any;
  const customerName = metadata.customer_first_name || customer?.name || 'Customer';
  const customerEmail = metadata.customer_email || customer?.email || '';

  // Parse product descriptions from metadata
  const productDescriptions = metadata.product_descriptions || 'Product';

  // Parse line items from metadata (stored as JSON string of price IDs)
  let lineItemsData: any[] = [];
  try {
    const lineItemPriceIds = metadata.line_items ? JSON.parse(metadata.line_items) : [];
    // Create a simplified line_items structure for compatibility
    lineItemsData = lineItemPriceIds.map((priceId: string, index: number) => ({
      description: productDescriptions.split(', ')[index] || 'Product',
      quantity: 1,
      price: {
        id: priceId,
        unit_amount: Math.round(paymentIntent.amount / lineItemPriceIds.length), // Approximate
        product: {
          id: `prod_from_${priceId}`,
          name: productDescriptions.split(', ')[index] || 'Product',
        },
      },
    }));
  } catch (e) {
    console.error('Error parsing line items from metadata:', e);
  }

  // Extract tracking params from metadata
  const trackingParams = {
    referrer: metadata.referrer || 'direct',
    utm_source: metadata.first_utm_source || metadata.utm_source || undefined,
    utm_medium: metadata.first_utm_medium || metadata.utm_medium || undefined,
    utm_campaign: metadata.first_utm_campaign || metadata.utm_campaign || undefined,
    utm_term: metadata.first_utm_term || undefined,
    utm_content: metadata.first_utm_content || undefined,
  };

  return NextResponse.json({
    // Original format for backward compatibility
    customerName,
    customerEmail,
    amountPaid,
    productPurchased: productDescriptions,
    currency,
    funnelType: metadata.funnel_type || '21dc',
    sessionId: paymentIntentId,
    productMetadata: {
      funnel: metadata.funnel_type || '21dc',
      product_metadata: metadata.product_metadata || '21dc_entry',
    },
    trackingParams,
    metadata,

    // Full session data for Purchase tracking (compatible format)
    amount_total: paymentIntent.amount,
    customer_details: {
      name: customerName,
      email: customerEmail,
    },
    customer_email: customerEmail,
    line_items: {
      data: lineItemsData,
    },
  });
}

/**
 * Handle Subscription retrieval (from coaching monthly subscriptions)
 */
async function handleSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'items.data.price.product', 'latest_invoice'],
  });

  const customer = subscription.customer as any;
  const metadata = subscription.metadata || {};
  const item = subscription.items.data[0];
  const price = item?.price;
  const product = price?.product as any;

  const currency = price?.currency?.toUpperCase() || 'USD';
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'CAD': 'CA$',
    'AUD': 'A$',
    'AED': 'AED ',
  };
  const currencySymbol = currencySymbols[currency] || '$';
  const amount = price?.unit_amount || 0;
  const amountPaid = `${currencySymbol}${(amount / 100).toFixed(2)}/month`;

  const customerName = metadata.customer_first_name
    ? `${metadata.customer_first_name} ${metadata.customer_last_name || ''}`
    : customer?.name || 'Customer';
  const customerEmail = metadata.customer_email || customer?.email || '';

  return NextResponse.json({
    customerName: customerName.trim(),
    customerEmail,
    amountPaid,
    productPurchased: product?.name || metadata.product_name || '1-on-1 Coaching (Monthly)',
    currency,
    funnelType: 'coaching',
    sessionId: subscriptionId,
    productMetadata: {
      funnel: 'coaching',
      product_metadata: 'coaching_subscription',
    },
    trackingParams: {
      referrer: metadata.first_referrer || metadata.referrer || 'direct',
      utm_source: metadata.first_utm_source || metadata.utm_source || undefined,
      utm_medium: metadata.first_utm_medium || metadata.utm_medium || undefined,
      utm_campaign: metadata.first_utm_campaign || metadata.utm_campaign || undefined,
      utm_term: metadata.first_utm_term || undefined,
      utm_content: metadata.first_utm_content || undefined,
    },
    metadata,
    amount_total: amount,
    customer_details: {
      name: customerName.trim(),
      email: customerEmail,
    },
    customer_email: customerEmail,
    line_items: {
      data: [
        {
          description: product?.name || '1-on-1 Coaching (Monthly)',
          quantity: 1,
          price: {
            id: price?.id,
            unit_amount: amount,
            product: {
              id: product?.id || 'coaching_subscription',
              name: product?.name || '1-on-1 Coaching (Monthly)',
            },
          },
        },
      ],
    },
    isSubscription: true,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Handle case where params might appear multiple times (e.g., from PayPal redirects)
  const sessionIdParam = searchParams.get('session_id');
  const paymentIntentParam = searchParams.get('payment_intent');
  const subscriptionParam = searchParams.get('subscription');

  // Ensure we have strings (get() already returns first value if multiple)
  const sessionId = typeof sessionIdParam === 'string' ? sessionIdParam : null;
  const paymentIntentId = typeof paymentIntentParam === 'string' ? paymentIntentParam : null;
  const subscriptionId = typeof subscriptionParam === 'string' ? subscriptionParam : null;

  try {
    // Support session_id, payment_intent, and subscription params
    const identifier = sessionId || paymentIntentId || subscriptionId;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Session ID, Payment Intent ID, or Subscription ID is required' },
        { status: 400 }
      );
    }

    // DEV MODE: Return mock data for test session ID
    if (identifier === 'test_preview' || identifier.startsWith('cs_test_preview')) {
      return NextResponse.json({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        amountPaid: '$397',
        productPurchased: 'Oracle Boxing Bundle',
        currency: 'USD',
        funnelType: 'course',
        sessionId: identifier,
        productMetadata: {
          funnel: 'course',
          product_metadata: 'obm'
        },
        trackingParams: {
          referrer: 'direct',
          utm_source: 'test',
          utm_campaign: 'preview'
        },
        metadata: {
          product_metadata: 'obm',
          funnel_type: 'course'
        },
        amount_total: 39700,
        customer_details: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        customer_email: 'john@example.com',
        line_items: {
          data: [
            {
              description: 'Oracle Boxing Bundle',
              quantity: 1,
              price: {
                unit_amount: 39700,
                product: {
                  id: 'prod_test_bundle',
                  name: 'Oracle Boxing Bundle'
                }
              }
            }
          ]
        }
      });
    }

    // Check if this is a PaymentIntent (starts with pi_), Subscription (starts with sub_), or Checkout Session
    const isPaymentIntent = identifier.startsWith('pi_');
    const isSubscription = identifier.startsWith('sub_');

    if (isSubscription) {
      // Handle Subscription (from coaching monthly)
      return await handleSubscription(identifier);
    }

    if (isPaymentIntent) {
      // Handle PaymentIntent (from custom checkout v2)
      return await handlePaymentIntent(identifier);
    }

    // Retrieve the checkout session from Stripe with expanded line items
    const session = await stripe.checkout.sessions.retrieve(identifier, {
      expand: ['line_items', 'line_items.data.price.product', 'customer', 'payment_intent'],
    });

    // Extract relevant data
    const customerName = session.customer_details?.name || session.metadata?.customer_first_name || 'Customer';
    const customerEmail = session.customer_details?.email || session.customer_email || '';

    // Get currency from session or payment intent
    const currency = session.currency?.toUpperCase() || 'USD';

    // Currency symbol mapping
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'CA$',
      'AUD': 'A$',
      'AED': 'AED ',
    };
    const currencySymbol = currencySymbols[currency] || '$';

    const amountPaid = session.amount_total
      ? `${currencySymbol}${(session.amount_total / 100).toFixed(2)}`
      : `${currencySymbol}0`;

    // Get product name from line items
    const lineItems = session.line_items?.data || [];
    const productPurchased = lineItems.length > 0
      ? lineItems.map(item => item.description).join(', ')
      : 'Product';

    // Determine funnel type from metadata
    const funnelType = session.metadata?.funnel_type || 'course';

    // Get product metadata to determine if it's a membership
    const productMetadata = {
      funnel: session.metadata?.funnel_type || 'course'
    };

    // Extract tracking params from metadata (check first_utm_* fields first for first-touch attribution)
    const trackingParams = {
      referrer: session.metadata?.first_referrer || session.metadata?.referrer || 'direct',
      utm_source: session.metadata?.first_utm_source || session.metadata?.utm_source || undefined,
      utm_medium: session.metadata?.first_utm_medium || session.metadata?.utm_medium || undefined,
      utm_campaign: session.metadata?.first_utm_campaign || session.metadata?.utm_campaign || undefined,
      utm_term: session.metadata?.first_utm_term || session.metadata?.utm_term || undefined,
      utm_content: session.metadata?.first_utm_content || session.metadata?.utm_content || undefined,
    };

    // Return full session data for Purchase event tracking
    return NextResponse.json({
      // Original format for backward compatibility
      customerName,
      customerEmail,
      amountPaid,
      productPurchased,
      currency,
      funnelType,
      sessionId,
      productMetadata,
      trackingParams,
      metadata: session.metadata,

      // Full session data for Purchase tracking
      amount_total: session.amount_total,
      customer_details: session.customer_details,
      customer_email: session.customer_email,
      line_items: session.line_items,
    });
  } catch (error: any) {
    console.error('Session retrieval error:', error);

    // If session doesn't exist, return fallback data with homepage URL
    if (error.type === 'StripeInvalidRequestError' && error.code === 'resource_missing') {
      return NextResponse.json({
        customerName: 'Customer',
        customerEmail: '',
        amountPaid: '$0',
        productPurchased: 'Product',
        currency: 'USD',
        funnelType: 'course',
        sessionId: searchParams.get('session_id') || '',
        productMetadata: { funnel: 'course' },
        trackingParams: { referrer: 'direct' },
        metadata: {},
        amount_total: 0,
        customer_details: null,
        customer_email: '',
        line_items: null,
        checkout_url: 'https://oracleboxing.com',
      });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
