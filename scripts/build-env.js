/*
 * Menulis js/config/env.js dari environment variable.
 * Dipakai Vercel (buildCommand) dan bisa dijalankan lokal: `npm run build`.
 */
const fs = require('fs');
const path = require('path');

// Baca .env lokal bila ada (tidak dipakai di Vercel, di sana sudah ada process.env)
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
};
const out = `/* Dibuat otomatis oleh scripts/build-env.js — jangan diedit. */\nwindow.MOREVOCA_ENV = ${JSON.stringify(env, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '..', 'js', 'config', 'env.js'), out);
console.log(env.SUPABASE_URL ? 'env.js dibuat dengan akun Supabase dari environment.' : 'env.js dibuat kosong (mode data contoh).');
