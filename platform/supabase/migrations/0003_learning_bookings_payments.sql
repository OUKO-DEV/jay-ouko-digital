-- Learning, bookings and payment reconciliation.
-- Run after 0001_auth_profiles.sql and 0002_client_workflows.sql.
-- A user-submitted payment reference is NOT proof of payment.
-- Only an administrator may mark a payment confirmed after checking the real M-Pesa record.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null check (char_length(summary) between 10 and 1200),
  level text not null default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  price_kes numeric(12,2) check (price_kes is null or price_kes >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;
revoke all on table public.courses from anon, authenticated;
grant select on table public.courses to anon, authenticated;
grant insert, update, delete on table public.courses to authenticated;

drop policy if exists "public_read_published_courses" on public.courses;
create policy "public_read_published_courses"
  on public.courses for select to anon, authenticated
  using (published or (select public.is_admin()));

drop policy if exists "admins_manage_courses" on public.courses;
create policy "admins_manage_courses"
  on public.courses for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);

alter table public.course_enrollments enable row level security;
revoke all on table public.course_enrollments from anon, authenticated;
grant select, insert, update on table public.course_enrollments to authenticated;

drop policy if exists "clients_read_own_enrollments" on public.course_enrollments;
create policy "clients_read_own_enrollments"
  on public.course_enrollments for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "clients_request_enrollment" on public.course_enrollments;
create policy "clients_request_enrollment"
  on public.course_enrollments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1 from public.courses c
      where c.id = course_id and c.published = true
    )
  );

drop policy if exists "admins_manage_enrollments" on public.course_enrollments;
create policy "admins_manage_enrollments"
  on public.course_enrollments for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  email text,
  topic text not null check (char_length(topic) between 3 and 120),
  preferred_date date not null,
  preferred_time time not null,
  timezone text not null default 'Africa/Nairobi',
  notes text check (notes is null or char_length(notes) <= 1500),
  status text not null default 'requested'
    check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_requests_user_date_idx
  on public.booking_requests (user_id, preferred_date, preferred_time);

alter table public.booking_requests enable row level security;
revoke all on table public.booking_requests from anon, authenticated;
grant select, insert, update on table public.booking_requests to authenticated;

drop policy if exists "clients_read_own_bookings" on public.booking_requests;
create policy "clients_read_own_bookings"
  on public.booking_requests for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "clients_request_bookings" on public.booking_requests;
create policy "clients_request_bookings"
  on public.booking_requests for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'requested'
    and admin_notes is null
  );

drop policy if exists "admins_manage_bookings" on public.booking_requests;
create policy "admins_manage_bookings"
  on public.booking_requests for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create table if not exists public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null check (char_length(purpose) between 3 and 160),
  amount_kes numeric(12,2) not null check (amount_kes > 0 and amount_kes <= 10000000),
  payer_phone text not null check (payer_phone ~ '^\+?254[0-9]{9}$'),
  mpesa_reference text not null check (mpesa_reference ~ '^[A-Za-z0-9]{8,20}$'),
  status text not null default 'submitted'
    check (status in ('submitted', 'verifying', 'confirmed', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mpesa_reference)
);

create index if not exists payment_submissions_user_created_idx
  on public.payment_submissions (user_id, created_at desc);

alter table public.payment_submissions enable row level security;
revoke all on table public.payment_submissions from anon, authenticated;
grant select, insert, update on table public.payment_submissions to authenticated;

drop policy if exists "clients_read_own_payment_submissions" on public.payment_submissions;
create policy "clients_read_own_payment_submissions"
  on public.payment_submissions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "clients_submit_payment_reference" on public.payment_submissions;
create policy "clients_submit_payment_reference"
  on public.payment_submissions for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'submitted'
    and admin_notes is null
  );

drop policy if exists "admins_reconcile_payments" on public.payment_submissions;
create policy "admins_reconcile_payments"
  on public.payment_submissions for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Keep modification timestamps current.
drop trigger if exists courses_updated_at on public.courses;
create trigger courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();
drop trigger if exists booking_requests_updated_at on public.booking_requests;
create trigger booking_requests_updated_at before update on public.booking_requests
  for each row execute function public.set_updated_at();
drop trigger if exists payment_submissions_updated_at on public.payment_submissions;
create trigger payment_submissions_updated_at before update on public.payment_submissions
  for each row execute function public.set_updated_at();

-- Starter courses are deliberately unpublished until the owner reviews and
-- confirms the syllabus and any pricing.
insert into public.courses (slug, title, summary, level, price_kes, published)
values
  ('digital-tools-foundations', 'Digital Tools Foundations',
   'Learn practical ways to use everyday digital tools, organise work and build a reliable online presence.',
   'Beginner', 0, false),
  ('ai-productivity-basics', 'AI Productivity Basics',
   'Understand responsible prompting, research assistance and useful AI-supported workflows.',
   'Beginner', 0, false),
  ('forex-market-foundations', 'Forex Market Foundations',
   'Study currency pairs, chart basics, demo-account practice and risk management. Education only; no signals or profit promises.',
   'Beginner', 0, false)
on conflict (slug) do nothing;
