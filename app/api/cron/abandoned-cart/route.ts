import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe/client'

// Test checkout credentials - bypasses abandoned cart automations
const TEST_EMAILS = ['jt@gmail.com']
const TEST_PHONES = ['+12222222222']

function isTestCheckout(email: string | null, phone: string | null): boolean {
  if (email && TEST_EMAILS.includes(email.toLowerCase().trim())) return true
  if (phone && TEST_PHONES.includes(phone.replace(/\s/g, ''))) return true
  return false
}

// Vercel cron job endpoint - runs every hour
// Checks for abandoned carts and sends webhook to Make.com
// Rate limited: max 1 abandon text per phone number per 14 days

const COOLDOWN_DAYS = 14

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

    // Get checkouts from 1-2 hours ago that have a payment_intent_id
    // Also require phone number since we're sending SMS
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()

    const { data: checkouts, error: fetchError } = await supabase
      .from('initiate_checkouts')
      .select('*')
      .not('payment_intent_id', 'is', null)
      .not('phone', 'is', null)
      .gte('date', twoHoursAgo)
      .lte('date', oneHourAgo)

    if (fetchError) {
      console.error('Failed to fetch checkouts from Supabase:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch checkouts' }, { status: 500 })
    }

    if (!checkouts || checkouts.length === 0) {
      console.log('No checkouts to process in the 1-2 hour window')
      return NextResponse.json({ message: 'No checkouts to process', processed: 0 })
    }

    console.log(`Processing ${checkouts.length} checkouts from 1-2 hours ago`)

    let abandonedCount = 0
    let paidCount = 0
    let skippedCooldown = 0

    for (const checkout of checkouts) {
      try {
        // Skip test checkouts
        if (isTestCheckout(checkout.email, checkout.phone)) {
          console.log(`🧪 Skipping test checkout: ${checkout.email}`)
          continue
        }

        // Check PaymentIntent status in Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(checkout.payment_intent_id)

        if (paymentIntent.status === 'succeeded') {
          // Payment completed - no action needed
          paidCount++
          console.log(`✅ Payment completed for ${checkout.email}`)
          continue
        }

        // Check if we've already sent an abandon webhook to this phone in the last 14 days
        if (checkout.phone) {
          const cooldownDate = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()

          const { data: recentWebhooks, error: webhookError } = await supabase
            .from('abandon_webhooks_sent')
            .select('id')
            .eq('phone', checkout.phone)
            .gte('sent_at', cooldownDate)
            .limit(1)

          if (webhookError) {
            console.error('Error checking webhook cooldown:', webhookError)
            // Continue anyway - better to potentially double-send than miss entirely
          } else if (recentWebhooks && recentWebhooks.length > 0) {
            skippedCooldown++
            console.log(`⏸️ Skipping ${checkout.phone} - already sent abandon text in last ${COOLDOWN_DAYS} days`)
            continue
          }
        }

        // Payment not completed - send abandoned cart webhook
        abandonedCount++
        console.log(`🛒 Abandoned cart for ${checkout.email} - sending webhook`)

        // Build recovery URL - short URL with customer params for auto-fill
        const recoveryParams = new URLSearchParams({
          fn: checkout.first_name || '',
          ln: checkout.last_name || '',
          email: checkout.email || '',
          phone: checkout.phone || '',
        })
        const recoveryUrl = `https://oracleboxing.com/sms?${recoveryParams.toString()}`

        // Send to Make.com webhook
        const webhookResponse = await fetch((process.env.MAKE_NOTIFICATION_WEBHOOK_URL || '').replace(/^["'\s]+|["'\s]+$/g, ''), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'abandon',
            first_name: checkout.first_name,
            last_name: checkout.last_name,
            email: checkout.email,
            phone: checkout.phone,
            recovery_url: recoveryUrl,
            payment_intent_id: checkout.payment_intent_id,
            checkout_date: checkout.date,
          }),
        })

        // Record that we sent this webhook (for cooldown tracking)
        if (webhookResponse.ok && checkout.phone) {
          await supabase
            .from('abandon_webhooks_sent')
            .insert({
              phone: checkout.phone,
              email: checkout.email,
              payment_intent_id: checkout.payment_intent_id,
              sent_at: new Date().toISOString(),
            })
        }

        console.log(`📤 Abandoned cart webhook sent for ${checkout.email}`)
      } catch (err: any) {
        console.error(`Error processing checkout ${checkout.email}:`, err.message)
        // Continue processing other checkouts
      }
    }

    return NextResponse.json({
      message: 'Abandoned cart cron completed',
      processed: checkouts.length,
      abandoned: abandonedCount,
      paid: paidCount,
      skipped_cooldown: skippedCooldown,
    })
  } catch (error: any) {
    console.error('Route /api/cron/abandoned-cart failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
