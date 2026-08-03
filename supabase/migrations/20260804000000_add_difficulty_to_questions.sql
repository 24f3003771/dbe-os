-- Add difficulty column to questions table
-- This enables per-question difficulty tagging (easy, medium, hard)
-- Used for filtering on the student quiz UI and AI prompt generation

ALTER TABLE questions
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard'));
