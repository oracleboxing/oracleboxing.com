import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createWorkflowLogger } from '@/lib/workflow-logger'

/**
 * Process second payment for split pay coaching customers
 * This endpoint can be called by:
 * 1. A cron job checking for due payments
 * 2. Make.com after the first payment webhook
 * 3. Manual trigger from admin
 *
 * Expects either:
 * - paymentIntentId: The original first payment's PaymentIntent ID
 * - customerId + amount: Direct charge to customer
 */
export async function POST(req: NextRequest) {
  const logger = createWorkflowLogger({ workflowName: 'coaching-second-payment', workflowType: 'checkout', notifySlack: true });
  try {
    const body = await req.json()
    const { paymentIntentId, customerId, amount, scheduleFor } = body
    try { await logger.started('Second payment processing requested', { paymentIntentId, customerId, amount }); } catch {}

    // Option 1: Create second payment from first payment's metadata
    if (paymentIntentId) {
      // Retrieve the original payment intent
      const originalPI = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (!originalPI) {
        return NextResponse.json(
          { error: 'Original payment intent not found' },
          { status: 404 }
        )
      }

      const metadata = originalPI.metadata || {}

      // Verify this is a split payment
      if (metadata.split_payment !== 'true') {
        return NextResponse.json(
          { error: 'This is not a split payment' },
          { status: 400 }
        )
      }

      // Check if second payment was already processed
      if (metadata.second_payment_processed === 'true') {
        return NextResponse.json(
          { error: 'Second payment already processed' },
          { status: 400 }
        )
      }

      const secondPaymentAmount = parseInt(metadata.second_payment_amount || '0', 10)
      const customerIdFromPI = originalPI.customer as string

      if (!customerIdFromPI || !secondPaymentAmount) {
        return NextResponse.json(
          { error: 'Missing customer or amount information' },
          { status: 400 }
        )
      }

      // Get customer's default payment method
      const customer = await stripe.customers.retrieve(customerIdFromPI, {
        expand: ['invoice_settings.default_payment_method'],
      })

      if (customer.deleted) {
        return NextResponse.json(
          { error: 'Customer has been deleted' },
          { status: 400 }
        )
      }

      // Get payment method - either default or from the original payment
      let paymentMethodId = (customer.invoice_settings?.default_payment_method as any)?.id

      if (!paymentMethodId && originalPI.payment_method) {
        paymentMethodId = originalPI.payment_method as string
      }

      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'No payment method found for customer' },
          { status: 400 }
        )
      }

      // Create and confirm the second payment
      // Copy all metadata from first payment to ensure rich tracking data
      const secondPayment = await stripe.paymentIntents.create({
        amount: secondPaymentAmount,
        currency: 'usd',
        customer: customerIdFromPI,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          ...metadata,
          type: 'coaching', // Ensure type is set for webhook tracking
          payment_number: '2',
          total_payments: '2',
          original_payment_intent: paymentIntentId,
          product_name: metadata.product_name?.replace('Payment 1 of 2', 'Payment 2 of 2') || '1-on-1 Coaching (Payment 2 of 2)',
        },
      })

      // Update original payment intent to mark second payment as processed
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          ...metadata,
          second_payment_processed: 'true',
          second_payment_intent_id: secondPayment.id,
          second_payment_date: new Date().toISOString(),
        },
      })

      try { await logger.completed(`Second payment processed for ${metadata.customer_email || customerIdFromPI}`, { paymentIntentId: secondPayment.id, amount: secondPaymentAmount / 100, email: metadata.customer_email, originalPaymentIntentId: paymentIntentId }); } catch {}


      return NextResponse.json({
        success: true,
        paymentIntentId: secondPayment.id,
        status: secondPayment.status,
        amount: secondPayment.amount,
      })
    }

    // Option 2: Direct charge with customerId and amount
    if (customerId && amount) {
      const customer = await stripe.customers.retrieve(customerId, {
        expand: ['invoice_settings.default_payment_method'],
      })

      if (customer.deleted) {
        return NextResponse.json(
          { error: 'Customer has been deleted' },
          { status: 400 }
        )
      }

      const paymentMethodId = (customer.invoice_settings?.default_payment_method as any)?.id

      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'No default payment method found' },
          { status: 400 }
        )
      }

      const payment = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          type: 'coaching', // Consistent type for all coaching payments
          payment_plan: 'split_2',
          payment_number: '2',
          total_payments: '2',
          product_name: '1-on-1 Coaching (Payment 2 of 2)',
        },
      })

      try { await logger.completed(`Direct second payment processed for ${customerId}`, { paymentIntentId: payment.id, amount, customerId }); } catch {}


      return NextResponse.json({
        success: true,
        paymentIntentId: payment.id,
        status: payment.status,
      })
    }

    return NextResponse.json(
      { error: 'Either paymentIntentId or (customerId + amount) is required' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('❌ Error processing second payment:', error)
    try { await logger.failed(error.message, { stack: error.stack, type: error.type, code: error.code }); } catch {}

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        {
          error: 'Payment failed',
          code: error.code,
        },
        { status: 402 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
