import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    const plan = (session.metadata?.plan as 'monthly' | 'annual') || 'monthly'
    const productId = session.metadata?.product_id || `membership-${plan}`
    const customerEmail = session.customer_details?.email || session.metadata?.customer_email || ''

    let subscriptionId: string | undefined
    let amount: number

    if (session.subscription && typeof session.subscription === 'object') {
      subscriptionId = session.subscription.id
      // Amount from subscription's latest invoice items
      const sub = session.subscription as any
      amount = sub.items?.data?.[0]?.price?.unit_amount || (plan === 'annual' ? 89700 : 9700)
    } else {
      amount = plan === 'annual' ? 89700 : 9700
    }

    return NextResponse.json({
      amount,
      plan,
      productIds: [productId],
      customerEmail,
      subscriptionId,
    })
  } catch (error: any) {
    console.error('session-details retrieval failed:', error)
    return NextResponse.json({ error: 'Failed to retrieve session details' }, { status: 500 })
  }
}
