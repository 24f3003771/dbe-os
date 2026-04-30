-- Create dynamic quiz sets table
CREATE TABLE IF NOT EXISTS public.quiz_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS to quiz_sets
ALTER TABLE public.quiz_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on quiz_sets"
    ON public.quiz_sets FOR SELECT
    USING (true);

CREATE POLICY "Allow SUPER_ADMIN to manage quiz_sets"
    ON public.quiz_sets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'SUPER_ADMIN'
        )
    );

-- Modify questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS quiz_set_id UUID REFERENCES public.quiz_sets(id) ON DELETE SET NULL;

-- Update the type CHECK constraint to allow 'exam' and remove 'pyq'
DO $$
BEGIN
    -- Drop old check constraint if it exists (name may vary)
    ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_type_check;
END $$;

-- Add the new constraint that includes 'exam'
ALTER TABLE public.questions
    ADD CONSTRAINT questions_type_check
    CHECK (type IN ('cla', 'midterm', 'practice', 'exam'));

-- Safely drop old pyq columns if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'pyq_year') THEN
        ALTER TABLE public.questions DROP COLUMN pyq_year;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'pyq_month') THEN
        ALTER TABLE public.questions DROP COLUMN pyq_month;
    END IF;
END $$;
