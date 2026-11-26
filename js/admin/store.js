/* Data asli dari Supabase untuk halaman admin. */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const BTN = 'bg-[#C2410C] hover:bg-[#9A3412] text-white';
const INPUT = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C]';
const EVENT_TYPES = ['Pernikahan', 'Akad', 'Resepsi', 'Prewedding', 'Lamaran', 'Lainnya'];

const store = { albums: [], photos: {}, packages: [], testimonials: [], inquiries: [], settings: null, user: null };

async function q(promise) {
  const { data, error } = await promise;
  if (error) { console.error(error); showToast('Gagal: ' + error.message, 'warning'); return null; }
  return data;
}
async function loadStore() {
  const [s, a, p, t, i] = await Promise.all([
    q(db.from('site_settings').select('*').eq('id', 1).maybeSingle()),
    q(db.from('albums').select('*').order('sort').order('created_at', { ascending: false })),
    q(db.from('packages').select('*').order('sort')),
    q(db.from('testimonials').select('*').order('created_at', { ascending: false })),
    q(db.from('inquiries').select('*, packages(name)').order('created_at', { ascending: false })),
  ]);
  store.settings = s || {}; store.albums = a || []; store.packages = p || []; store.testimonials = t || []; store.inquiries = i || [];
}
async function reload(table) {
  const map = { albums: () => db.from('albums').select('*').order('sort').order('created_at', { ascending: false }), packages: () => db.from('packages').select('*').order('sort'), testimonials: () => db.from('testimonials').select('*').order('created_at', { ascending: false }), inquiries: () => db.from('inquiries').select('*, packages(name)').order('created_at', { ascending: false }) };
  store[table] = (await q(map[table]())) || store[table];
  renderApp();
}

/* Foto: kecilkan di HP sebelum diunggah (maks 1800px, JPEG) */
async function compressImage(file, max = 1800, quality = 0.82) {
  try {
    const bmp = await createImageBitmap(file);
    const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * r); c.height = Math.round(bmp.height * r);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b || file), 'image/jpeg', quality));
  } catch { return file; }
}
async function uploadPhoto(file, folder) {
  const blob = await compressImage(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await db.storage.from('portfolio').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
  if (error) { showToast('Upload gagal: ' + error.message, 'warning'); return null; }
  return { path, url: db.storage.from('portfolio').getPublicUrl(path).data.publicUrl };
}
function pathFromUrl(url) { const m = String(url || '').split('/object/public/portfolio/')[1]; return m ? decodeURIComponent(m) : null; }
