-- ============================================================
-- CONCEPT BUILDER LEVELS SYSTEM
-- Adds difficulty column to questions, progress tracking per user
-- ============================================================

-- 1. Add difficulty level to questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'easy'
CHECK (difficulty IN ('easy', 'medium', 'hard'));

-- 2. Create concept_builder_progress to track user level unlocks
CREATE TABLE IF NOT EXISTS public.concept_builder_progress (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id   UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    difficulty   TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    completed    BOOLEAN NOT NULL DEFAULT FALSE,
    best_score   NUMERIC(5,2) NOT NULL DEFAULT 0, -- percentage 0-100
    attempts     INTEGER NOT NULL DEFAULT 0,
    last_attempt TIMESTAMPTZ DEFAULT NULL,
    unlocked_at  TIMESTAMPTZ DEFAULT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, subject_id, difficulty)
);

-- RLS
ALTER TABLE public.concept_builder_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own concept progress"
    ON public.concept_builder_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own concept progress"
    ON public.concept_builder_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own concept progress"
    ON public.concept_builder_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin can read all progress
CREATE POLICY "Admin can read all concept progress"
    ON public.concept_builder_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'SUPER_ADMIN'
        )
    );

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS cbp_user_subject_idx ON public.concept_builder_progress (user_id, subject_id);

-- 3. Update app_settings to allow per-tool granular control (add if not exists)
ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS concept_builder_enabled BOOLEAN NOT NULL DEFAULT TRUE;
