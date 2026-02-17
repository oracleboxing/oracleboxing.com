import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { notifyOps } from '@/lib/slack-notify'
import { createWorkflowLogger } from '@/lib/workflow-logger'
import { verifyIntentToken } from '@/lib/security/intent-token'
import { z } from 'zod'

const querySchema = z.object({
  pi: z.string().trim().optional(),
  setup: z.string().trim().optional(),
  pit: z.string().trim().optional(),
})

type StripeLikeError = Error & {
  type?: string
}

/**
 * GET /api/payment-intent?pi=pi_xxx
 * GET /api/payment-intent?setup=seti_xxx
 *
 * Returns the client_secret for a given PaymentIntent or SetupIntent ID.
 *
 * This is safe because:
 * - The client_secret is only useful with the publishable key (already public)
 * - It can only confirm the specific payment, not access account data
 * - But keeping it out of URLs prevents logging/history/referrer leaks
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsedQuery = querySchema.safeParse({
    pi: searchParams.get('pi') ?? undefined,
    setup: searchParams.get('setup') ?? undefined,
    pit: searchParams.get('pit') ?? undefined,
  })
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    )
  }

  const paymentIntentId = parsedQuery.data.pi || null
  const setupIntentId = parsedQuery.data.setup || null
  const proofToken = parsedQuery.data.pit || req.headers.get('x-payment-intent-proof')
  const tokenRequired = process.env.PAYMENT_INTENT_TOKEN_REQUIRED !== 'false'
  const logger = createWorkflowLogger({ workflowName: 'payment-intent-create', workflowType: 'checkout', notifySlack: true });

  try {
    if (!proofToken && tokenRequired) {
      return NextResponse.json(
        { error: 'Unauthorized payment intent access' },
        { status: 401 }
      )
    }

    if (paymentIntentId) {
      // Validate PaymentIntent ID format
      if (!paymentIntentId.startsWith('pi_')) {
        return NextResponse.json(
          { error: 'Invalid PaymentIntent ID' },
          { status: 400 }
        )
      }

      if (proofToken) {
        const verified = verifyIntentToken({
          token: proofToken,
          intentId: paymentIntentId,
          purpose: 'payment_intent_client_secret_fetch',
        })
        if (!verified.ok) {
          return NextResponse.json(
            { error: 'Unauthorized payment intent access' },
            { status: 401 }
          )
        }
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      const clientName = paymentIntent.metadata?.customer_first_name
        ? `${paymentIntent.metadata.customer_first_name} ${paymentIntent.metadata.customer_last_name || ''}`.trim()
        : paymentIntent.metadata?.customer_email || paymentIntentId;
      const amount = (paymentIntent.amount / 100).toFixed(0);
      const product = paymentIntent.metadata?.product_name || paymentIntent.metadata?.type || 'checkout';

      try { await logger.completed(`Payment intent retrieved: ${paymentIntentId}`, { paymentIntentId, amount: paymentIntent.amount, currency: paymentIntent.currency }); } catch {}

      notifyOps(`Checkout opened by ${clientName}`, { blocks: [
        { type: 'context', elements: [{ type: 'mrkdwn', text: `👀 *Checkout opened* - *${clientName}* | ${product} | $${amount} ${paymentIntent.currency?.toUpperCase()}` }] }
      ]})

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      })
    }

    if (setupIntentId) {
      // Validate SetupIntent ID format
      if (!setupIntentId.startsWith('seti_')) {
        return NextResponse.json(
          { error: 'Invalid SetupIntent ID' },
          { status: 400 }
        )
      }

      if (proofToken) {
        const verified = verifyIntentToken({
          token: proofToken,
          intentId: setupIntentId,
          purpose: 'payment_intent_client_secret_fetch',
        })
        if (!verified.ok) {
          return NextResponse.json(
            { error: 'Unauthorized payment intent access' },
            { status: 401 }
          )
        }
      }

      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

      return NextResponse.json({
        clientSecret: setupIntent.client_secret,
      })
    }

    return NextResponse.json(
      { error: 'Missing pi or setup parameter' },
      { status: 400 }
    )
  } catch (error: unknown) {
    console.error('Error retrieving intent:', error)
    const stripeError = error as StripeLikeError

    if (stripeError.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 404 }
      )
    }

    try { await logger.failed(stripeError.message, { paymentIntentId, setupIntentId, type: stripeError.type }); } catch {}

    return NextResponse.json(
      { error: 'Failed to retrieve payment details' },
      { status: 500 }
    )
  }
}
