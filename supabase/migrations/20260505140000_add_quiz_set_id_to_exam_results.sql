-- Migration to add quiz_set_id tracking to exam_results

-- Add the column as nullable (since older records won't have it, and practice modes might not either)
ALTER TABLE exam_results ADD COLUMN IF NOT EXISTS quiz_set_id uuid REFERENCES quiz_sets(id) ON DELETE SET NULL;

-- Create an index for faster lookups when checking if a user has attempted a specific set
CREATE INDEX IF NOT EXISTS exam_results_quiz_set_id_idx ON exam_results(quiz_set_id);
