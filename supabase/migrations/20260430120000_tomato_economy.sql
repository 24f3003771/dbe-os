-- ─── User Profiles ────────────────────────────────────────────────────────────
-- Stores display info + running tomato totals for each user.
-- Synced whenever a tomato event is recorded.
-- display_name pulled from auth.users metadata on first event.
--
create table if not exists user_profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  display_name          text not null default 'Scholar',
  avatar_url            text,
  total_tomatoes_earned bigint not null default 0,  -- lifetime total (never decreases)
  tomatoes_balance      bigint not null default 0,  -- spendable balance
  updated_at            timestamptz not null default now()
);

alter table user_profiles enable row level security;

-- Users can read all profiles (needed for leaderboard)
create policy "Profiles are publicly readable"
  on user_profiles for select
  using (true);

-- Users can only update their own profile
create policy "Users can upsert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- ─── Tomato Events ─────────────────────────────────────────────────────────────
-- Full audit log of every tomato-earning action.
--
-- action_type values:
--   'exam'            → Completed an exam set
--   'practice'        → Completed practice mode
--   'ai_builder'      → Completed AI concept builder
--   'streak_bonus'    → Daily streak bonus
--   'admin_grant'     → Manual admin grant
--
create table if not exists tomato_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  action_type   text not null,   -- e.g. 'exam', 'practice', 'casecomp', etc.
  description   text not null,   -- e.g. "Completed Hindi Exam Set", "Created a Casecomp"
  tomatoes      int not null,    -- tomatoes earned
  metadata      jsonb,           -- optional extra data
  created_at    timestamptz not null default now()
);

create index if not exists tomato_events_user_id_idx    on tomato_events(user_id);
create index if not exists tomato_events_created_at_idx on tomato_events(created_at desc);
create index if not exists tomato_events_action_type_idx on tomato_events(action_type);

alter table tomato_events enable row level security;

-- Users can read their own events
create policy "Users can read own tomato events"
  on tomato_events for select
  using (auth.uid() = user_id);

-- Users can insert their own events (server action does this with service role key too)
create policy "Users can insert own tomato events"
  on tomato_events for insert
  with check (auth.uid() = user_id);

-- ─── Leaderboard View ──────────────────────────────────────────────────────────
-- Fast read from user_profiles ordered by total_tomatoes_earned.
-- No join needed — totals are maintained incrementally.
create or replace view public.leaderboard as
  select
    id,
    display_name,
    avatar_url,
    total_tomatoes_earned,
    rank() over (order by total_tomatoes_earned desc) as position
  from user_profiles
  order by total_tomatoes_earned desc
  limit 50;
