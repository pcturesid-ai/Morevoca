-- Morevoca: proyek/klien dan pembayaran (DP, pelunasan). Jalankan setelah 001.
create table public.projects (id uuid primary key default gen_random_uuid(), client_name text not null check (char_length(client_name) between 1 and 100), whatsapp text, event_type text not null default 'Pernikahan', event_date date, event_time text, location text, package_id uuid references public.packages(id) on delete set null, price bigint not null default 0 check (price >= 0), dp_percent int not null default 30 check (dp_percent between 0 and 100), status text not null default 'booking' check (status in ('booking','dp','editing','selesai','batal')), notes text, inquiry_id uuid references public.inquiries(id) on delete set null, created_at timestamptz not null default now());
create index on public.projects(event_date);
create table public.payments (id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade, amount bigint not null check (amount > 0), note text, paid_at date not null default current_date, created_at timestamptz not null default now());
create index on public.payments(project_id);
alter table public.projects enable row level security; alter table public.payments enable row level security;
create policy "admin semua proyek" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua pembayaran" on public.payments for all to authenticated using (public.is_admin()) with check (public.is_admin());
