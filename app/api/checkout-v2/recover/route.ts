import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentIntentId = searchParams.get('payment_intent')

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'payment_intent is required' },
        { status: 400 }
      )
    }

    // Retrieve the PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'PaymentIntent not found' },
        { status: 404 }
      )
    }

    // Extract customer info from metadata
    const metadata = paymentIntent.metadata || {}
    const customerInfo = {
      firstName: metadata.customer_first_name || '',
      lastName: metadata.customer_last_name || '',
      email: metadata.customer_email || '',
      phone: metadata.customer_phone || '',
    }

    // Extract add-ons from line_items metadata (if stored)
    let addOns: string[] = []
    if (metadata.add_ons_included) {
      // Parse add-ons from comma-separated metadata
      addOns = metadata.add_ons_included.split(',').filter(Boolean)
    }

    console.log('🔄 Recovered PaymentIntent:', {
      id: paymentIntentId,
      status: paymentIntent.status,
      customerInfo,
      addOns,
      hasClientSecret: !!paymentIntent.client_secret,
    })

    return NextResponse.json({
      customerInfo,
      addOns,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      clientSecret: paymentIntent.client_secret, // Include client secret for recovery
    })
  } catch (error: any) {
    console.error('Route /api/checkout-v2/recover failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
