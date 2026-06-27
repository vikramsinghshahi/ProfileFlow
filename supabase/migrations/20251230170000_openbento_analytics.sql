-- OpenBento Analytics schema

create extension if not exists "pgcrypto";

create table if not exists public.openbento_analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Identifies a single deployed bento page
  site_id text not null,

  -- 'page_view' = inbound traffic, 'click' = outbound traffic
  event_type text not null check (event_type in ('page_view', 'click')),

  -- Optional metadata (for click events)
  block_id text,
  destination_url text,

  -- Context
  page_url text,
  referrer text,

  -- UTM params (captured from page_url)
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  -- Client hints
  user_agent text,
  language text,
  screen_w integer,
  screen_h integer
);

create index if not exists openbento_analytics_events_site_time_idx
  on public.openbento_analytics_events (site_id, created_at desc);

create index if not exists openbento_analytics_events_site_type_time_idx
  on public.openbento_analytics_events (site_id, event_type, created_at desc);

alter table public.openbento_analytics_events enable row level security;

-- No public policies on purpose:
-- writes should happen through the Edge Function (service role),
-- reads should happen through the admin Edge Function.

