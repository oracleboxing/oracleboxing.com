import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paymentIntentId, billingAddress } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Update PaymentIntent metadata with billing address
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
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
    console.error('Route /api/coaching-checkout/update-address failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
