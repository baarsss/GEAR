-- Test-stage email accounts and moderated provider submissions.
-- Apply after 0001_catalog.sql. Only the project owner may publish entries.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('consumer', 'provider')),
  consent_version text not null check (length(trim(consent_version)) > 0),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
revoke all on public.user_profiles from anon, authenticated;
grant select, insert on public.user_profiles to authenticated;

create policy user_profiles_read_own on public.user_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy user_profiles_insert_own on public.user_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);

alter table public.catalog_entries
  add column if not exists owner_id uuid references auth.users(id) on delete set null,
  add column if not exists provider_type text not null default 'private'
    check (provider_type in ('private', 'legal')),
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'verified'));

alter table public.catalog_entries drop constraint if exists catalog_entries_status_check;
alter table public.catalog_entries add constraint catalog_entries_status_check
  check (status in ('draft', 'pending', 'published', 'hidden'));

alter table public.catalog_entries add constraint verified_legal_publication
  check (status <> 'published' or provider_type <> 'legal' or verification_status = 'verified');

create index if not exists catalog_entries_owner_idx
  on public.catalog_entries (owner_id, created_at desc) where owner_id is not null;

grant insert on public.catalog_entries to authenticated;
grant usage, select on sequence public.catalog_entries_id_seq to authenticated;

create policy catalog_entries_owner_read on public.catalog_entries
  for select to authenticated using ((select auth.uid()) = owner_id);

create policy catalog_entries_provider_submit on public.catalog_entries
  for insert to authenticated with check (
    owner_id = (select auth.uid())
    and status = 'pending'
    and promoted = false
    and is_demo = false
    and verification_status = 'unverified'
    and exists (
      select 1 from public.user_profiles
      where user_id = (select auth.uid()) and role = 'provider'
    )
  );

-- No public UPDATE/DELETE policies: only a project owner using Supabase Studio
-- can moderate, verify a legal entity and publish an entry.
