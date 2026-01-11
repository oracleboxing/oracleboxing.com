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
  utm_content: string | null
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
