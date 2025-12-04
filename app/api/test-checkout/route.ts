import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(req: NextRequest) {
  try {
    const { price_id, product_name } = await req.json()

    // Create Stripe Checkout Session with customer creation and payment method save
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      customer_creation: 'always', // Always create a customer
      payment_intent_data: {
        setup_future_usage: 'off_session', // Save payment method for future use
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/test-checkout`,
      metadata: {
        product_name: product_name,
        test: 'true',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Test checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
