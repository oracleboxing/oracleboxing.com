/**
 * Post-payment handler - replaces Make.com Stripe webhook workflow.
 * Processes payment_intent.succeeded events for 21DC and coaching.
 */
import Stripe from 'stripe'
import { notifyOps } from '@/lib/slack-notify'
import { createWorkflowLogger } from '@/lib/workflow-logger'

const sgClient = require('@sendgrid/client')

// SendGrid list IDs
const CHALLENGE_LIST_ID = '0af704af-4d78-4eb5-a780-fe269aaacff9'
const CHECKOUT_LIST_ID = '6a8d2576-c648-4edd-8dbf-f224341a3908'
const WAITLIST_LIST_ID = '3a1ba08c-6247-4684-86a2-7b652bf60e5b'

// Slack channels
const NEW_CLIENTS_CHANNEL = 'C080YRDSCBB' // #new-clients

// Current campaign name
const CURRENT_CAMPAIGN = process.env.CURRENT_CAMPAIGN || 'feb21dc'

// Country code to name mapping
const COUNTRY_MAP: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', AU: 'Australia', CA: 'Canada',
  DE: 'Germany', FR: 'France', NZ: 'New Zealand', IE: 'Ireland',
  AE: 'United Arab Emirates', NL: 'Netherlands', ES: 'Spain', IT: 'Italy',
  SE: 'Sweden', NO: 'Norway', DK: 'Denmark', CH: 'Switzerland',
  AT: 'Austria', BE: 'Belgium', PL: 'Poland', PT: 'Portugal',
  SG: 'Singapore', HK: 'Hong Kong', JP: 'Japan', IN: 'India',
  ZA: 'South Africa', MX: 'Mexico', BR: 'Brazil', GT: 'Guatemala',
}

// Currency conversion rates to USD
const USD_RATES: Record<string, number> = {
  usd: 1, gbp: 1.28, eur: 1.09, cad: 0.74, aed: 0.27, aud: 0.67,
}

// Add-on code to display name
const ADDON_NAMES: Record<string, string> = {
  bffp: 'Boxing from First Principles',
  tracksuit: 'Oracle Boxing Tracksuit',
  vault2025: '2025 Call Recording Vault',
  'vault-2025': '2025 Call Recording Vault',
}

function formatMoney(amountCents: number, currency: string): string {
  const symbols: Record<string, string> = { usd: '$', gbp: '£', eur: '€', cad: 'C$', aud: 'A$', aed: 'AED ' }
  const symbol = symbols[currency.toLowerCase()] || currency.toUpperCase() + ' '
  return `${symbol}${(amountCents / 100).toFixed(2)}`
}

function toUSD(amountCents: number, currency: string): string {
  const rate = USD_RATES[currency.toLowerCase()] || 1
  const usd = (amountCents / 100) * rate
  return `$${usd.toFixed(2)}`
}

function mapReferrer(url: string): string {
  if (!url) return 'Direct'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('facebook.com')) return 'Facebook'
  if (url.includes('google.com')) return 'Google'
  if (url.includes('tiktok.com')) return 'TikTok'
  return url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]
}

function buildAttribution(meta: Record<string, string>): string {
  const firstRef = mapReferrer(meta.first_referrer || '')
  const firstSource = meta.first_utm_source || ''
  const firstMedium = meta.first_utm_medium || ''
  const firstContent = meta.first_utm_content || ''
  const lastSource = meta.last_utm_source || ''
  const lastMedium = meta.last_utm_medium || ''
  const lastContent = meta.last_utm_content || ''

  const firstParts = [firstSource, firstMedium, firstContent].filter(Boolean).join(', ')
  const lastParts = [lastSource, lastMedium, lastContent].filter(Boolean).join(', ')

  const hasFirst = firstRef !== 'Direct' || firstParts
  const hasLast = lastParts
  const isDifferent = hasFirst && hasLast && (firstSource !== lastSource || firstMedium !== lastMedium)

  if (isDifferent) {
    const firstTime = meta.first_referrer_time || ''
    const lastTime = meta.last_referrer_time || ''
    let since = ''
    if (firstTime && lastTime) {
      const diffMs = new Date(lastTime).getTime() - new Date(firstTime).getTime()
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      since = days > 0 ? `${days}d ${hours}h` : `${hours}h`
    }
    const lastRef = mapReferrer(meta.last_referrer || meta.first_referrer || '')
    return `*First:* *${firstRef}* (${firstParts})\n*Last:* *${lastRef}* (${lastParts})${since ? `\n*Since:* ${since}` : ''}`
  }

  if (hasFirst) {
    return `*Attribution:* *${firstRef}*${firstParts ? ` (${firstParts})` : ''}`
  }

  return '*Attribution:* *Direct*'
}

// Zapier Skool webhooks
// Invite + unlock (new members who need Skool invite)
const ZAPIER_INVITE_URL = process.env.ZAPIER_INVITE_WEBHOOK_URL || ''
// Unlock only (existing members who already have Skool access)
const ZAPIER_UNLOCK_URL = process.env.ZAPIER_UNLOCK_WEBHOOK_URL || ''

async function inviteAndUnlockCourses(email: string, courses: { roadmap?: boolean; bffp?: boolean; vault?: boolean; g1?: boolean; g2?: boolean; g3?: boolean }) {
  const res = await fetch(ZAPIER_INVITE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...courses }),
  })
  if (!res.ok) console.error(`Zapier invite failed (${res.status}):`, await res.text().catch(() => ''))
}

async function unlockCourses(email: string, courses: { roadmap?: boolean; bffp?: boolean; vault?: boolean; g1?: boolean; g2?: boolean; g3?: boolean }) {
  const res = await fetch(ZAPIER_UNLOCK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...courses }),
  })
  if (!res.ok) console.error(`Zapier unlock failed (${res.status}):`, await res.text().catch(() => ''))
}

// Google Sheets - Course unlock sheet
const COURSE_SHEET_ID = '1G9BpYHXcBKJpgS5cUI6HyMmk7X_xdfmPQVXyyeRuMm0'
const COURSE_SHEET_NAME = 'main'

async function getGoogleAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  return data.access_token
}

async function addToCourseSheet(email: string, addOns: string[]) {
  const accessToken = await getGoogleAccessToken()
  if (!accessToken) {
    console.error('Failed to get Google access token')
    return
  }

  // Columns: A=Email, B=Roadmap, C=BFFP, D=Vault, E=Grade 1, F=Grade 2, G=Grade 3
  // Roadmap (Boxing Toolkit) = always TRUE for any Oracle Boxing purchase
  // Grade 1 = always TRUE for 21DC
  // BFFP and Vault depend on add-ons
  const hasBFFP = addOns.includes('bffp')
  const hasVault = addOns.includes('vault2025') || addOns.includes('vault-2025')

  const row = [
    email,
    'TRUE',           // Roadmap - always
    hasBFFP ? 'TRUE' : '',  // BFFP
    hasVault ? 'TRUE' : '', // Vault
    'TRUE',           // Grade 1 - always for 21DC
    '',               // Grade 2
    '',               // Grade 3
  ]

  const range = encodeURIComponent(`${COURSE_SHEET_NAME}!A:G`)
  const sheetsRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${COURSE_SHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  )
  if (!sheetsRes.ok) console.error(`Sheets append failed (${sheetsRes.status}):`, await sheetsRes.text().catch(() => ''))
}

function getSendGridClient() {
  sgClient.setApiKey(process.env.SENDGRID_API_KEY!)
  return sgClient
}

async function addToSendGridList(listId: string, email: string, firstName?: string, lastName?: string, phone?: string) {
  const sg = getSendGridClient()
  await sg.request({
    url: '/v3/marketing/contacts',
    method: 'PUT',
    body: {
      list_ids: [listId],
      contacts: [{
        email,
        first_name: firstName || '',
        last_name: lastName || '',
        phone_number: phone || '',
      }],
    },
  })
}

async function removeFromSendGridList(listId: string, email: string) {
  const sg = getSendGridClient()
  // Search for contact by email
  const [searchRes, searchBody] = await sg.request({
    url: '/v3/marketing/contacts/search/emails',
    method: 'POST',
    body: { emails: [email] },
  })
  const contactId = searchBody?.result?.[email]?.contact?.id
  if (contactId) {
    await sg.request({
      url: `/v3/marketing/lists/${listId}/contacts?contact_ids=${contactId}`,
      method: 'DELETE',
    })
  }
}

async function createAttioPerson(email: string, firstName: string, lastName: string, phone: string, campaign: string) {
  const attioApiKey = process.env.ATTIO_API_KEY
  if (!attioApiKey) {
    console.error('ATTIO_API_KEY not set')
    return
  }

  // Assert (upsert) a person record
  const res = await fetch('https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${attioApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        values: {
          email_addresses: [{ email_address: email }],
          name: [{ full_name: `${firstName} ${lastName}`, first_name: firstName, last_name: lastName }],
          ...(phone ? { phone_numbers: [{ original_phone_number: phone }] } : {}),
          campaign: [{ option: campaign }],
        },
      },
    }),
  })
  if (!res.ok) console.error(`Attio upsert failed (${res.status}):`, await res.text().catch(() => ''))
}

async function sendSlackBlock(channel: string, blocks: any[], username: string, iconEmoji: string) {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    console.error('SLACK_BOT_TOKEN not set')
    return
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel,
      blocks,
      username,
      icon_emoji: iconEmoji,
    }),
  })
  if (!res.ok) console.error(`Slack post failed (${res.status}):`, await res.text().catch(() => ''))
}

// ==========================================
// 21-Day Challenge post-payment handler
// ==========================================
export async function handle21DCPayment(pi: Stripe.PaymentIntent) {
  const logger = createWorkflowLogger({ workflowName: '21dc-post-payment', workflowType: 'checkout', notifySlack: false })
  const meta = pi.metadata || {}
  const firstName = meta.customer_first_name || ''
  const lastName = meta.customer_last_name || ''
  const name = `${firstName} ${lastName}`.trim()
  const email = meta.customer_email || ''
  const phone = meta.customer_phone || ''
  const city = meta.billing_city || ''
  const countryCode = meta.billing_country || ''
  const country = COUNTRY_MAP[countryCode] || countryCode
  const currency = pi.currency || 'usd'
  const amount = formatMoney(pi.amount, currency)
  const amountUSD = toUSD(pi.amount, currency)

  // Parse add-ons
  const addOnCodes = (meta.add_ons_included || '').split(',').filter(Boolean)
  const addOnNames = addOnCodes.map(c => ADDON_NAMES[c] || c).filter(Boolean)
  const addonsStr = addOnNames.join(', ') || 'None'

  const attribution = buildAttribution(meta)

  const errors: string[] = []
  try { await logger.started(`21DC post-payment for ${email}`, { email, amount: amountUSD, addOns: addonsStr }) } catch {}

  // 1. Slack notification to New Clients channel
  try {
    await sendSlackBlock(NEW_CLIENTS_CHANNEL, [
      {
        type: 'header',
        text: { type: 'plain_text', text: amountUSD, emoji: false },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Product:* 21-Day Challenge\n*Add-ons:* ${addonsStr}\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Country:* ${country}\n${attribution}`,
        },
      },
    ], 'NEW CLIENT', '💰')
  } catch (e: any) {
    errors.push(`Slack: ${e.message}`)
  }

  // 2. Add to Challenge List (SendGrid)
  try {
    await addToSendGridList(CHALLENGE_LIST_ID, email, firstName, lastName, phone)
  } catch (e: any) {
    errors.push(`SendGrid add challenge: ${e.message}`)
  }

  // 3. Add to course unlock sheet (Google Sheets)
  try {
    await addToCourseSheet(email, addOnCodes)
  } catch (e: any) {
    errors.push(`Google Sheets: ${e.message}`)
  }

  // 4. Zapier Skool course unlock
  try {
    await inviteAndUnlockCourses(email, {
      roadmap: true, // Always for 21DC
      bffp: addOnCodes.includes('bffp'),
      vault: addOnCodes.includes('vault2025') || addOnCodes.includes('vault-2025'),
      g1: true, // Always for 21DC
      g2: false,
      g3: false,
    })
  } catch (e: any) {
    errors.push(`Zapier unlock: ${e.message}`)
  }

  // 5. Create/update Attio person
  try {
    await createAttioPerson(email, firstName, lastName, phone, CURRENT_CAMPAIGN)
  } catch (e: any) {
    errors.push(`Attio: ${e.message}`)
  }

  // 6. Remove from Checkout list
  try {
    await removeFromSendGridList(CHECKOUT_LIST_ID, email)
  } catch (e: any) {
    console.warn('Remove from checkout list failed:', e.message)
  }

  // 7. Remove from Waitlist list
  try {
    await removeFromSendGridList(WAITLIST_LIST_ID, email)
  } catch (e: any) {
    console.warn('Remove from waitlist list failed:', e.message)
  }

  // 8. Summary notification to #ops + workflow log
  const steps = [
    { name: 'Slack New Client', success: !errors.some(e => e.startsWith('Slack:')) },
    { name: 'SendGrid Challenge List', success: !errors.some(e => e.includes('challenge')) },
    { name: 'Google Sheets', success: !errors.some(e => e.includes('Sheets')) },
    { name: 'Zapier Course Unlock', success: !errors.some(e => e.includes('Zapier')) },
    { name: 'Attio CRM', success: !errors.some(e => e.includes('Attio')) },
    { name: 'Remove Checkout List', success: true },
    { name: 'Remove Waitlist List', success: true },
  ]
  const passed = steps.filter(s => s.success).map(s => `✅ ${s.name}`)
  const failed = steps.filter(s => !s.success).map(s => `❌ ${s.name}`)
  const allPassed = errors.length === 0
  const summary = [...passed, ...failed].join('\n')
  notifyOps(`${allPassed ? '🎉' : '⚠️'} 21DC post-payment for ${email} (${amountUSD})\n${summary}${errors.length > 0 ? '\n\nErrors:\n' + errors.join('\n') : ''}`)

  if (allPassed) {
    try { await logger.completed(`21DC post-payment complete for ${email} (${amountUSD})`, { email, amount: amountUSD, addOns: addonsStr, steps: passed.length }) } catch {}
  } else {
    try { await logger.failed(`21DC post-payment had errors for ${email}`, { email, errors }) } catch {}
  }

  return { success: allPassed, errors }
}

// ==========================================
// Membership post-payment handler
// ==========================================
export async function handleMembershipPayment(pi: Stripe.PaymentIntent) {
  const logger = createWorkflowLogger({ workflowName: 'membership-post-payment', workflowType: 'checkout', notifySlack: false })
  const meta = pi.metadata || {}
  const firstName = meta.customer_first_name || ''
  const lastName = meta.customer_last_name || ''
  const name = `${firstName} ${lastName}`.trim()
  const email = meta.customer_email || ''
  const phone = meta.customer_phone || ''
  const city = meta.billing_city || ''
  const countryCode = meta.billing_country || ''
  const country = COUNTRY_MAP[countryCode] || countryCode
  const currency = pi.currency || 'usd'
  const amount = formatMoney(pi.amount, currency)
  const amountUSD = toUSD(pi.amount, currency)
  const plan = (meta.plan === 'annual' || meta.upgraded_to_annual === 'true') ? 'Annual' : 'Monthly'

  const addOnCodes = (meta.add_ons_included || '').split(',').filter(Boolean)
  const addOnNames = addOnCodes.map(c => ADDON_NAMES[c] || c).filter(Boolean)
  const addonsStr = addOnNames.join(', ') || 'None'

  const attribution = buildAttribution(meta)
  const errors: string[] = []
  try { await logger.started(`Membership post-payment for ${email}`, { email, amount: amountUSD, plan }) } catch {}

  // 1. Slack notification
  try {
    await sendSlackBlock(NEW_CLIENTS_CHANNEL, [
      { type: 'header', text: { type: 'plain_text', text: amountUSD, emoji: false } },
      { type: 'section', text: { type: 'mrkdwn', text: `*Product:* Membership (${plan})\n*Add-ons:* ${addonsStr}\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Country:* ${country}\n${attribution}` } },
    ], 'NEW CLIENT', '💰')
  } catch (e: any) { errors.push(`Slack: ${e.message}`) }

  // 2. Google Sheets - course unlock
  try {
    const effectiveAddOns = [...addOnCodes]
    if (plan === 'Annual' && !effectiveAddOns.includes('bffp')) effectiveAddOns.push('bffp')
    await addToCourseSheet(email, effectiveAddOns)
  } catch (e: any) { errors.push(`Google Sheets: ${e.message}`) }

  // 3. Zapier Skool course unlock
  try {
    const hasBFFP = addOnCodes.includes('bffp') || plan === 'Annual'
    const hasVault = addOnCodes.includes('vault2025') || addOnCodes.includes('vault-2025')
    await inviteAndUnlockCourses(email, {
      roadmap: true,
      bffp: hasBFFP,
      vault: hasVault,
      g1: true,
      g2: false,
      g3: false,
    })
  } catch (e: any) { errors.push(`Zapier unlock: ${e.message}`) }

  // 4. Create/update Attio person (no campaign tag)
  try {
    const attioApiKey = process.env.ATTIO_API_KEY
    if (attioApiKey) {
      const attioRes = await fetch('https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${attioApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { values: {
            email_addresses: [{ email_address: email }],
            name: [{ full_name: `${firstName} ${lastName}`, first_name: firstName, last_name: lastName }],
            ...(phone ? { phone_numbers: [{ original_phone_number: phone }] } : {}),
          } },
        }),
      })
      if (!attioRes.ok) console.error(`Attio membership upsert failed (${attioRes.status}):`, await attioRes.text().catch(() => ''))
    }
  } catch (e: any) { errors.push(`Attio: ${e.message}`) }

  // 4. Remove from Checkout list
  try { await removeFromSendGridList(CHECKOUT_LIST_ID, email) } catch (e: any) { console.warn('Remove checkout:', e.message) }

  // 5. Remove from Waitlist list
  try { await removeFromSendGridList(WAITLIST_LIST_ID, email) } catch (e: any) { console.warn('Remove waitlist:', e.message) }

  // Summary
  const allPassed = errors.length === 0
  const steps = [
    { name: 'Slack New Member', success: !errors.some(e => e.startsWith('Slack:')) },
    { name: 'Google Sheets', success: !errors.some(e => e.includes('Sheets')) },
    { name: 'Zapier Course Unlock', success: !errors.some(e => e.includes('Zapier')) },
    { name: 'Attio CRM', success: !errors.some(e => e.includes('Attio')) },
    { name: 'Remove Checkout List', success: true },
    { name: 'Remove Waitlist List', success: true },
  ]
  const passed = steps.filter(s => s.success).map(s => `✅ ${s.name}`)
  const failed = steps.filter(s => !s.success).map(s => `❌ ${s.name}`)
  const summary = [...passed, ...failed].join('\n')
  notifyOps(`${allPassed ? '🎉' : '⚠️'} Membership post-payment for ${email} (${amountUSD}, ${plan})\n${summary}${errors.length > 0 ? '\n\nErrors:\n' + errors.join('\n') : ''}`)

  if (allPassed) {
    try { await logger.completed(`Membership post-payment complete for ${email} (${amountUSD}, ${plan})`, { email, amount: amountUSD, plan, addOns: addonsStr }) } catch {}
  } else {
    try { await logger.failed(`Membership post-payment had errors for ${email}`, { email, errors }) } catch {}
  }

  return { success: allPassed, errors }
}

// ==========================================
// Coaching post-payment handler
// ==========================================
export async function handleCoachingPayment(pi: Stripe.PaymentIntent) {
  const logger = createWorkflowLogger({ workflowName: 'coaching-post-payment', workflowType: 'checkout', notifySlack: false })
  const meta = pi.metadata || {}
  const email = meta.customer_email || ''
  const firstName = meta.customer_first_name || ''
  const lastName = meta.customer_last_name || ''
  const name = `${firstName} ${lastName}`.trim()
  const currency = pi.currency || 'usd'

  // Format amount
  const amountDisplay = formatMoney(pi.amount, currency)

  // Tier formatting
  const tierMap: Record<string, string> = { tier_1: 'Tier 1', tier_2: 'Tier 2' }
  const tier = tierMap[meta.tier || ''] || meta.tier || ''

  // Coach
  const coach = meta.coach || ''

  // Payment plan formatting
  const planMap: Record<string, string> = { full: 'Full Payment', split_2: 'Split Payment', monthly: 'Monthly Subscription' }
  const paymentPlan = planMap[meta.payment_plan || ''] || meta.payment_plan || 'Full Payment'

  // Second payment detection
  const isSecondPayment = meta.payment_number === '2'
  const paymentNumber = isSecondPayment ? 'Payment 2 of 2' : (meta.payment_plan === 'split_2' ? 'Payment 1 of 2' : 'Full Payment')

  // 6-month commitment
  const sixMonth = meta.six_month_commitment === 'true' ? 'Yes' : 'No'

  // Discount
  const discountAmount = parseInt(meta.customer_discount_amount || '0')
  const discount = discountAmount > 0
    ? `${meta.customer_discount_type || 'Discount'} - $${discountAmount}`
    : 'None'

  const errors: string[] = []
  try { await logger.started(`Coaching post-payment for ${email}`, { email, amount: amountDisplay, tier, coach }) } catch {}

  try {
    await sendSlackBlock(NEW_CLIENTS_CHANNEL, [
      {
        type: 'header',
        text: { type: 'plain_text', text: amountDisplay, emoji: true },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Name:* ${name}\n*Email:* ${email}\n*Tier:* ${tier}\n*Coach:* ${coach}\n*Payment Plan:* ${paymentPlan}${isSecondPayment ? ` (${paymentNumber})` : ''}\n*6-Month Commitment:* ${sixMonth}\n*Discount:* ${discount}`,
        },
      },
    ], 'NEW COACHING PAYMENT', '🏦')
  } catch (e: any) {
    errors.push(`Slack: ${e.message}`)
  }

  const allPassed = errors.length === 0
  notifyOps(`${allPassed ? '🎉' : '⚠️'} Coaching post-payment for ${email} (${amountDisplay})\n✅ Slack New Coaching Payment${errors.length > 0 ? '\n\nErrors:\n' + errors.join('\n') : ''}`)

  if (allPassed) {
    try { await logger.completed(`Coaching post-payment complete for ${email} (${amountDisplay})`, { email, amount: amountDisplay, tier, coach }) } catch {}
  } else {
    try { await logger.failed(`Coaching post-payment had errors for ${email}`, { email, errors }) } catch {}
  }

  return { success: allPassed, errors }
}
