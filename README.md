# Morevoca

- `index.html` = halaman portofolio untuk pengunjung (album, paket, testimoni, form tanya)
- `admin.html` = dashboard admin. Login Supabase; halaman Pertanyaan Masuk, Album, Paket, Testimoni, Pengaturan Situs memakai data asli. Halaman bertanda "contoh" masih data tiruan.

Dashboard manajemen fotografer wedding: proyek, tugas, kanban, kalender, log waktu, laporan, tim, klien, dokumen, pengaturan.
HTML + Tailwind (CDN) + JavaScript modular, tanpa framework. Saat ini memakai **data contoh**; Supabase sudah disiapkan sebagai sambungan data.

## Struktur

```
index.html                 halaman portofolio publik
admin.html                 dashboard admin (sidebar, header, modal)
assets/css/portfolio.css   gaya halaman publik
js/portfolio/              logika halaman publik (api, render, lightbox, form)
assets/css/app.css         gaya tambahan
assets/brand/              logo & favicon
js/config/tailwind.config.js   warna & font (brand oranye, Poppins/Montserrat)
js/config/env.js           akun Supabase (ditimpa saat build, lihat di bawah)
js/lib/supabase.js         klien Supabase -> window.db (null bila belum diisi)
js/data/sample-data.js     data contoh (appState)
js/core/                   helper & kontrol UI (sidebar, modal, notifikasi, pencarian)
js/views/                  satu file per halaman
js/actions/                handler tombol/formulir
js/main.js                 render awal
scripts/build-env.js       menulis env.js dari environment variable
supabase/migrations/       skema SQL (jalankan di akun Supabase baru)
```

## Pakai akun sendiri (Supabase + Vercel)

Semua data akun dipisah dari kode. Tidak ada kunci di dalam repo.

1. **Supabase**: buat project, ambil *Project URL* dan *anon/publishable key* (Settings > API).
2. **Vercel**: import repo ini, lalu isi *Environment Variables*:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy. Vercel menjalankan `node scripts/build-env.js` yang membuat `js/config/env.js` dari variabel tadi.

Uji lokal: salin `.env.example` jadi `.env`, isi, jalankan `npm run build` lalu `npm start`.

Hanya pakai anon/publishable key. Jangan pernah memasukkan `service_role` key ke front-end.

## Warna & font

Ubah di `js/config/tailwind.config.js` (palet `brand`) dan `assets/css/app.css`.
