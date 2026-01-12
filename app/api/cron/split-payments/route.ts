import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe/client'

// Vercel cron job endpoint - runs daily at 9am
// Checks for split payments due today, creates PaymentIntent, and sends to Make.com for human confirmation

// Make.com webhook URL for split payment processing
const MAKE_WEBHOOK_URL = process.env.MAKE_SPLIT_PAYMENT_WEBHOOK_URL || 'https://hook.eu2.make.com/k9j5170tks2qesi73e13njkmg5r04bt6'

// Max retries before marking as permanently failed
const MAX_RETRY_COUNT = 5

// Vercel cron jobs need longer timeout
export const maxDuration = 60 // 60 seconds

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (in production)
    const authHeader = req.headers.get('authorization')
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseServerClient()

    // Get all pending split payments where due date is today or earlier
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today

    const { data: duePayments, error: fetchError } = await supabase
      .from('coaching_split_payments')
      .select('*')
      .eq('second_payment_status', 'pending')
      .lte('second_payment_due_date', today.toISOString())

    if (fetchError) {
      console.error('Failed to fetch due payments from Supabase:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch due payments' }, { status: 500 })
    }

    if (!duePayments || duePayments.length === 0) {
      console.log('No split payments due today')
      return NextResponse.json({ message: 'No payments due', processed: 0 })
    }

    console.log(`Processing ${duePayments.length} split payments due today`)

    let successCount = 0
    let failCount = 0

    for (const payment of duePayments) {
      try {
        // Skip if max retries exceeded
        if (payment.retry_count >= MAX_RETRY_COUNT) {
          console.log(`⏭️ Skipping ${payment.customer_email} - max retries (${MAX_RETRY_COUNT}) exceeded`)

          // Mark as permanently failed
          await supabase
            .from('coaching_split_payments')
            .update({
              second_payment_status: 'failed',
              last_error: `Max retries (${MAX_RETRY_COUNT}) exceeded - manual intervention required`,
            })
            .eq('id', payment.id)

          failCount++
          continue
        }

        console.log(`💳 Creating PaymentIntent for: ${payment.customer_email}`)

        // Get customer's default payment method from the first payment
        const originalPI = await stripe.paymentIntents.retrieve(payment.first_payment_intent_id)
        const paymentMethodId = originalPI.payment_method as string

        if (!paymentMethodId) {
          throw new Error('No payment method found from first payment')
        }

        // Create PaymentIntent (but don't confirm yet - human will confirm via Make.com)
        // Note: off_session is set when confirming, not when creating
        const secondPaymentIntent = await stripe.paymentIntents.create({
          amount: payment.second_payment_amount,
          currency: 'usd',
          customer: payment.stripe_customer_id,
          payment_method: paymentMethodId,
          confirm: false, // Don't confirm - let human review first
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never', // Don't allow redirect-based payment methods
          },
          metadata: {
            type: 'coaching_second_payment',
            split_payment_id: payment.id,
            original_payment_intent: payment.first_payment_intent_id,
            customer_email: payment.customer_email,
            customer_name: payment.customer_name,
            tier: payment.tier,
            coach: payment.coach,
            payment_number: '2',
            total_payments: '2',
          },
        })

        console.log(`✅ PaymentIntent created: ${secondPaymentIntent.id}`)

        // Send to Make.com webhook with PaymentIntent ID for human confirmation
        const webhookPayload = {
          type: 'split_payment_ready_to_confirm',
          // The PaymentIntent to confirm
          payment_intent_id: secondPaymentIntent.id,
          // IDs for tracking
          split_payment_id: payment.id,
          first_payment_intent_id: payment.first_payment_intent_id,
          stripe_customer_id: payment.stripe_customer_id,
          // Customer info
          customer_email: payment.customer_email,
          customer_name: payment.customer_name,
          // Payment details
          amount_cents: payment.second_payment_amount,
          amount_dollars: (payment.second_payment_amount / 100).toFixed(2),
          // Coaching details
          tier: payment.tier,
          coach: payment.coach,
          six_month_commitment: payment.six_month_commitment,
          // Dates
          first_payment_date: payment.first_payment_date,
          due_date: payment.second_payment_due_date,
          // For tracking
          retry_count: payment.retry_count,
        }

        const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })

        const webhookResponseText = await webhookResponse.text()

        if (webhookResponse.ok) {
          // Update record with the new PaymentIntent ID
          await supabase
            .from('coaching_split_payments')
            .update({
              second_payment_status: 'webhook_sent',
              second_payment_intent_id: secondPaymentIntent.id,
              webhook_sent_at: new Date().toISOString(),
              webhook_response: webhookResponseText.substring(0, 500),
            })
            .eq('id', payment.id)

          successCount++
          console.log(`📤 Webhook sent for ${payment.customer_email} - PI: ${secondPaymentIntent.id}`)
        } else {
          // Cancel the PaymentIntent since webhook failed
          await stripe.paymentIntents.cancel(secondPaymentIntent.id)

          await supabase
            .from('coaching_split_payments')
            .update({
              retry_count: payment.retry_count + 1,
              last_error: `Webhook failed: ${webhookResponse.status} - ${webhookResponseText.substring(0, 200)}`,
            })
            .eq('id', payment.id)

          failCount++
          console.error(`❌ Webhook failed for ${payment.customer_email}: ${webhookResponse.status}`)
        }
      } catch (err: any) {
        // Check if this is a card/payment method error that won't resolve with retries
        const isCardError = err.type === 'StripeCardError' ||
          err.code === 'card_declined' ||
          err.code === 'expired_card' ||
          err.code === 'insufficient_funds' ||
          err.decline_code

        const errorMessage = err.message?.substring(0, 500) || 'Unknown error'

        if (isCardError) {
          // Card errors should be flagged for immediate attention, not just retried
          await supabase
            .from('coaching_split_payments')
            .update({
              retry_count: payment.retry_count + 1,
              last_error: `CARD ERROR: ${errorMessage}`,
            })
            .eq('id', payment.id)
          console.error(`💳❌ Card error for ${payment.customer_email}: ${err.code || err.decline_code}`)
        } else {
          await supabase
            .from('coaching_split_payments')
            .update({
              retry_count: payment.retry_count + 1,
              last_error: errorMessage,
            })
            .eq('id', payment.id)
          console.error(`❌ Error processing payment for ${payment.customer_email}:`, err.message)
        }

        failCount++
      }
    }

    return NextResponse.json({
      message: 'Split payments cron completed',
      total: duePayments.length,
      success: successCount,
      failed: failCount,
    })
  } catch (error: any) {
    console.error('Split payments cron error:', error)
    return NextResponse.json(
      { error: error.message || 'Cron job failed' },
      { status: 500 }
    )
  }
}
