import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Browser client (uses anon key - for client-side tracking)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (uses service key - for API routes and migrations)
// Only use this on the server side
export function getSupabaseServerClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_KEY is not set')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
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
