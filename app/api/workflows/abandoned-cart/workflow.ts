import { sleep } from 'workflow'
import { getSupabaseServerClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe/client'
import { notifyOps } from '@/lib/slack-notify'
import { createWorkflowLogger } from '@/lib/workflow-logger'

const TEST_EMAILS = ['jt@gmail.com']
const TEST_PHONES = ['+12222222222']

const COOLDOWN_DAYS = 14

interface CheckoutData {
  paymentIntentId: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
}

function isTestCheckout(email: string | null, phone: string | null): boolean {
  if (email && TEST_EMAILS.includes(email.toLowerCase().trim())) return true
  if (phone && TEST_PHONES.includes(phone.replace(/\s/g, ''))) return true
  return false
}

export async function abandonedCartRecovery(input: string) {
  'use workflow'

  const data: CheckoutData = JSON.parse(input)

  // Skip test checkouts immediately
  if (isTestCheckout(data.email, data.phone)) {
    try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: false }); await l.skipped('Test checkout skipped', { email: data.email }); } catch {}
    return { status: 'skipped', reason: 'test_checkout' }
  }

  try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: true }); await l.started('Abandoned cart recovery started', { email: data.email, phone: data.phone, paymentIntentId: data.paymentIntentId }); } catch {}

  // Durable sleep for 90 minutes — no compute consumed
  await sleep('90m')

  // Check if payment was completed during the wait
  const paymentStatus = await checkPaymentStatus(data.paymentIntentId)
  if (paymentStatus === 'succeeded') {
    try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: false }); await l.completed('Payment completed during wait period', { email: data.email, paymentIntentId: data.paymentIntentId }); } catch {}
    return { status: 'paid' }
  }

  // Check 14-day cooldown for this phone number
  if (data.phone) {
    const onCooldown = await checkCooldown(data.phone)
    if (onCooldown) {
      try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: false }); await l.skipped('Phone on cooldown', { email: data.email, phone: data.phone }); } catch {}
      return { status: 'skipped', reason: 'cooldown' }
    }
  }

  // Send recovery webhook to Make.com
  const webhookSent = await sendRecoveryWebhook(data)
  if (!webhookSent) {
    try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: true }); await l.failed('Recovery webhook failed', { email: data.email, phone: data.phone }); } catch {}
    return { status: 'error', reason: 'webhook_failed' }
  }

  // Record webhook sent for cooldown tracking
  if (data.phone) {
    await recordWebhookSent(data)
  }

  // Notify ops
  await notifyOpsStep(data)

  try { const l = createWorkflowLogger({ workflowName: 'abandoned-cart-recovery', workflowType: 'workflow', notifySlack: true }); await l.completed(`Abandoned cart recovery sent for ${data.email || data.phone}`, { email: data.email, phone: data.phone, paymentIntentId: data.paymentIntentId }); } catch {}

  return { status: 'abandoned', webhookSent: true }
}

async function checkPaymentStatus(paymentIntentId: string): Promise<string> {
  'use step'
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent.status
}

async function checkCooldown(phone: string): Promise<boolean> {
  'use step'
  const supabase = getSupabaseServerClient()
  const cooldownDate = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: recentWebhooks, error } = await supabase
    .from('abandon_webhooks_sent')
    .select('id')
    .eq('phone', phone)
    .gte('sent_at', cooldownDate)
    .limit(1)

  if (error) {
    console.error('Error checking webhook cooldown:', error)
    return false
  }

  return recentWebhooks !== null && recentWebhooks.length > 0
}

async function sendRecoveryWebhook(data: CheckoutData): Promise<boolean> {
  'use step'
  const recoveryParams = new URLSearchParams({
    fn: data.firstName || '',
    ln: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
  })
  const recoveryUrl = `https://oracleboxing.com/sms?${recoveryParams.toString()}`

  const webhookUrl = (process.env.MAKE_NOTIFICATION_WEBHOOK_URL || '').replace(/^["'\s]+|["'\s]+$/g, '')

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'abandon',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      recovery_url: recoveryUrl,
      payment_intent_id: data.paymentIntentId,
    }),
  })

  if (!response.ok) {
    console.error(`Make.com webhook failed: ${response.status} ${response.statusText}`)
    return false
  }

  return true
}

async function recordWebhookSent(data: CheckoutData): Promise<void> {
  'use step'
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('abandon_webhooks_sent')
    .insert({
      phone: data.phone,
      email: data.email,
      payment_intent_id: data.paymentIntentId,
      sent_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error recording webhook sent:', error)
  }
}

async function notifyOpsStep(data: CheckoutData): Promise<void> {
  'use step'
  await notifyOps(`Abandoned cart recovery sent for ${data.email || data.phone}`)
}
