-- TimeBoxer session history (one row per completed session)
-- Run in Supabase SQL editor or via supabase db push

create table if not exists public.timebox_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  task text not null,
  duration_minutes integer not null,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  accomplished boolean not null,
  note text,
  notes text
);

create index if not exists timebox_sessions_user_id_started_at_idx
  on public.timebox_sessions (user_id, started_at desc);

alter table public.timebox_sessions enable row level security;

create policy "timebox_sessions_select_own"
  on public.timebox_sessions for select
  using (auth.uid() = user_id);

create policy "timebox_sessions_insert_own"
  on public.timebox_sessions for insert
  with check (auth.uid() = user_id);

create policy "timebox_sessions_update_own"
  on public.timebox_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "timebox_sessions_delete_own"
  on public.timebox_sessions for delete
  using (auth.uid() = user_id);
