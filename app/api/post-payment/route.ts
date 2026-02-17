import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import Stripe from 'stripe'
import { handle21DCPayment, handleMembershipPayment, handleCoachingPayment } from '@/lib/post-payment-handler'

// Internal endpoint called after payment_intent.succeeded
// Handles SendGrid lists, Slack notifications, Attio CRM
export async function POST(req: NextRequest) {
  try {
    // Auth: require internal API token
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || token !== process.env.INTERNAL_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentIntentId, isTestMode } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'paymentIntentId required' }, { status: 400 })
    }

    // Use test Stripe client if isTestMode flag is set or PI starts with pi_ from test
    let stripeClient = stripe
    if (isTestMode && process.env.STRIPE_TEST_SECRET_KEY) {
      stripeClient = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as any,
        typescript: true,
      })
    }

    const pi = await stripeClient.paymentIntents.retrieve(paymentIntentId)

    if (pi.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not succeeded' }, { status: 400 })
    }

    const funnelType = pi.metadata?.funnel_type || pi.metadata?.type || ''

    if (funnelType === '21dc') {
      const result = await handle21DCPayment(pi)
      return NextResponse.json(result)
    } else if (funnelType === 'membership') {
      const result = await handleMembershipPayment(pi)
      return NextResponse.json(result)
    } else if (funnelType === 'coaching' || funnelType === 'internal_coaching_tool') {
      const result = await handleCoachingPayment(pi)
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ success: true, skipped: true, reason: `Unknown funnel type: ${funnelType}` })
    }
  } catch (error: any) {
    console.error('Post-payment handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
