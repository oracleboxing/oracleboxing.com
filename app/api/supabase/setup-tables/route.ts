import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  // Require admin authentication
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const supabase = getSupabaseServerClient()

    // Create page_views table
    const { error: pageViewsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS page_views (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date TIMESTAMPTZ NOT NULL,
          session_id TEXT,
          event_id TEXT,
          page TEXT,
          referrer TEXT,
          country TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          utm_content TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date);
        CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
      `
    })

    if (pageViewsError) {
      // Try direct SQL if rpc doesn't work (fall through to direct creation)
    }

    // Create initiate_checkouts table
    const { error: checkoutsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS initiate_checkouts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date TIMESTAMPTZ NOT NULL,
          session_id TEXT,
          event_id TEXT,
          first_name TEXT,
          last_name TEXT,
          email TEXT,
          phone TEXT,
          amount DECIMAL(10,2),
          product TEXT,
          funnel TEXT,
          source TEXT,
          country TEXT,
          referrer TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          utm_content TEXT,
          payment_intent_id TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_date ON initiate_checkouts(date);
        CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_email ON initiate_checkouts(email);
        CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_phone ON initiate_checkouts(phone);
      `
    })

    // Create purchases table
    const { error: purchasesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS purchases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date TIMESTAMPTZ NOT NULL,
          session_id TEXT,
          event_id TEXT,
          name TEXT,
          email TEXT,
          phone TEXT,
          amount DECIMAL(10,2),
          product TEXT,
          country TEXT,
          referrer TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          utm_content TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
        CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
        CREATE INDEX IF NOT EXISTS idx_purchases_phone ON purchases(phone);
      `
    })

    // Create waitlist table
    const { error: waitlistError } = await supabase.rpc('exec_sql', {
      sql: `
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

        CREATE INDEX IF NOT EXISTS idx_waitlist_date ON waitlist(date);
        CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
        CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);
      `
    })

    // Check for errors
    const errors = []
    if (pageViewsError) errors.push({ table: 'page_views', error: pageViewsError.message })
    if (checkoutsError) errors.push({ table: 'initiate_checkouts', error: checkoutsError.message })
    if (purchasesError) errors.push({ table: 'purchases', error: purchasesError.message })
    if (waitlistError) errors.push({ table: 'waitlist', error: waitlistError.message })

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some tables may need manual creation. Please run the SQL in Supabase dashboard.',
        errors,
        sql: getCreateTableSQL()
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'All tables created successfully',
      tables: ['page_views', 'initiate_checkouts', 'purchases', 'waitlist']
    })

  } catch (error: any) {
    console.error('Error setting up tables:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create tables. Please create them manually in Supabase dashboard.',
      sql: getCreateTableSQL()
    }, { status: 500 })
  }
}

function getCreateTableSQL() {
  return `
-- Run this SQL in Supabase SQL Editor if automatic creation fails

-- Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  session_id TEXT,
  event_id TEXT,
  page TEXT,
  referrer TEXT,
  country TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);

-- Initiate Checkouts Table
CREATE TABLE IF NOT EXISTS initiate_checkouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  session_id TEXT,
  event_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  amount DECIMAL(10,2),
  product TEXT,
  funnel TEXT,
  source TEXT,
  country TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_date ON initiate_checkouts(date);
CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_email ON initiate_checkouts(email);
CREATE INDEX IF NOT EXISTS idx_initiate_checkouts_phone ON initiate_checkouts(phone);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  session_id TEXT,
  event_id TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  amount DECIMAL(10,2),
  product TEXT,
  country TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_phone ON purchases(phone);

-- Waitlist Table
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

CREATE INDEX IF NOT EXISTS idx_waitlist_date ON waitlist(date);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiate_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (allows server-side inserts)
CREATE POLICY "Allow service role full access to page_views" ON page_views FOR ALL USING (true);
CREATE POLICY "Allow service role full access to initiate_checkouts" ON initiate_checkouts FOR ALL USING (true);
CREATE POLICY "Allow service role full access to purchases" ON purchases FOR ALL USING (true);
CREATE POLICY "Allow service role full access to waitlist" ON waitlist FOR ALL USING (true);
  `.trim()
}
