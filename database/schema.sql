create extension if not exists pgcrypto;

create table if not exists pricing_items (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  unit text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  project_address text,
  site_walk_notes text not null,
  ai_result jsonb,
  status text not null default 'generated'
    check (status in ('generated','needs_review','approved','rejected','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists approval_actions (
  id uuid primary key default gen_random_uuid(),
  agent_run_id uuid not null references agent_runs(id) on delete cascade,
  action text not null check (action in ('approved','rejected')),
  actor text not null default 'Marcus',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists integration_logs (
  id uuid primary key default gen_random_uuid(),
  agent_run_id uuid references agent_runs(id) on delete set null,
  integration text not null,
  status text not null,
  response text,
  created_at timestamptz not null default now()
);

insert into pricing_items (code,name,unit,unit_price) values
('PATIO-SQFT','Premium patio installation','sq ft',25.00),
('PERGOLA','Custom pergola','each',8500.00),
('FIREPIT','Fire pit feature','each',4500.00),
('TURF-SQFT','Artificial turf installation','sq ft',12.00),
('IRRIGATION','Irrigation installation','each',3500.00),
('KITCHEN','Outdoor kitchen package','each',18000.00),
('RETAINING-WALL','Retaining wall','linear ft',85.00),
('WATER-FEATURE','Water feature','each',6500.00)
on conflict (code) do nothing;
