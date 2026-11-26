/*
 * Koneksi Supabase. Memakai nilai dari js/config/env.js.
 * Bila URL/key kosong, aplikasi tetap jalan dengan data contoh (window.db = null).
 */
(function () {
  const env = window.MOREVOCA_ENV || {};
  const ready = env.SUPABASE_URL && env.SUPABASE_ANON_KEY && window.supabase;
  window.db = ready ? window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY) : null;
  window.dbReady = !!window.db;
})();
