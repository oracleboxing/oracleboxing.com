import { createHook, FatalError, RetryableError } from 'workflow'
import { getSupabaseServerClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe/client'
import { notifyOps } from '@/lib/slack-notify'
import { createWorkflowLogger } from '@/lib/workflow-logger'

export async function processSplitPayment(splitPaymentId: string) {
  'use workflow'

  try { const l = createWorkflowLogger({ workflowName: 'split-payment-processor', workflowType: 'workflow', notifySlack: true }); await l.started('Split payment workflow started', { splitPaymentId }); } catch {}

  const payment = await fetchSplitPayment(splitPaymentId)

  const secondPaymentIntentId = await createSecondPaymentIntent(
    splitPaymentId,
    payment.first_payment_intent_id,
    payment.stripe_customer_id,
    payment.second_payment_amount,
    payment.tier
  )

  const hook = createHook<{ approved: boolean; comment?: string }>({
    token: `split-payment:${splitPaymentId}`,
  })

  await notifyAwaitingApproval(
    splitPaymentId,
    secondPaymentIntentId,
    payment.customer_email,
    payment.second_payment_amount,
    hook.token
  )

  const decision = await hook

  if (decision.approved) {
    await confirmPayment(splitPaymentId, secondPaymentIntentId)
    try { const l = createWorkflowLogger({ workflowName: 'split-payment-processor', workflowType: 'workflow', notifySlack: true }); await l.completed(`Split payment approved and confirmed for ${payment.customer_email}`, { splitPaymentId, email: payment.customer_email, amount: payment.second_payment_amount / 100 }); } catch {}
    await notifyResult(
      splitPaymentId,
      payment.customer_email,
      payment.second_payment_amount,
      'completed',
      decision.comment
    )
  } else {
    await cancelPayment(splitPaymentId, secondPaymentIntentId)
    try { const l = createWorkflowLogger({ workflowName: 'split-payment-processor', workflowType: 'workflow', notifySlack: true }); await l.failed(`Split payment rejected for ${payment.customer_email}`, { splitPaymentId, email: payment.customer_email, comment: decision.comment }); } catch {}
    await notifyResult(
      splitPaymentId,
      payment.customer_email,
      payment.second_payment_amount,
      'failed',
      decision.comment
    )
  }
}

async function fetchSplitPayment(splitPaymentId: string) {
  'use step'

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('coaching_split_payments')
    .select('*')
    .eq('id', splitPaymentId)
    .single()

  if (error || !data) {
    throw new FatalError(`Split payment ${splitPaymentId} not found: ${error?.message}`)
  }

  if (data.second_payment_status !== 'pending') {
    throw new FatalError(
      `Split payment ${splitPaymentId} is not pending (status: ${data.second_payment_status})`
    )
  }

  return data
}

async function createSecondPaymentIntent(
  splitPaymentId: string,
  firstPaymentIntentId: string,
  stripeCustomerId: string,
  amount: number,
  tier: string
) {
  'use step'

  const originalPI = await stripe.paymentIntents.retrieve(firstPaymentIntentId)
  const paymentMethodId = originalPI.payment_method as string

  if (!paymentMethodId) {
    throw new FatalError(
      `No payment method found on first PaymentIntent ${firstPaymentIntentId}`
    )
  }

  const originalMetadata = originalPI.metadata || {}

  try {
    const secondPI = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: false,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        ...originalMetadata,
        type: 'coaching',
        split_payment_id: splitPaymentId,
        original_payment_intent: firstPaymentIntentId,
        payment_number: '2',
        total_payments: '2',
        product_name:
          originalMetadata.product_name?.replace('Payment 1 of 2', 'Payment 2 of 2') ||
          `1-on-1 Coaching - ${tier === 'tier_1' ? 'Tier 1' : 'Tier 2'} (Payment 2 of 2)`,
      },
    })

    const supabase = getSupabaseServerClient()
    await supabase
      .from('coaching_split_payments')
      .update({
        second_payment_intent_id: secondPI.id,
        second_payment_status: 'awaiting_approval',
      })
      .eq('id', splitPaymentId)

    return secondPI.id
  } catch (err: any) {
    const isCardError =
      err.type === 'StripeCardError' ||
      err.code === 'card_declined' ||
      err.code === 'expired_card' ||
      err.code === 'insufficient_funds' ||
      err.decline_code

    if (isCardError) {
      const supabase = getSupabaseServerClient()
      await supabase
        .from('coaching_split_payments')
        .update({ last_error: `CARD ERROR: ${err.message}` })
        .eq('id', splitPaymentId)

      throw new FatalError(`Card error for split payment ${splitPaymentId}: ${err.message}`)
    }

    throw new RetryableError(
      `Transient error creating PaymentIntent for ${splitPaymentId}: ${err.message}`,
      { retryAfter: '5m' }
    )
  }
}

createSecondPaymentIntent.maxRetries = 5

async function notifyAwaitingApproval(
  splitPaymentId: string,
  paymentIntentId: string,
  customerEmail: string,
  amount: number,
  hookToken: string
) {
  'use step'

  await notifyOps(
    `💰 Split payment awaiting approval:\n` +
      `- Customer: ${customerEmail}\n` +
      `- Amount: $${(amount / 100).toFixed(2)}\n` +
      `- PaymentIntent: ${paymentIntentId}\n` +
      `- Approve: POST /api/workflows/split-payment/approve (Authorization: Bearer $CRON_SECRET)\n` +
      `  Body: { "splitPaymentId": "${splitPaymentId}", "approved": true }\n` +
      `- Reject: Same URL with "approved": false`
  )
}

async function confirmPayment(splitPaymentId: string, paymentIntentId: string) {
  'use step'

  try {
    await stripe.paymentIntents.confirm(paymentIntentId)

    const supabase = getSupabaseServerClient()
    await supabase
      .from('coaching_split_payments')
      .update({
        second_payment_status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', splitPaymentId)
  } catch (err: any) {
    const isCardError =
      err.type === 'StripeCardError' ||
      err.code === 'card_declined' ||
      err.code === 'expired_card' ||
      err.code === 'insufficient_funds' ||
      err.decline_code

    if (isCardError) {
      const supabase = getSupabaseServerClient()
      await supabase
        .from('coaching_split_payments')
        .update({
          second_payment_status: 'failed',
          last_error: `CARD ERROR on confirm: ${err.message}`,
        })
        .eq('id', splitPaymentId)

      throw new FatalError(`Card error confirming ${paymentIntentId}: ${err.message}`)
    }

    throw new RetryableError(
      `Transient error confirming ${paymentIntentId}: ${err.message}`,
      { retryAfter: '5m' }
    )
  }
}

confirmPayment.maxRetries = 5

async function cancelPayment(splitPaymentId: string, paymentIntentId: string) {
  'use step'

  try {
    await stripe.paymentIntents.cancel(paymentIntentId)
  } catch (err: any) {
    // If already canceled, that's fine
    if (err.code !== 'payment_intent_unexpected_state') {
      throw new RetryableError(
        `Error canceling ${paymentIntentId}: ${err.message}`,
        { retryAfter: '1m' }
      )
    }
  }

  const supabase = getSupabaseServerClient()
  await supabase
    .from('coaching_split_payments')
    .update({
      second_payment_status: 'failed',
      last_error: 'Rejected during human review',
    })
    .eq('id', splitPaymentId)
}

async function notifyResult(
  splitPaymentId: string,
  customerEmail: string,
  amount: number,
  status: 'completed' | 'failed',
  comment?: string
) {
  'use step'

  const emoji = status === 'completed' ? 'approved' : 'rejected'
  const commentLine = comment ? `\n- Comment: ${comment}` : ''

  await notifyOps(
    `Split payment ${emoji}:\n` +
      `- ID: ${splitPaymentId}\n` +
      `- Customer: ${customerEmail}\n` +
      `- Amount: $${(amount / 100).toFixed(2)}\n` +
      `- Status: ${status}${commentLine}`
  )
}
