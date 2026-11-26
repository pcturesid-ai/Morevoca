-- Morevoca: skema portofolio. Jalankan di Supabase SQL Editor (akun baru), lalu 002.
-- Pengguna pertama yang mendaftar di Auth otomatis jadi admin.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create or replace function public.claim_first_admin() returns trigger language plpgsql security definer set search_path = public as $$ begin if not exists (select 1 from public.admins) then insert into public.admins(user_id) values (new.id); end if; return new; end $$;
revoke all on function public.claim_first_admin() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.claim_first_admin();
create policy "admin baca admins" on public.admins for select to authenticated using (user_id = auth.uid());

create table public.site_settings (id int primary key default 1 check (id = 1), brand_name text not null default 'Morevoca', tagline text default 'Wedding Photography', hero_title text default 'Momen pernikahanmu, diabadikan dengan hangat', hero_subtitle text default 'Foto pernikahan yang natural, rapi, dan penuh cerita.', hero_image_url text, about_text text default 'Kami fotografer wedding yang fokus pada momen apa adanya.', whatsapp text default '', instagram text default '', email text default '', address text default '', updated_at timestamptz default now());
insert into public.site_settings (id) values (1);
create table public.albums (id uuid primary key default gen_random_uuid(), title text not null, couple_names text, event_type text not null default 'Pernikahan' check (event_type in ('Pernikahan','Akad','Resepsi','Prewedding','Lamaran','Lainnya')), event_date date, location text, description text, cover_url text, is_published boolean not null default false, sort int not null default 0, created_at timestamptz not null default now());
create table public.album_photos (id uuid primary key default gen_random_uuid(), album_id uuid not null references public.albums(id) on delete cascade, url text not null, caption text, sort int not null default 0, created_at timestamptz not null default now());
create index on public.album_photos(album_id, sort);
create table public.packages (id uuid primary key default gen_random_uuid(), name text not null, price bigint not null default 0 check (price >= 0), dp_percent int not null default 30 check (dp_percent between 0 and 100), description text, features text[] not null default '{}', is_popular boolean not null default false, is_active boolean not null default true, sort int not null default 0, created_at timestamptz not null default now());
create table public.testimonials (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 80), event_type text, rating int not null default 5 check (rating between 1 and 5), message text not null check (char_length(message) between 5 and 800), status text not null default 'pending' check (status in ('pending','approved','hidden')), created_at timestamptz not null default now());
create table public.inquiries (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 80), whatsapp text not null check (char_length(whatsapp) between 6 and 20), event_type text, event_date date, package_id uuid references public.packages(id) on delete set null, message text check (char_length(message) <= 1000), status text not null default 'baru', created_at timestamptz not null default now());

alter table public.site_settings enable row level security; alter table public.albums enable row level security; alter table public.album_photos enable row level security;
alter table public.packages enable row level security; alter table public.testimonials enable row level security; alter table public.inquiries enable row level security;

create policy "publik baca pengaturan" on public.site_settings for select to anon, authenticated using (true);
create policy "publik baca album terbit" on public.albums for select to anon, authenticated using (is_published);
create policy "publik baca foto album terbit" on public.album_photos for select to anon, authenticated using (exists (select 1 from public.albums a where a.id = album_id and a.is_published));
create policy "publik baca paket aktif" on public.packages for select to anon, authenticated using (is_active);
create policy "publik baca testimoni disetujui" on public.testimonials for select to anon, authenticated using (status = 'approved');
create policy "publik kirim testimoni" on public.testimonials for insert to anon, authenticated with check (status = 'pending');
create policy "publik kirim pertanyaan" on public.inquiries for insert to anon, authenticated with check (status = 'baru');
create policy "admin semua pengaturan" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua album" on public.albums for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua foto" on public.album_photos for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua paket" on public.packages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua testimoni" on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin semua pertanyaan" on public.inquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('portfolio','portfolio',true) on conflict (id) do nothing;
create policy "admin unggah foto" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admin ubah foto" on storage.objects for update to authenticated using (bucket_id = 'portfolio' and public.is_admin());
create policy "admin hapus foto" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());
