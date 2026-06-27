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

-- 4. BLOGS table
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  author text not null default 'Admin',
  author_image text not null default '',
  read_time text not null default '',
  published_at date not null default current_date,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- If you already created the blogs table before this update, run these
-- to add the new columns without losing existing posts:
-- alter table blogs add column if not exists subtitle text not null default '';
-- alter table blogs add column if not exists category text not null default '';
-- alter table blogs add column if not exists tags text[] not null default '{}';
-- alter table blogs add column if not exists author_image text not null default '';
-- alter table blogs add column if not exists read_time text not null default '';
-- alter table blogs add column if not exists featured boolean not null default false;

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
alter table blogs enable row level security;

create policy "public read reels" on reels for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read plans" on plans for select using (true);
create policy "public read blogs" on blogs for select using (true);

-- ============================================================
-- Storage bucket for admin-uploaded media (reel posters/videos,
-- project images). Public read so the site can display the files;
-- uploads only ever happen via signed URLs minted by the admin
-- server function (adminUpload.functions.ts), which uses the
-- service_role key and bypasses storage RLS — so no public insert
-- policy is needed here, same reasoning as the tables above.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

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
