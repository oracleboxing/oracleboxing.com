import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { notifyOps } from '@/lib/slack-notify'

// Called from the membership success page after payment succeeds.
// Creates the Stripe subscription using the saved payment method.
// First billing is skipped (trial) since we already collected payment via PaymentIntent.
export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'paymentIntentId required' }, { status: 400 })
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (pi.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not yet succeeded' }, { status: 400 })
    }

    const customerId = pi.customer as string
    const membershipPriceId = pi.metadata?.membership_price_id
    const funnelType = pi.metadata?.funnel_type

    if (funnelType !== 'membership' || !membershipPriceId) {
      return NextResponse.json({ error: 'Not a membership payment' }, { status: 400 })
    }

    // Idempotency: check if subscription already exists
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      price: membershipPriceId,
      limit: 1,
    })

    const activeSub = existingSubs.data.find(s => ['active', 'trialing'].includes(s.status))
    if (activeSub) {
      return NextResponse.json({ success: true, subscriptionId: activeSub.id, alreadyExists: true, amount: pi.amount, plan: pi.metadata?.plan || 'monthly', productIds: ['membership'] })
    }

    // Get payment method and set as default
    const paymentMethodId = pi.payment_method as string
    if (!paymentMethodId) {
      return NextResponse.json({ error: 'No payment method found' }, { status: 500 })
    }

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // Determine trial end based on billing interval (skip first charge - already paid)
    const price = await stripe.prices.retrieve(membershipPriceId)
    const interval = price.recurring?.interval
    const now = Math.floor(Date.now() / 1000)
    const trialEnd = interval === 'year'
      ? now + (365 * 24 * 60 * 60)
      : now + (30 * 24 * 60 * 60)

    // Create subscription with trial (first period already paid)
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: membershipPriceId }],
      default_payment_method: paymentMethodId,
      trial_end: trialEnd,
      metadata: {
        activated_from_pi: paymentIntentId,
        first_payment_collected: 'true',
        customer_email: pi.metadata?.customer_email || '',
        plan: pi.metadata?.plan || '',
        funnel_type: 'membership',
      },
    })

    const amountPaid = (pi.amount || 0) / 100
    const planLabel = (pi.metadata?.plan === 'annual' || pi.metadata?.upgraded_to_annual === 'true') ? 'Annual' : 'Monthly'
    const addOns = pi.metadata?.add_ons_included ? pi.metadata.add_ons_included.split(',').filter(Boolean) : []
    const addOnText = addOns.length > 0 ? ` + ${addOns.join(', ')}` : ''

    console.log('Membership subscription created:', subscription.id, 'trial_end:', new Date(trialEnd * 1000).toISOString())
    notifyOps(`💰 Membership purchase - ${pi.metadata?.customer_email} paid $${amountPaid} (${planLabel}${addOnText}) sub: ${subscription.id}`)

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      amount: pi.amount,
      plan: planLabel.toLowerCase(),
      productIds: ['membership', ...addOns],
    })
  } catch (error: any) {
    console.error('Activate membership failed:', error)
    notifyOps(`❌ Membership activation failed - ${error.message}`)
    return NextResponse.json({ error: 'Activation failed. Please contact support.' }, { status: 500 })
  }
}
