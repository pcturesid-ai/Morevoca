/* Navigasi, sidebar, dropdown, notifikasi & pencarian (data asli). */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const styles = { success: 'bg-emerald-600 text-white', info: 'bg-slate-900 text-white', warning: 'bg-amber-500 text-white' };
  const el = document.createElement('div');
  el.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold ${styles[type] || styles.info} animate-fade-in`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 250); }, 3200);
}

function renderSidebar() {
  const newInq = (store.inquiries || []).filter((x) => x.status === 'baru').length;
  document.getElementById('sidebarNav').innerHTML = NAV_ITEMS.map((item) => {
    const on = appState.activeTab === item.id;
    const badge = item.id === 'inquiries' && newInq ? `<span class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C2410C] text-white">${newInq}</span>` : '';
    return `<button onclick="switchTab('${item.id}')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${on ? 'bg-[#FFF0E9] text-[#C2410C] font-semibold shadow-[inset_0_0_0_1px_rgba(194,65,12,0.08)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}">
      <i data-lucide="${item.icon}" class="w-[18px] h-[18px] shrink-0 ${on ? 'text-[#C2410C]' : 'text-slate-400'}"></i><span class="truncate">${item.label}</span>${badge}</button>`;
  }).join('');
}

function switchTab(tabId) {
  appState.activeTab = tabId;
  document.getElementById('pageTitle').textContent = NAV_ITEMS.find((n) => n.id === tabId)?.label || 'Ringkasan';
  toggleSidebar(false);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar(forceState) {
  const sidebar = document.getElementById('sidebar'), overlay = document.getElementById('sidebarOverlay');
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  const nextOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
  if (window.innerWidth < 1024) {
    sidebar.classList.toggle('-translate-x-full', !nextOpen);
    overlay.classList.toggle('hidden', !nextOpen);
  } else if (typeof forceState === 'undefined') {
    sidebar.classList.toggle('lg:hidden');
  }
}

function toggleDropdown(id) {
  ['notifDropdown', 'profileDropdown', 'searchDropdown'].forEach((item) => {
    const el = document.getElementById(item);
    if (el) item === id ? el.classList.toggle('hidden') : el.classList.add('hidden');
  });
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('#notifBtn') && !e.target.closest('#notifDropdown')) document.getElementById('notifDropdown')?.classList.add('hidden');
  if (!e.target.closest('#profileDropdown') && !e.target.closest('[onclick*="profileDropdown"]')) document.getElementById('profileDropdown')?.classList.add('hidden');
  if (!e.target.closest('#globalSearchInput') && !e.target.closest('#searchDropdown')) document.getElementById('searchDropdown')?.classList.add('hidden');
});

/* Notifikasi: pertanyaan baru, testimoni menunggu, liputan 7 hari ke depan */
function getNotifications() {
  const out = [];
  store.inquiries.filter((x) => x.status === 'baru').forEach((x) => out.push({ icon: 'inbox', color: 'bg-orange-50 text-orange-700', title: 'Pertanyaan baru dari ' + x.name, desc: x.event_type || 'Jenis acara belum diisi', go: 'inquiries' }));
  store.testimonials.filter((x) => x.status === 'pending').forEach((x) => out.push({ icon: 'message-square-quote', color: 'bg-amber-50 text-amber-700', title: 'Testimoni menunggu persetujuan', desc: 'Dari ' + x.name, go: 'testimonials' }));
  const t0 = todayStr(), t7 = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  store.projects.filter((p) => p.event_date && p.event_date >= t0 && p.event_date <= t7 && !['selesai', 'batal'].includes(p.status)).forEach((p) => out.push({ icon: 'calendar', color: 'bg-sky-50 text-sky-700', title: 'Liputan ' + fmtDate(p.event_date, { day: 'numeric', month: 'short' }), desc: p.client_name + (p.location ? ' · ' + p.location : ''), go: 'calendar' }));
  return out;
}
function renderNotifications() {
  const list = getNotifications();
  const badge = document.getElementById('notifBadge');
  badge.textContent = list.length; badge.classList.toggle('hidden', !list.length);
  document.getElementById('notifList').innerHTML = list.map((n) => `
    <button onclick="toggleDropdown('notifDropdown');switchTab('${n.go}')" class="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50/80">
      <div class="w-8 h-8 rounded-xl ${n.color} flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="${n.icon}" class="w-4 h-4"></i></div>
      <div class="min-w-0"><p class="text-xs font-bold text-slate-800 truncate">${esc(n.title)}</p><p class="text-[11.5px] text-slate-500 mt-0.5 truncate">${esc(n.desc)}</p></div></button>`).join('')
    || '<p class="p-5 text-center text-xs text-slate-500">Tidak ada yang perlu ditindaklanjuti.</p>';
}

/* Pencarian cepat: proyek & pertanyaan */
function handleGlobalSearch(query) {
  const dd = document.getElementById('searchDropdown'), clr = document.getElementById('clearSearchBtn');
  const s = query.trim().toLowerCase();
  if (!s) { dd.classList.add('hidden'); clr.classList.add('hidden'); return; }
  clr.classList.remove('hidden');
  const ps = store.projects.filter((p) => (p.client_name + ' ' + (p.location || '')).toLowerCase().includes(s)).slice(0, 5);
  const is = store.inquiries.filter((x) => (x.name + ' ' + x.whatsapp).toLowerCase().includes(s)).slice(0, 4);
  dd.innerHTML = (ps.length ? `<p class="px-2.5 py-1.5 text-[10.5px] font-bold text-slate-400">Proyek & klien</p>` + ps.map((p) => `<button onclick="openProjectDetail('${p.id}');document.getElementById('searchDropdown').classList.add('hidden')" class="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-50"><p class="text-xs font-semibold text-slate-800 truncate">${esc(p.client_name)}</p><p class="text-[11px] text-slate-400 truncate">${esc(fmtDate(p.event_date, { day: 'numeric', month: 'short', year: 'numeric' }) || 'Tanggal belum ada')}${p.location ? ' · ' + esc(p.location) : ''}</p></button>`).join('') : '')
    + (is.length ? `<p class="px-2.5 pt-2 pb-1 text-[10.5px] font-bold text-slate-400 border-t border-slate-100 mt-1">Pertanyaan masuk</p>` + is.map((x) => `<button onclick="switchTab('inquiries');document.getElementById('searchDropdown').classList.add('hidden')" class="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-50"><p class="text-xs font-semibold text-slate-800 truncate">${esc(x.name)}</p><p class="text-[11px] text-slate-400">${esc(x.whatsapp)}</p></button>`).join('') : '')
    || `<p class="p-4 text-center text-xs text-slate-500">Tidak ada hasil untuk "${esc(query)}"</p>`;
  dd.classList.remove('hidden');
}
function clearGlobalSearch() { const i = document.getElementById('globalSearchInput'); i.value = ''; handleGlobalSearch(''); }
