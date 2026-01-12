import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { setupIntentId } = body

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
    const tier = metadata.tier || 'tier_1'
    const coach = metadata.coach || 'Toni'
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

    // Create a price for the subscription
    const price = await stripe.prices.create({
      unit_amount: monthlyAmount,
      currency: 'usd',
      recurring: { interval: 'month' },
      product_data: {
        name: productName,
        metadata: {
          type: 'coaching_subscription',
          tier,
          coach,
        },
      },
    })

    // Create the subscription - it will charge immediately since payment method is set
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      default_payment_method: paymentMethodId,
      metadata: {
        ...metadata,
        setup_intent_id: setupIntentId,
      },
    })

    console.log('✅ Subscription created from SetupIntent:', {
      subscriptionId: subscription.id,
      customerId,
      monthlyAmount: monthlyAmount / 100,
      tier,
      coach,
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    })
  } catch (error: any) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
