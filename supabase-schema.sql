-- ============================================================
-- YUGNOVA Admin Panel — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. REELS table
create table if not exists reels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  rating numeric not null default 5,
  text text not null default '',
  poster text not null default '',
  video text not null default '',
  likes text not null default '0',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. PROJECTS table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  tags text[] not null default '{}',
  description text not null default '',
  image text not null default '',
  link text not null default '',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. PLANS table
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  currency text not null default '₹',
  period text not null default '/project',
  description text not null default '',
  features text[] not null default '{}',
  is_popular boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
--
-- Public (anon key, used by the browser) gets READ-ONLY access.
-- All writes go through the admin panel's server functions, which use
-- the service_role key — that key bypasses RLS entirely, so it does NOT
-- need (and must NOT have) a write policy here. Do not add an "anon
-- write" policy; that would let anyone with devtools open write directly
-- to these tables, bypassing the admin login completely.
-- ============================================================

alter table reels enable row level security;
alter table projects enable row level security;
alter table plans enable row level security;

create policy "public read reels" on reels for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read plans" on plans for select using (true);

-- ============================================================
-- Seed data (optional — remove if you want to start fresh)
-- ============================================================

insert into plans (name, price, currency, period, description, features, is_popular, order_index) values
(
  'Web Development',
  49999,
  '₹',
  '/project',
  'Professional websites and web applications built to convert.',
  ARRAY[
    'Business Websites & Landing Pages',
    'Custom Web Applications',
    'E-Commerce Solutions',
    'CMS Integration',
    'Performance Optimisation',
    'SEO-Ready Structure'
  ],
  false,
  0
),
(
  'Mobile App',
  79999,
  '₹',
  '/project',
  'Native-quality mobile experiences for iOS and Android.',
  ARRAY[
    'React Native / Flutter',
    'iOS & Android',
    'Push Notifications',
    'Offline Support',
    'App Store Submission',
    'Analytics Integration'
  ],
  true,
  1
),
(
  'AI & Automation',
  99999,
  '₹',
  '/project',
  'Intelligent systems that automate and amplify your business.',
  ARRAY[
    'Custom AI Models',
    'Workflow Automation',
    'Chatbots & Assistants',
    'Data Pipelines',
    'API Integrations',
    'Ongoing Model Fine-tuning'
  ],
  false,
  2
)
on conflict do nothing;
