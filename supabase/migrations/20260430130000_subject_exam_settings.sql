-- ─── Subject Exam Settings ────────────────────────────────────────────────────
-- Adds three new subject-level flags:
--   calculator_enabled  → Show calculator in quiz engine for this subject (all modes)
--   negative_marking    → Apply negative marking in exam mode MCQ only
--   neg_marking_value   → How much to deduct per wrong MCQ: '1/3', '1/2', or '1/4'
--
-- NOTE: strict_time_limit (existing column) is reinterpreted as TOTAL exam duration
-- in MINUTES for the entire exam set (not per-question seconds).
-- e.g. strict_time_limit = 30 → student gets 30 minutes to complete the full exam.

ALTER TABLE subjects
  ADD COLUMN IF NOT EXISTS calculator_enabled  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS negative_marking    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS neg_marking_value   text    NOT NULL DEFAULT '1/3';

-- Constraint: only valid fractions allowed
ALTER TABLE subjects
  DROP CONSTRAINT IF EXISTS subjects_neg_marking_value_check;

ALTER TABLE subjects
  ADD CONSTRAINT subjects_neg_marking_value_check
  CHECK (neg_marking_value IN ('1/3', '1/2', '1/4'));
