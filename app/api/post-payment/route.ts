import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { handle21DCPayment, handleMembershipPayment, handleCoachingPayment } from '@/lib/post-payment-handler'

// Internal endpoint called after payment_intent.succeeded
// Handles SendGrid lists, Slack notifications, Attio CRM
export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'paymentIntentId required' }, { status: 400 })
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
