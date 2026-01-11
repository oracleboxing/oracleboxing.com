-- Waitlist Table
-- Run this SQL in Supabase SQL Editor to create the waitlist table

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  session_id TEXT,
  event_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_date ON waitlist(date);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);

-- If tables already exist, add phone column with:
-- ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS phone TEXT;
-- CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);

-- ALTER TABLE initiate_checkouts ADD COLUMN IF NOT EXISTS phone TEXT;
-- CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_phone ON initiate_checkouts(phone);

-- ALTER TABLE purchases ADD COLUMN IF NOT EXISTS phone TEXT;
-- CREATE INDEX IF NOT EXISTS idx_purchases_phone ON purchases(phone);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (allows server-side inserts)
CREATE POLICY "Allow service role full access to waitlist" ON waitlist FOR ALL USING (true);
