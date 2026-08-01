-- ============================================================
-- DONACENTER — Supabase Schema (reset-ready)
-- Run this whole file in the Supabase SQL Editor once.
-- Safe to re-run: it first DROPs any existing tables (fixing
-- tables created with an older/different schema), then builds
-- the correct ones.
-- ============================================================

-- Reset: drop existing tables in dependency order (CASCADE for safety)
drop table if exists public.favorites cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.orders cascade;
drop table if exists public.profiles cascade;
drop table if exists public.categories cascade;
drop table if exists public.products cascade;

-- PRODUCTS ---------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  tags text[] not null default '{}',
  base_price numeric(10,2) not null,
  discount_percent integer not null default 0,
  colors jsonb not null default '[]',
  sizes text[] not null default '{}',
  stock jsonb not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  rating numeric(2,1) not null default 0,
  sold_count integer not null default 0
);

-- CATEGORIES ---------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  image text,
  product_count integer not null default 0
);

-- PROFILES (extends auth.users) --------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ORDERS --------------------------------------------------------
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null default '[]',
  customer_name text not null,
  customer_last_name text not null,
  phone text not null,
  country text not null,
  city text not null,
  address text not null,
  notes text,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  total numeric(10,2) not null,
  delivery_estimate text,
  payment_method text not null default 'Para në Dorëzim',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- FAVORITES ------------------------------------------------------
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- NEWSLETTER SUBSCRIBERS -------------------------------------------
create table if not exists public.newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY ----------------------------------------------
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.favorites enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- products: anyone can read
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (true);

-- categories: anyone can read
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);

-- profiles: users read their own, admins read all
drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- orders: guest checkout (insert), own reads, admin reads all
drop policy if exists "orders insert" on public.orders;
create policy "orders insert" on public.orders
  for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

-- favorites: users manage their own
drop policy if exists "favorites select own" on public.favorites;
create policy "favorites select own" on public.favorites for select using (auth.uid() = user_id);

drop policy if exists "favorites insert own" on public.favorites;
create policy "favorites insert own" on public.favorites for insert with check (auth.uid() = user_id);

drop policy if exists "favorites delete own" on public.favorites;
create policy "favorites delete own" on public.favorites for delete using (auth.uid() = user_id);

-- newsletter: anyone can insert their email; upserting an existing email
-- (on conflict) takes the update path, so an update policy is needed too
create policy "newsletter insert" on public.newsletter_subscribers
  for insert with check (true);

create policy "newsletter update" on public.newsletter_subscribers
  for update using (true) with check (true);

-- Admin write access (products/categories) via service role key is NOT
-- restricted by RLS, so no additional policies are needed for admin CRUD.

-- ============================================================
-- ONE-TIME SETUP (after running the above):
-- Mark your store owner as admin so RLS-gated admin reads work:
--   update public.profiles set is_admin = true
--   where email = 'donacenter16@gmail.com';
-- ============================================================
