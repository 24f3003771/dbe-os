-- Create tool_waitlist table
-- Tracks which users/visitors have joined the waitlist for each tool

CREATE TABLE IF NOT EXISTS tool_waitlist (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id     text NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  fingerprint text,          -- anonymous browser fingerprint for non-logged-in users
  created_at  timestamptz DEFAULT now() NOT NULL,

  -- Prevent a logged-in user from joining the same tool waitlist twice
  CONSTRAINT uq_user_tool    UNIQUE (user_id, tool_id),
  -- Prevent the same anonymous browser from joining twice
  CONSTRAINT uq_fp_tool      UNIQUE (fingerprint, tool_id)
);

-- Index for fast count queries per tool
CREATE INDEX IF NOT EXISTS idx_waitlist_tool_id ON tool_waitlist(tool_id);

-- RLS: anyone can insert, only admins can select all rows
ALTER TABLE tool_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to insert (join waitlist)
CREATE POLICY "Allow anyone to join waitlist"
  ON tool_waitlist FOR INSERT
  WITH CHECK (true);

-- Allow users to see their own entries
CREATE POLICY "Users see own entries"
  ON tool_waitlist FOR SELECT
  USING (auth.uid() = user_id);

-- Allow count queries for the public API endpoint (aggregates only, no personal data exposed)
-- This is handled server-side via service role in the API route.
