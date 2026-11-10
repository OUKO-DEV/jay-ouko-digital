-- Client requests and project tracking.
-- Run after 0001_auth_profiles.sql.
-- RLS is mandatory; server-side redirects are not the database security boundary.

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  email text,
  service text not null check (char_length(service) between 2 and 100),
  budget text,
  details text not null check (char_length(details) between 10 and 4000),
  status text not null default 'submitted'
    check (status in ('submitted', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed', 'declined')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_requests_user_created_idx
  on public.service_requests (user_id, created_at desc);
create index if not exists service_requests_status_created_idx
  on public.service_requests (status, created_at desc);

alter table public.service_requests enable row level security;
revoke all on table public.service_requests from anon, authenticated;
grant select, insert, update on table public.service_requests to authenticated;

drop policy if exists "clients_read_own_requests" on public.service_requests;
create policy "clients_read_own_requests"
  on public.service_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "clients_submit_own_requests" on public.service_requests;
create policy "clients_submit_own_requests"
  on public.service_requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'submitted'
    and admin_notes is null
  );

drop policy if exists "admins_update_service_requests" on public.service_requests;
create policy "admins_update_service_requests"
  on public.service_requests for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users (id) on delete restrict,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 3000),
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'waiting_for_client', 'completed', 'cancelled')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_created_idx
  on public.projects (client_id, created_at desc);

alter table public.projects enable row level security;
revoke all on table public.projects from anon, authenticated;
grant select, insert, update on table public.projects to authenticated;

drop policy if exists "clients_read_own_projects" on public.projects;
create policy "clients_read_own_projects"
  on public.projects for select to authenticated
  using (client_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "admins_manage_projects" on public.projects;
create policy "admins_manage_projects"
  on public.projects for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Update timestamps consistently whenever an admin changes a record.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_requests_updated_at on public.service_requests;
create trigger service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
