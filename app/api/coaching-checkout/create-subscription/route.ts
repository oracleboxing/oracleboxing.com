import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import {
  Coach,
  CoachingTier,
  COACHING_PRODUCT_TIER_1,
  COACHING_PRODUCT_TIER_2,
  MONTHLY_RATES_BY_COACH,
  MONTHLY_PRICE_IDS_BY_COACH,
} from '@/lib/coaching-pricing'
import { createWorkflowLogger } from '@/lib/workflow-logger'

export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'coaching-subscription-create', workflowType: 'checkout', notifySlack: true });
  try {
    const body = await req.json()
    const { setupIntentId } = body
    try { await logger.started('Coaching subscription creation requested', { setupIntentId }); } catch {}

    if (!setupIntentId) {
      return NextResponse.json(
        { error: 'Setup intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the SetupIntent to get metadata and payment method
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (!setupIntent) {
      return NextResponse.json(
        { error: 'Setup intent not found' },
        { status: 404 }
      )
    }

    if (setupIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Setup intent has not been confirmed yet' },
        { status: 400 }
      )
    }

    const metadata = setupIntent.metadata || {}
    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string

    if (!customerId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing customer or payment method' },
        { status: 400 }
      )
    }

    const monthlyAmount = parseInt(metadata.monthly_amount || '0', 10)
    const tier = (metadata.tier || 'tier_1') as CoachingTier
    const coach = (metadata.coach || 'Toni') as Coach
    const productName = metadata.product_name || '1-on-1 Coaching (Monthly)'

    if (!monthlyAmount) {
      return NextResponse.json(
        { error: 'Monthly amount not found in setup intent metadata' },
        { status: 400 }
      )
    }

    // Set the payment method as the customer's default
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Select product and price based on tier
    const productId = tier === 'tier_2' ? COACHING_PRODUCT_TIER_2 : COACHING_PRODUCT_TIER_1

    // Use fixed price IDs for standard rates (coach-aware), otherwise create a custom price
    const standardRate = MONTHLY_RATES_BY_COACH[coach][tier] * 100
    const fixedPriceId = MONTHLY_PRICE_IDS_BY_COACH[coach][tier]

    let priceId: string

    if (monthlyAmount === standardRate) {
      // Use the pre-created fixed price for this coach
      priceId = fixedPriceId
    } else {
      // Create a custom price for non-standard amounts (e.g., with discounts)
      const customPrice = await stripe.prices.create({
        unit_amount: monthlyAmount,
        currency: 'usd',
        recurring: { interval: 'month' },
        product: productId,
      })
      priceId = customPrice.id
    }

    // Create the subscription - it will charge immediately since payment method is set
    // Include all metadata from SetupIntent plus ensure type=coaching for invoice events
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      metadata: {
        ...metadata,
        type: 'coaching', // Ensure type is set for invoice.paid webhook
        setup_intent_id: setupIntentId,
      },
      // Add payment_intent_data via subscription_data to ensure PaymentIntent has metadata
      payment_settings: {
        payment_method_types: ['card'],
      },
    })

    try { await logger.completed(`Coaching subscription created for ${metadata.customer_email || customerId}`, { subscriptionId: subscription.id, customerId, email: metadata.customer_email, tier, coach, monthlyAmount: monthlyAmount / 100, setupIntentId }); } catch {}


    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    })
  } catch (error: any) {
    console.error('Route /api/coaching-checkout/create-subscription failed:', error)
    try { await logger.failed(error.message, { stack: error.stack }); } catch {}
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
