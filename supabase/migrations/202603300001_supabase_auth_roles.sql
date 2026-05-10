create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.app_role as enum ('super_admin', 'admin', 'teacher', 'student');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role public.app_role not null default 'student',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  visible boolean not null default true,
  order_position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  visible boolean not null default true,
  order_position int not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date,
  location text,
  type text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  public_id text,
  order_position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  email text,
  department text,
  expertise text[] default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  long_description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  long_description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.blocks enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.team enable row level security;
alter table public.departments enable row level security;
alter table public.activities enable row level security;
alter table public.announcements enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'admin')
      and is_active = true
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
      and is_active = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'student',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

drop policy if exists "profiles own select" on public.profiles;
drop policy if exists "profiles admin select" on public.profiles;
drop policy if exists "profiles admin insert" on public.profiles;
drop policy if exists "profiles admin update" on public.profiles;
drop policy if exists "profiles admin delete" on public.profiles;

create policy "profiles own select"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles admin select"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "profiles admin insert"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

create policy "profiles admin update"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "profiles admin delete"
on public.profiles
for delete
to authenticated
using (public.is_admin());

drop policy if exists "pages public read" on public.pages;
drop policy if exists "pages admin write" on public.pages;
create policy "pages public read"
on public.pages
for select
to anon, authenticated
using (visible = true or public.is_admin());
create policy "pages admin write"
on public.pages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "blocks public read" on public.blocks;
drop policy if exists "blocks admin write" on public.blocks;
create policy "blocks public read"
on public.blocks
for select
to anon, authenticated
using (
  (
    visible = true
    and exists (
      select 1
      from public.pages
      where pages.id = blocks.page_id
        and pages.visible = true
    )
  )
  or public.is_admin()
);
create policy "blocks admin write"
on public.blocks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "events public read" on public.events;
drop policy if exists "events admin write" on public.events;
create policy "events public read"
on public.events
for select
to anon, authenticated
using (true);
create policy "events admin write"
on public.events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "gallery public read" on public.gallery;
drop policy if exists "gallery admin write" on public.gallery;
create policy "gallery public read"
on public.gallery
for select
to anon, authenticated
using (true);
create policy "gallery admin write"
on public.gallery
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "team public read" on public.team;
drop policy if exists "team admin write" on public.team;
create policy "team public read"
on public.team
for select
to anon, authenticated
using (true);
create policy "team admin write"
on public.team
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "departments public read" on public.departments;
drop policy if exists "departments admin write" on public.departments;
create policy "departments public read"
on public.departments
for select
to anon, authenticated
using (true);
create policy "departments admin write"
on public.departments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "activities public read" on public.activities;
drop policy if exists "activities admin write" on public.activities;
create policy "activities public read"
on public.activities
for select
to anon, authenticated
using (true);
create policy "activities admin write"
on public.activities
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "announcements public read" on public.announcements;
drop policy if exists "announcements admin write" on public.announcements;
create policy "announcements public read"
on public.announcements
for select
to anon, authenticated
using (published = true or public.is_admin());
create policy "announcements admin write"
on public.announcements
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
