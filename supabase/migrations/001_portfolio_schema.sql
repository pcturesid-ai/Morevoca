-- Skema portofolio Morevoca. Jalankan di Supabase SQL Editor (akun baru).
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
-- (tabel site_settings, albums, album_photos, packages, testimonials, inquiries, kebijakan RLS dan bucket 'portfolio':
--  lihat migrasi "portfolio_schema" di project Supabase; salin dari sana bila perlu.)
