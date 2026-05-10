create extension if not exists pgcrypto;

create table if not exists public.suppliers (
  id text primary key,
  record jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  intake jsonb not null,
  diagnosis jsonb not null
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  submission_id uuid references public.submissions(id) on delete set null,
  response jsonb not null
);

create table if not exists public.report_supplier_candidates (
  submission_id uuid references public.submissions(id) on delete cascade,
  supplier_id text references public.suppliers(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (submission_id, supplier_id)
);

alter table public.suppliers enable row level security;
alter table public.submissions enable row level security;
alter table public.feedback enable row level security;
alter table public.report_supplier_candidates enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.suppliers to anon, authenticated;
grant select, insert on public.submissions to anon, authenticated;
grant select, insert on public.feedback to anon, authenticated;
grant select, insert, delete on public.report_supplier_candidates to anon, authenticated;

drop policy if exists "mvp suppliers select" on public.suppliers;
drop policy if exists "mvp suppliers insert" on public.suppliers;
drop policy if exists "mvp suppliers update" on public.suppliers;
drop policy if exists "mvp submissions select" on public.submissions;
drop policy if exists "mvp submissions insert" on public.submissions;
drop policy if exists "mvp feedback select" on public.feedback;
drop policy if exists "mvp feedback insert" on public.feedback;
drop policy if exists "mvp candidates select" on public.report_supplier_candidates;
drop policy if exists "mvp candidates insert" on public.report_supplier_candidates;
drop policy if exists "mvp candidates delete" on public.report_supplier_candidates;

create policy "mvp suppliers select" on public.suppliers for select using (true);
create policy "mvp suppliers insert" on public.suppliers for insert with check (true);
create policy "mvp suppliers update" on public.suppliers for update using (true) with check (true);

create policy "mvp submissions select" on public.submissions for select using (true);
create policy "mvp submissions insert" on public.submissions for insert with check (true);

create policy "mvp feedback select" on public.feedback for select using (true);
create policy "mvp feedback insert" on public.feedback for insert with check (true);

create policy "mvp candidates select" on public.report_supplier_candidates for select using (true);
create policy "mvp candidates insert" on public.report_supplier_candidates for insert with check (true);
create policy "mvp candidates delete" on public.report_supplier_candidates for delete using (true);

insert into public.suppliers (id, record)
values
  (
    'sup-1',
    '{
      "id": "sup-1",
      "name": "Printful",
      "website": "https://www.printful.com",
      "location": "US / global fulfillment",
      "type": "Decorator / print-on-demand",
      "categories": "T-shirts, hoodies, hats, simple apparel",
      "services": "DTG, embroidery, fulfillment, mockups",
      "moq": "Low / no traditional MOQ",
      "startupFit": "High for validation",
      "techPackRequired": "No",
      "priceTier": "Medium",
      "verificationTier": "2 - Profile Reviewed",
      "bestFor": "Testing decorated blanks without inventory",
      "avoidIf": "You need custom fit, custom fabric, or premium bulk margins",
      "notes": "Useful as a low-risk validation path, not a factory substitute.",
      "lastChecked": "2026-05-09"
    }'::jsonb
  ),
  (
    'sup-2',
    '{
      "id": "sup-2",
      "name": "Los Angeles Apparel Wholesale",
      "website": "https://losangelesapparel.net",
      "location": "Los Angeles, CA",
      "type": "Premium blank supplier",
      "categories": "Tees, fleece, sweats, basics",
      "services": "Wholesale blanks",
      "moq": "Varies by account/order",
      "startupFit": "Good for premium blanks",
      "techPackRequired": "No",
      "priceTier": "Medium",
      "verificationTier": "1 - Publicly Listed",
      "bestFor": "Premium-feeling blank programs and local decoration",
      "avoidIf": "You need one supplier to manage decoration, labels, and packaging",
      "notes": "Pair with a decorator or relabeling partner.",
      "lastChecked": "2026-05-09"
    }'::jsonb
  ),
  (
    'sup-3',
    '{
      "id": "sup-3",
      "name": "Maker''s Row",
      "website": "https://makersrow.com",
      "location": "US directory",
      "type": "Sourcing directory",
      "categories": "Apparel, accessories, production services",
      "services": "Supplier discovery",
      "moq": "Depends on supplier",
      "startupFit": "Medium",
      "techPackRequired": "Depends on supplier",
      "priceTier": "Varies",
      "verificationTier": "1 - Publicly Listed",
      "bestFor": "Researching domestic cut-and-sew and sample-room candidates",
      "avoidIf": "You expect one perfect match without outreach work",
      "notes": "Use the report criteria to narrow options.",
      "lastChecked": "2026-05-09"
    }'::jsonb
  )
on conflict (id) do update set
  record = excluded.record,
  updated_at = now();
