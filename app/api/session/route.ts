import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  try {

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe with expanded line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
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

    // Extract tracking params from metadata
    const trackingParams = {
      referrer: session.metadata?.referrer || 'direct',
      utm_source: session.metadata?.utm_source || undefined,
      utm_medium: session.metadata?.utm_medium || undefined,
      utm_campaign: session.metadata?.utm_campaign || undefined,
      utm_term: session.metadata?.utm_term || undefined,
      utm_content: session.metadata?.utm_content || undefined,
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
      console.log('Session not found, using fallback checkout URL');
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
      { error: error.message || 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
