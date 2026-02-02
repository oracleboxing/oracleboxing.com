import { createClient } from '@supabase/supabase-js'

// Browser client (uses anon key - for client-side tracking)
// Uses lazy initialization to avoid build errors when env vars aren't set
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: any = null

export function getSupabase(): any {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    if (!url || !key) throw new Error('Supabase credentials not configured')
    _supabase = createClient(url, key)
  }
  return _supabase
}

// Backwards-compatible export (lazy getter)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = new Proxy({}, {
  get(_target, prop) {
    return getSupabase()[prop]
  },
})

// Server client (uses service key - for API routes and migrations)
// Only use this on the server side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabaseServer: any = null

export function getSupabaseServerClient(): any {
  if (!_supabaseServer) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim()
    if (!url || !serviceKey) throw new Error('SUPABASE_SERVICE_KEY is not set')
    _supabaseServer = createClient(url, serviceKey)
  }
  return _supabaseServer
}

// Database types for tracking events
export interface PageViewRecord {
  date: string
  session_id: string | null
  event_id: string | null
  page: string | null
  referrer: string | null
  country: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
}

export interface InitiateCheckoutRecord {
  date: string
  session_id: string | null
  event_id: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  amount: number | null
  product: string | null
  funnel: string | null
  source: string | null
  country: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  payment_intent_id: string | null
}

export interface PurchaseRecord {
  date: string
  session_id: string | null
  event_id: string | null
  name: string | null
  email: string | null
  phone: string | null
  amount: number | null
  product: string | null
  country: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
}

export interface WaitlistRecord {
  date: string
  session_id: string | null
  event_id: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
}

// Coaching split payment tracking
export interface CoachingSplitPaymentRecord {
  id?: string
  created_at?: string
  // Customer info
  customer_email: string
  customer_name: string
  stripe_customer_id: string
  // First payment info
  first_payment_intent_id: string
  first_payment_date: string
  first_payment_amount: number // in cents
  // Second payment info
  second_payment_amount: number // in cents
  second_payment_due_date: string
  second_payment_status: 'pending' | 'webhook_sent' | 'completed' | 'failed'
  second_payment_intent_id: string | null
  second_payment_date: string | null
  // Coaching details
  tier: string
  coach: string
  six_month_commitment: boolean
  // Webhook tracking
  webhook_sent_at: string | null
  webhook_response: string | null
  // For manual retry
  retry_count: number
  last_error: string | null
}
