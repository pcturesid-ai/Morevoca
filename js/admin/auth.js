/* Login admin (Supabase Auth). Pengguna pertama yang mendaftar otomatis jadi admin. */
let AUTH_MODE = 'login';
function gateHtml(msg) {
  const reg = AUTH_MODE === 'register';
  return `<div class="min-h-screen flex items-center justify-center p-5 bg-[#F5F7FB]">
    <form onsubmit="submitAuth(event)" class="w-full max-w-sm bg-white rounded-3xl shadow-card border border-slate-100 p-7 space-y-4">
      <img src="assets/brand/logo-black.png" alt="Morevoca" class="h-6 w-auto">
      <div><h1 class="text-xl font-extrabold text-slate-900">${reg ? 'Daftar admin' : 'Masuk admin'}</h1><p class="text-xs text-slate-500 mt-1">${reg ? 'Akun pertama otomatis jadi admin.' : 'Khusus pemilik studio.'}</p></div>
      ${msg ? `<p class="text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl p-3">${esc(msg)}</p>` : ''}
      <input name="email" type="email" required autocomplete="email" placeholder="Email" class="${INPUT}">
      <input name="password" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}" placeholder="Kata sandi (min. 6 karakter)" class="${INPUT}">
      <button type="submit" class="w-full py-3 rounded-xl ${BTN} text-sm font-bold">${reg ? 'Daftar' : 'Masuk'}</button>
      <button type="button" onclick="AUTH_MODE='${reg ? 'login' : 'register'}';showGate()" class="w-full text-xs font-semibold text-[#C2410C]">${reg ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}</button>
    </form></div>`;
}
function showGate(msg) {
  let g = document.getElementById('authGate');
  if (!g) { g = document.createElement('div'); g.id = 'authGate'; g.className = 'fixed inset-0 z-[100] overflow-y-auto bg-[#F5F7FB]'; document.body.appendChild(g); }
  g.innerHTML = gateHtml(msg);
}
function hideGate() { document.getElementById('authGate')?.remove(); }

async function submitAuth(e) {
  e.preventDefault();
  const f = e.target, email = f.email.value.trim(), password = f.password.value;
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Memproses…';
  if (AUTH_MODE === 'register') {
    const { data, error } = await db.auth.signUp({ email, password });
    if (error) return showGate(error.message);
    if (!data.session) { AUTH_MODE = 'login'; return showGate('Pendaftaran berhasil. Buka email untuk konfirmasi, lalu masuk.'); }
  } else {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return showGate(error.message.includes('Invalid') ? 'Email atau kata sandi salah.' : error.message);
  }
  bootAdmin();
}
async function logout() { await db.auth.signOut(); location.reload(); }

async function bootAdmin() {
  if (!window.db) { showGate('Supabase belum dikonfigurasi (SUPABASE_URL / SUPABASE_ANON_KEY).'); return; }
  const { data: { session } } = await db.auth.getSession();
  if (!session) { showGate(); return; }
  const { data: isAdmin } = await db.rpc('is_admin');
  if (!isAdmin) { await db.auth.signOut(); AUTH_MODE = 'login'; showGate('Akun ini bukan admin. Admin sudah terdaftar.'); return; }
  store.user = session.user;
  document.querySelectorAll('[data-user-email]').forEach((el) => (el.textContent = session.user.email));
  document.querySelectorAll('[data-user-name]').forEach((el) => (el.textContent = session.user.email.split('@')[0]));
  hideGate();
  await loadStore();
  appState.activeTab = 'inquiries';
  document.getElementById('pageTitle').textContent = NAV_ITEMS.find((n) => n.id === 'inquiries').label;
  renderApp();
}
