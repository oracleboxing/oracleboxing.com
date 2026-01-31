import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

/**
 * GET /api/payment-intent?pi=pi_xxx
 * GET /api/payment-intent?setup=seti_xxx
 *
 * Returns the client_secret for a given PaymentIntent or SetupIntent ID.
 *
 * This is safe because:
 * - The client_secret is only useful with the publishable key (already public)
 * - It can only confirm the specific payment, not access account data
 * - But keeping it out of URLs prevents logging/history/referrer leaks
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentIntentId = searchParams.get('pi')
  const setupIntentId = searchParams.get('setup')

  try {
    if (paymentIntentId) {
      // Validate PaymentIntent ID format
      if (!paymentIntentId.startsWith('pi_')) {
        return NextResponse.json(
          { error: 'Invalid PaymentIntent ID' },
          { status: 400 }
        )
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      })
    }

    if (setupIntentId) {
      // Validate SetupIntent ID format
      if (!setupIntentId.startsWith('seti_')) {
        return NextResponse.json(
          { error: 'Invalid SetupIntent ID' },
          { status: 400 }
        )
      }

      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

      return NextResponse.json({
        clientSecret: setupIntent.client_secret,
      })
    }

    return NextResponse.json(
      { error: 'Missing pi or setup parameter' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error retrieving intent:', error)

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to retrieve payment details' },
      { status: 500 }
    )
  }
}
