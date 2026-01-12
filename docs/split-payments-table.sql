-- Supabase table for tracking coaching split payments
-- Run this SQL in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS coaching_split_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  stripe_customer_id TEXT NOT NULL,

  -- First payment info
  first_payment_intent_id TEXT NOT NULL UNIQUE,
  first_payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  first_payment_amount INTEGER NOT NULL, -- in cents

  -- Second payment info
  second_payment_amount INTEGER NOT NULL, -- in cents
  second_payment_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  second_payment_status TEXT DEFAULT 'pending' CHECK (second_payment_status IN ('pending', 'webhook_sent', 'completed', 'failed')),
  second_payment_intent_id TEXT,
  second_payment_date TIMESTAMP WITH TIME ZONE,

  -- Coaching details
  tier TEXT,
  coach TEXT,
  six_month_commitment BOOLEAN DEFAULT FALSE,

  -- Webhook tracking
  webhook_sent_at TIMESTAMP WITH TIME ZONE,
  webhook_response TEXT,

  -- For manual retry
  retry_count INTEGER DEFAULT 0,
  last_error TEXT
);

-- Create index for querying pending payments by due date
CREATE INDEX IF NOT EXISTS idx_split_payments_pending_due ON coaching_split_payments (second_payment_status, second_payment_due_date)
  WHERE second_payment_status = 'pending';

-- Create index for looking up by payment intent
CREATE INDEX IF NOT EXISTS idx_split_payments_first_pi ON coaching_split_payments (first_payment_intent_id);

-- Create index for customer email lookups
CREATE INDEX IF NOT EXISTS idx_split_payments_email ON coaching_split_payments (customer_email);

-- Enable Row Level Security (RLS) - only server can access
ALTER TABLE coaching_split_payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to coaching_split_payments"
  ON coaching_split_payments
  FOR ALL
  USING (true)
  WITH CHECK (true);
