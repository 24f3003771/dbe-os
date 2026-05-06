-- ─── CGPA Persistence ──────────────────────────────────────────────────
-- Adds a column to user_profiles to store CGPA marks data as JSON.
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS cgpa_data JSONB DEFAULT '{}'::JSONB;

-- Since RLS is already enabled on user_profiles, 
-- existing policies for 'select' and 'update' will cover this new column.
