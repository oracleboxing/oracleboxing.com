-- Events Table - Generic event tracking for user interactions
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  session_id TEXT,
  event_id TEXT,
  event_name TEXT NOT NULL,  -- button_click, video_play, scroll_depth, etc.
  page TEXT,                 -- URL path where event occurred
  element_id TEXT,           -- ID of element interacted with
  element_text TEXT,         -- Text content (truncated to 100 chars)
  element_type TEXT,         -- button, link, video, form, etc.
  value DECIMAL(10,2),       -- Numeric value (scroll %, video %, time in seconds, price)
  metadata JSONB,            -- Additional context as JSON
  country TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_page ON events(page);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for anon key (allows inserts from browser)
CREATE POLICY "Allow anon insert to events" ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for anon key (allows reads from browser for analytics dashboard)
CREATE POLICY "Allow anon select from events" ON events
  FOR SELECT
  TO anon
  USING (true);

-- Policy for service role (full access)
CREATE POLICY "Allow service role full access to events" ON events
  FOR ALL
  TO service_role
  USING (true);
