-- ─── Todo List Persistence ──────────────────────────────────────────────────
-- Stores daily tasks for users.
create table if not exists todos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  subject       text not null default 'general',
  time          text not null default '09:00',
  completed     boolean not null default false,
  date          text not null,   -- ISO date string "2026-05-01"
  created_at    timestamptz not null default now()
);

alter table todos enable row level security;

create policy "Users can manage own todos"
  on todos for all
  using (auth.uid() = user_id);

-- ─── Task Completion Snooze ────────────────────────────────────────────────
-- Track the last time a user completed a task for rate limiting points.
alter table user_profiles
  add column if not exists last_task_completed_at timestamptz;
