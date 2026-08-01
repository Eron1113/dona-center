-- ============================================================
-- DONACENTER — Safe migration: add ONLY the missing
-- newsletter_subscribers table (and its RLS policies).
--
-- ⚠️ Use THIS file instead of schema.sql when your live database
-- already has products/orders/profiles data. schema.sql DROPs all
-- tables (it's a full reset); this file touches nothing existing.
-- Safe to re-run (uses IF NOT EXISTS + DROP POLICY IF EXISTS).
-- Run it in the Supabase SQL Editor.
-- ============================================================

create table if not exists public.newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone can insert their email (newsletter signup)
drop policy if exists "newsletter insert" on public.newsletter_subscribers;
create policy "newsletter insert" on public.newsletter_subscribers
  for insert with check (true);

-- Upserting an existing email (on conflict) takes the update path,
-- so an update policy is needed too
drop policy if exists "newsletter update" on public.newsletter_subscribers;
create policy "newsletter update" on public.newsletter_subscribers
  for update using (true) with check (true);

-- ============================================================
-- Verify afterwards:
--   select * from public.newsletter_subscribers;
--   (returns an empty set, no error)
-- ============================================================
