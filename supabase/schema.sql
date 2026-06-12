-- CodeSprout backend schema (Supabase / Postgres).
-- Apply in the SQL editor of a new Supabase project, then set
-- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.
-- Enable "Allow anonymous sign-ins" + manual identity linking in Auth
-- settings (local-first → claim-account model).

-- ---------------------------------------------------------------- profiles
create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Auto-generated gardener handles; never real names (teen privacy).
  display_name text not null default ('gardener-' || substr(md5(random()::text), 1, 6)),
  birth_year int check (birth_year is null or birth_year between 1900 and 2100),
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "own profile read" on profiles for select using (auth.uid() = user_id);
create policy "own profile write" on profiles for insert with check (auth.uid() = user_id);
create policy "own profile update" on profiles for update using (auth.uid() = user_id);

-- ------------------------------------------------------------------- saves
-- One row per user: the entire localStorage bundle (see src/lib/saveFile.js).
create table if not exists saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  bundle jsonb not null,
  updated_at timestamptz not null default now()
);
alter table saves enable row level security;
create policy "own save read" on saves for select using (auth.uid() = user_id);
create policy "own save upsert" on saves for insert with check (auth.uid() = user_id);
create policy "own save update" on saves for update using (auth.uid() = user_id);

-- ------------------------------------------------------------------ league
-- Weekly XP league in cohorts of 20. Members post XP via the RPC below
-- (server-side plausibility clamp = cheap anti-cheat).
create table if not exists league_members (
  week_start date not null,
  league_id int not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  xp int not null default 0 check (xp >= 0),
  updated_at timestamptz not null default now(),
  primary key (week_start, user_id)
);
alter table league_members enable row level security;
-- Cohort members can read each other's rows (the league board).
create policy "league cohort read" on league_members for select using (
  league_id in (
    select league_id from league_members me
    where me.user_id = auth.uid() and me.week_start = league_members.week_start
  )
);

-- Join this week's league (assigns the first cohort with a free slot).
create or replace function join_league()
returns league_members
language plpgsql security definer as $$
declare
  wk date := date_trunc('week', now())::date;
  target int;
  me league_members;
begin
  select league_id into target from league_members
    where week_start = wk group by league_id having count(*) < 20
    order by league_id limit 1;
  if target is null then
    select coalesce(max(league_id), 0) + 1 into target
      from league_members where week_start = wk;
  end if;
  insert into league_members (week_start, league_id, user_id, display_name)
    values (wk, target, auth.uid(),
            (select display_name from profiles where user_id = auth.uid()))
    on conflict (week_start, user_id) do nothing;
  select * into me from league_members
    where week_start = wk and user_id = auth.uid();
  return me;
end $$;

-- Post weekly XP (clamped: nobody honestly earns > 2000 XP/day).
create or replace function post_league_xp(new_xp int)
returns void
language plpgsql security definer as $$
declare
  wk date := date_trunc('week', now())::date;
  cap int := 2000 * (extract(isodow from now())::int);
begin
  update league_members
    set xp = greatest(xp, least(new_xp, cap)), updated_at = now()
    where week_start = wk and user_id = auth.uid();
end $$;

-- ------------------------------------------------------------------ events
-- Community events ("Forest Wildfire"): everyone's focus minutes fill a
-- shared bar; completion unlocks a rare species flag client-side.
create table if not exists events (
  id text primary key,
  name text not null,
  goal_minutes int not null,
  progress_minutes int not null default 0,
  reward_species text,
  starts_at timestamptz not null,
  ends_at timestamptz not null
);
alter table events enable row level security;
create policy "events are public" on events for select using (true);

create table if not exists event_contributions (
  event_id text references events (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  minutes int not null default 0 check (minutes >= 0),
  primary key (event_id, user_id)
);
alter table event_contributions enable row level security;
create policy "own contribution read" on event_contributions
  for select using (auth.uid() = user_id);

create or replace function contribute_minutes(event_id_in text, minutes_in int)
returns void
language plpgsql security definer as $$
begin
  if minutes_in < 1 or minutes_in > 120 then return; end if; -- plausibility
  insert into event_contributions (event_id, user_id, minutes)
    values (event_id_in, auth.uid(), minutes_in)
    on conflict (event_id, user_id)
    do update set minutes = event_contributions.minutes + minutes_in;
  update events set progress_minutes = progress_minutes + minutes_in
    where id = event_id_in and now() between starts_at and ends_at;
end $$;
