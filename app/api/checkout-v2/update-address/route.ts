import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, billingAddress } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'PaymentIntent ID is required' },
        { status: 400 }
      )
    }

    // Fetch current PaymentIntent to preserve existing metadata
    const currentPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Update PaymentIntent with billing address in metadata
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...currentPaymentIntent.metadata,
        // Billing address fields
        billing_city: billingAddress?.city || '',
        billing_country: billingAddress?.country || '',
        billing_line1: billingAddress?.line1 || '',
        billing_line2: billingAddress?.line2 || '',
        billing_postal_code: billingAddress?.postal_code || '',
        billing_state: billingAddress?.state || '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Route /api/checkout-v2/update-address failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
