import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const supabase = getSupabaseServerClient()
    const errors: { step: string; error: string }[] = []

    // 1. Create ab_tests table
    const { error: abTestsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ab_tests (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          page TEXT NOT NULL,
          element TEXT NOT NULL,
          variants JSONB NOT NULL,
          optimize_for TEXT NOT NULL DEFAULT 'initiate_checkout',
          secondary_metrics TEXT[] DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'draft',
          winner TEXT,
          target_events INT,
          start_date TIMESTAMPTZ,
          end_date TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
      `
    })
    if (abTestsError) errors.push({ step: 'ab_tests', error: abTestsError.message })

    // 2. Add experiments column to existing tables
    const tables = ['events', 'page_views', 'initiate_checkouts', 'purchases']
    for (const table of tables) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS experiments JSONB;`
      })
      if (error) errors.push({ step: `${table}.experiments`, error: error.message })
    }

    // 3. Add RLS policies for ab_tests
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

        DO $$ BEGIN
          CREATE POLICY "Allow anon read ab_tests" ON ab_tests
            FOR SELECT TO anon USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
          CREATE POLICY "Allow service role full access to ab_tests" ON ab_tests
            FOR ALL TO service_role USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `
    })
    if (rlsError) errors.push({ step: 'ab_tests_rls', error: rlsError.message })

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some steps failed. Run the SQL manually in Supabase dashboard.',
        errors,
        sql: getFallbackSQL()
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'A/B testing tables and columns created successfully',
      created: ['ab_tests table', 'experiments column on events/page_views/initiate_checkouts/purchases']
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      sql: getFallbackSQL()
    }, { status: 500 })
  }
}

function getFallbackSQL() {
  return `
-- A/B Tests configuration table
CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  page TEXT NOT NULL,
  element TEXT NOT NULL,
  variants JSONB NOT NULL,
  optimize_for TEXT NOT NULL DEFAULT 'initiate_checkout',
  secondary_metrics TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  winner TEXT,
  target_events INT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read ab_tests" ON ab_tests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow service role full access to ab_tests" ON ab_tests FOR ALL TO service_role USING (true);

-- Add experiments column to tracking tables
ALTER TABLE events ADD COLUMN IF NOT EXISTS experiments JSONB;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS experiments JSONB;
ALTER TABLE initiate_checkouts ADD COLUMN IF NOT EXISTS experiments JSONB;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS experiments JSONB;
  `.trim()
}
