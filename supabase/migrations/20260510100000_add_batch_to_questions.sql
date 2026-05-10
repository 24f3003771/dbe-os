-- Add batch field to questions table
-- Primarily used for 'cla' and 'midterm' type questions to identify which batch the question belongs to.
-- e.g. 'Batch 1', 'Batch 2', etc.

ALTER TABLE public.questions
    ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT NULL;
