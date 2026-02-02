-- Create quiz_results table for the "What's Your Boxing Level?" quiz
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  responses JSONB NOT NULL,
  scores JSONB NOT NULL,
  total INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  level_description TEXT NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(email) WHERE email IS NOT NULL;

-- Index for created_at (analytics)
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at);

-- Enable RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything (API routes use service key)
CREATE POLICY "Service role full access" ON quiz_results
  FOR ALL
  USING (true)
  WITH CHECK (true);
