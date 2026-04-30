-- ─── Exam Results ─────────────────────────────────────────────────────────────
--
-- `responses` is a JSONB array. Each element is one of two shapes:
--
-- MCQ Question:
-- {
--   "questionId":     "uuid or index",
--   "inputType":      "mcq",
--   "questionText":   "The question asked",
--   "options":        ["A", "B", "C", "D"],
--   "selectedIndex":  2,              -- null if unanswered
--   "selectedAnswer": "Option C text",-- null if unanswered
--   "correctIndex":   0,
--   "correctAnswer":  "Option A text",
--   "isCorrect":      false,
--   "timeTaken":      34,             -- seconds spent on this question
--   "explanation":    "Because..."
-- }
--
-- Text (Subjective) Question:
-- {
--   "questionId":     "uuid or index",
--   "inputType":      "text",
--   "questionText":   "Discuss the impact of...",
--   "writtenAnswer":  "User typed this...",  -- null if unanswered
--   "wordLimit":      250,
--   "explanation":    "Model answer...",
--   "timeTaken":      90,
--   "isCorrect":      null            -- self-graded, no auto-evaluation
-- }
--
create table if not exists exam_results (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  subject             text not null,
  score               numeric(6,2) not null,  -- float: MCQ correct + text AI scores (e.g. 3.82)
  total_questions     int not null,
  timer_per_question  int not null default 0,
  total_time_taken    int not null default 0,
  responses           jsonb not null default '[]'::jsonb,
  tomatoes_earned     int not null default 0,
  created_at          timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists exam_results_user_id_idx on exam_results(user_id);
create index if not exists exam_results_subject_idx  on exam_results(subject);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table exam_results enable row level security;

create policy "Users can read own exam results"
  on exam_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own exam results"
  on exam_results for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own exam results"
  on exam_results for delete
  using (auth.uid() = user_id);

