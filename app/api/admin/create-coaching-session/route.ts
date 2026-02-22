import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import {
  CoachingTier,
  CustomerDiscount,
  PaymentPlan,
  Coach,
  calculateCoachingPrice,
  createCoachingMetadata,
  TIER_PRICES_BY_COACH,
  CUSTOMER_DISCOUNTS,
  getTierDisplayName,
  formatPrice,
} from '@/lib/coaching-pricing'
import { requireAdmin } from '@/lib/auth'
import { createWorkflowLogger } from '@/lib/workflow-logger'
import { mintIntentToken } from '@/lib/security/intent-token'

export async function POST(req: NextRequest) {
  // Require admin authentication
  const authError = await requireAdmin()
  if (authError) return authError

  const logger = createWorkflowLogger({ workflowName: 'admin-coaching-session', workflowType: 'action', notifySlack: true });
  try {
    const body = await req.json()
    const {
      email,
      name,
      tier,
      customerDiscount,
      sixMonthCommitment,
      paymentPlan,
      coach,
      trackingParams,
    } = body as {
      email: string
      name: string
      tier: CoachingTier
      customerDiscount: CustomerDiscount
      sixMonthCommitment: boolean
      paymentPlan: PaymentPlan
      coach: Coach
      trackingParams?: {
        referrer?: string
        utm_source?: string
        utm_medium?: string
        utm_campaign?: string
        utm_term?: string
        utm_content?: string
        fbclid?: string
        session_id?: string
        event_id?: string
      }
    }

    try { await logger.started('Admin coaching session creation', { email, name, tier, coach, paymentPlan, customerDiscount, sixMonthCommitment }); } catch {}

    // Validate required fields
    if (!email || !name || !tier || !paymentPlan || !coach) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate pricing (coach-aware)
    const calculation = calculateCoachingPrice(
      tier,
      customerDiscount || 'none',
      sixMonthCommitment || false,
      paymentPlan,
      coach
    )

    // Split name into first and last name for metadata
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

    // Create base metadata (pricing details)
    const pricingMetadata = createCoachingMetadata(
      tier,
      customerDiscount || 'none',
      sixMonthCommitment || false,
      paymentPlan,
      coach,
      calculation
    )

    // Create rich metadata matching the 6WC structure
    const fullMetadata = {
      // Customer info
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: email,
      customer_phone: '',

      // Pricing metadata from calculation
      ...pricingMetadata,

      // Keep type as 'coaching' from pricingMetadata for consistency

      // Tracking params (referrer and UTM)
      referrer: trackingParams?.referrer || 'internal_coaching_tool',
      utm_source: trackingParams?.utm_source || 'internal',
      utm_medium: trackingParams?.utm_medium || 'admin_tool',
      utm_campaign: trackingParams?.utm_campaign || 'coaching',
      utm_term: trackingParams?.utm_term || '',
      utm_content: trackingParams?.utm_content || '',
      fbclid: trackingParams?.fbclid || '',
      session_id: trackingParams?.session_id || '',
      event_id: trackingParams?.event_id || '',
    }

    // Get base URL for redirect - use headers for server-side
    const host = req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = host ? `${protocol}://${host}` : 'https://oracleboxing.com'

    // Build detailed product description with price breakdown
    const tierName = getTierDisplayName(tier)
    const tierPrice = TIER_PRICES_BY_COACH[coach][tier]

    let description = `${tierName} 1-on-1 Coaching\n\n`

    // Base price breakdown
    if (sixMonthCommitment) {
      description += `Base: ${formatPrice(tierPrice)} × 2 months = ${formatPrice(tierPrice * 2)}\n`
    } else {
      description += `Base: ${formatPrice(tierPrice)}\n`
    }

    // Customer discount
    if (customerDiscount !== 'none') {
      description += `Challenge Winner Discount: -${formatPrice(CUSTOMER_DISCOUNTS[customerDiscount])}\n`
      description += `Subtotal: ${formatPrice(calculation.subtotal)}\n`
    }

    // 6-month commitment discount
    if (sixMonthCommitment) {
      description += `6-Month Commitment (10% off): -${formatPrice(calculation.sixMonthDiscount)}\n`
    }

    // Final price
    description += `\nTotal: ${formatPrice(calculation.finalPrice)}`

    // Payment plan details
    if (paymentPlan === 'split_2') {
      description += `\n\nSplit Payment: ${formatPrice(calculation.monthlyAmount!)} × 2 months`
    } else if (paymentPlan === 'monthly') {
      description += `\n\nMonthly Payment: ${formatPrice(calculation.monthlyAmount!)}/month × 3 months`
    }

    // Create or find customer (needed for all payment types now)
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        name: name.trim(),
        metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      })
    }

    const buildCheckoutUrl = (params: Record<string, string>) => {
      const url = new URL('/coaching-checkout', baseUrl)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return url.toString()
    }

    // For ONE-TIME PAYMENTS (full plan), use PaymentIntent with custom checkout page
    if (paymentPlan === 'full') {
      // Create PaymentIntent for custom checkout page with automatic tax (inclusive)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculation.finalPrice * 100, // Convert to cents (tax inclusive)
        currency: 'usd',
        customer: customer.id,
        setup_future_usage: 'off_session',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...fullMetadata,
          product_name: `1-on-1 Coaching - ${tierName}`,
          product_description: description,
          tax_inclusive: 'true', // Flag that price includes tax
        },
      })

      const paymentIntentToken = mintIntentToken({
        intentId: paymentIntent.id,
        purpose: 'payment_intent_client_secret_fetch',
        customerEmail: email,
      })

      try {
        const { notifyOps } = await import('@/lib/slack-notify');
        await notifyOps(`Coaching link created for ${name}`, { blocks: [
          { type: 'context', elements: [{ type: 'mrkdwn', text: `🔗 *Coaching link created* - *${name}* (${email}) | ${getTierDisplayName(tier)} w/ ${coach} | $${calculation.finalPrice} full payment` }] }
        ]});
        await logger.completed(`Coaching session created (full) for ${email}`, { paymentIntentId: paymentIntent.id, email, tier, coach, paymentPlan, amount: calculation.finalPrice });
      } catch {}

      // Build custom checkout URL with payment intent info
      const checkoutUrl = buildCheckoutUrl({
        pi: paymentIntent.id,
        pit: paymentIntentToken,
      })

      return NextResponse.json({
        url: checkoutUrl,
        paymentIntentId: paymentIntent.id,
        paymentIntentToken,
        calculation,
        useCustomCheckout: true,
      })
    }

    // For SPLIT BY 2 - Use PaymentIntent for first payment, schedule second for 30 days
    if (paymentPlan === 'split_2') {
      // Create PaymentIntent for first payment (custom checkout page) with automatic tax (inclusive)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculation.monthlyAmount! * 100, // First payment amount in cents (tax inclusive)
        currency: 'usd',
        customer: customer.id,
        setup_future_usage: 'off_session', // Save card for second payment
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...fullMetadata,
          product_name: `1-on-1 Coaching - ${tierName} (Payment 1 of 2)`,
          product_description: description,
          tax_inclusive: 'true', // Flag that price includes tax
          split_payment: 'true',
          payment_number: '1',
          total_payments: '2',
          second_payment_amount: (calculation.monthlyAmount! * 100).toString(),
          second_payment_due_days: '30',
        },
      })

      const paymentIntentToken = mintIntentToken({
        intentId: paymentIntent.id,
        purpose: 'payment_intent_client_secret_fetch',
        customerEmail: email,
      })

      try {
        const { notifyOps } = await import('@/lib/slack-notify');
        await notifyOps(`Coaching link created for ${name}`, { blocks: [
          { type: 'context', elements: [{ type: 'mrkdwn', text: `🔗 *Coaching link created* - *${name}* (${email}) | ${getTierDisplayName(tier)} w/ ${coach} | $${calculation.monthlyAmount} × 2 split` }] }
        ]});
        await logger.completed(`Coaching session created (split) for ${email}`, { paymentIntentId: paymentIntent.id, email, tier, coach, paymentPlan, amount: calculation.monthlyAmount });
      } catch {}

      // Build custom checkout URL with payment intent info
      const checkoutUrl = buildCheckoutUrl({
        pi: paymentIntent.id,
        pit: paymentIntentToken,
      })

      return NextResponse.json({
        url: checkoutUrl,
        paymentIntentId: paymentIntent.id,
        paymentIntentToken,
        calculation,
        useCustomCheckout: true,
        splitPayment: true,
      })
    }

    // For MONTHLY subscriptions, create a SetupIntent to collect card, then create subscription after
    // This allows us to use the custom checkout page while still setting up recurring billing
    if (paymentPlan === 'monthly') {
      // Create a SetupIntent to collect and save the payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        usage: 'off_session', // We'll use this for future subscription payments
        metadata: {
          ...fullMetadata,
          product_name: `1-on-1 Coaching - ${tierName} (Monthly)`,
          product_description: description,
          monthly_amount: (calculation.monthlyAmount! * 100).toString(),
          setup_for_subscription: 'true',
          tax_inclusive: 'true', // Flag that price includes tax
          tier,
          coach,
        },
      })

      const setupIntentToken = mintIntentToken({
        intentId: setupIntent.id,
        purpose: 'payment_intent_client_secret_fetch',
        customerEmail: email,
      })

      try {
        const { notifyOps } = await import('@/lib/slack-notify');
        await notifyOps(`Coaching link created for ${name}`, { blocks: [
          { type: 'context', elements: [{ type: 'mrkdwn', text: `🔗 *Coaching link created* - *${name}* (${email}) | ${getTierDisplayName(tier)} w/ ${coach} | $${calculation.monthlyAmount}/mo × 3` }] }
        ]});
        await logger.completed(`Coaching session created (monthly) for ${email}`, { setupIntentId: setupIntent.id, email, tier, coach, paymentPlan, monthlyAmount: calculation.monthlyAmount });
      } catch {}

      // Build custom checkout URL with setup intent info
      const checkoutUrl = buildCheckoutUrl({
        setup: setupIntent.id,
        monthly: 'true',
        pit: setupIntentToken,
      })

      return NextResponse.json({
        url: checkoutUrl,
        setupIntentId: setupIntent.id,
        setupIntentToken,
        calculation,
        useCustomCheckout: true,
        setupForSubscription: true,
      })
    }

    return NextResponse.json(
      { error: 'Invalid payment plan' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Route /api/admin/create-coaching-session failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }); } catch {}
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
