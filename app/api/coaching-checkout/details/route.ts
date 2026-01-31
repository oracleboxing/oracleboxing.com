import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentIntentId = searchParams.get('pi')
    const setupIntentId = searchParams.get('setup')

    // Handle SetupIntent for monthly subscriptions
    if (setupIntentId) {
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

      if (!setupIntent) {
        return NextResponse.json(
          { error: 'Setup intent not found' },
          { status: 404 }
        )
      }

      // Check if already completed
      if (setupIntent.status === 'succeeded') {
        return NextResponse.json(
          { error: 'This setup has already been completed' },
          { status: 400 }
        )
      }

      const metadata = setupIntent.metadata || {}
      const customerName = `${metadata.customer_first_name || ''} ${metadata.customer_last_name || ''}`.trim()
      const customerEmail = metadata.customer_email || ''
      const tier = metadata.tier === 'tier_1' ? 'Tier 1' : metadata.tier === 'tier_2' ? 'Tier 2' : metadata.tier || ''
      const coach = metadata.coach || ''
      const productName = metadata.product_name || '1-on-1 Coaching (Monthly)'
      const productDescription = metadata.product_description || ''
      const monthlyAmount = parseInt(metadata.monthly_amount || '0', 10)

      return NextResponse.json({
        customerName,
        customerEmail,
        stripeCustomerId: setupIntent.customer as string || '',
        tier,
        coach,
        amount: monthlyAmount, // Monthly amount in cents
        productName,
        productDescription,
        sixMonthCommitment: false,
        customerDiscount: 'none',
        discountAmount: 0,
        sixMonthDiscountAmount: 0,
        // Not a split payment
        isSplitPayment: false,
        paymentNumber: '',
        totalPayments: '',
        secondPaymentAmount: 0,
        secondPaymentDueDays: 0,
        // This IS a subscription setup
        isSubscriptionPayment: true,
        monthlyAmount,
      })
    }

    // Handle PaymentIntent (full or split payment)
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID or Setup intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      )
    }

    // Check if already paid
    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json(
        { error: 'This payment has already been completed' },
        { status: 400 }
      )
    }

    // Extract coaching details from metadata
    const metadata = paymentIntent.metadata || {}

    const customerName = `${metadata.customer_first_name || ''} ${metadata.customer_last_name || ''}`.trim()
    const customerEmail = metadata.customer_email || ''
    const tier = metadata.tier === 'tier_1' ? 'Tier 1' : metadata.tier === 'tier_2' ? 'Tier 2' : metadata.tier || ''
    const coach = metadata.coach || ''
    const productName = metadata.product_name || '1-on-1 Coaching'
    const productDescription = metadata.product_description || ''
    const sixMonthCommitment = metadata.six_month_commitment === 'true'
    const customerDiscount = metadata.customer_discount_type || 'none'
    const discountAmount = parseInt(metadata.customer_discount_amount || '0', 10) * 100 // Convert to cents
    const sixMonthDiscountAmount = parseInt(metadata.six_month_discount_amount || '0', 10) * 100 // Convert to cents

    // Split payment details
    const isSplitPayment = metadata.split_payment === 'true'
    const paymentNumber = metadata.payment_number || ''
    const totalPayments = metadata.total_payments || ''
    const secondPaymentAmount = parseInt(metadata.second_payment_amount || '0', 10)
    const secondPaymentDueDays = parseInt(metadata.second_payment_due_days || '30', 10)

    // Subscription payment details
    const isSubscriptionPayment = metadata.subscription_payment === 'true'
    const monthlyAmount = parseInt(metadata.monthly_amount || '0', 10)

    return NextResponse.json({
      customerName,
      customerEmail,
      stripeCustomerId: paymentIntent.customer as string || '',
      tier,
      coach,
      amount: paymentIntent.amount,
      productName,
      productDescription,
      sixMonthCommitment,
      customerDiscount,
      discountAmount,
      sixMonthDiscountAmount,
      // Split payment info
      isSplitPayment,
      paymentNumber,
      totalPayments,
      secondPaymentAmount,
      secondPaymentDueDays,
      // Subscription payment info
      isSubscriptionPayment,
      monthlyAmount,
    })
  } catch (error: any) {
    console.error('Route /api/coaching-checkout/details failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
