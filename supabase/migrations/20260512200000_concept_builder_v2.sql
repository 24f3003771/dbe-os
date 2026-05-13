-- Add is_concept_builder flag to questions
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS is_concept_builder BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for fast filtering
CREATE INDEX IF NOT EXISTS questions_concept_builder_idx
    ON public.questions (subject_id, is_concept_builder, difficulty)
    WHERE is_concept_builder = TRUE;

-- Update concept_builder_progress to track progress per module
-- First, drop the old unique constraint
ALTER TABLE public.concept_builder_progress
DROP CONSTRAINT IF EXISTS concept_builder_progress_user_id_subject_id_difficulty_key;

-- Add module_number column (0 = subject-level, 1+ = specific module)
ALTER TABLE public.concept_builder_progress
ADD COLUMN IF NOT EXISTS module_number INTEGER NOT NULL DEFAULT 0;

-- Re-add the unique constraint with module_number
ALTER TABLE public.concept_builder_progress
ADD CONSTRAINT concept_builder_progress_unique
    UNIQUE (user_id, subject_id, module_number, difficulty);

-- Update index
DROP INDEX IF EXISTS cbp_user_subject_idx;
CREATE INDEX IF NOT EXISTS cbp_user_subject_idx
    ON public.concept_builder_progress (user_id, subject_id, module_number);
