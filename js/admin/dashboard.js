/* Ringkasan: angka penting dari data asli. */
function renderDashboardView() {
  const active = store.projects.filter((p) => !['selesai', 'batal'].includes(p.status));
  const ym = todayStr().slice(0, 7);
  const incomeMonth = store.payments.filter((x) => x.paid_at.startsWith(ym)).reduce((s, x) => s + Number(x.amount), 0);
  const receivable = active.reduce((s, p) => s + Math.max(0, p.price - paidOf(p.id)), 0);
  const newInq = store.inquiries.filter((x) => x.status === 'baru').length;
  const upcoming = store.projects.filter((p) => p.event_date && p.event_date >= todayStr() && !['selesai', 'batal'].includes(p.status)).slice(0, 5);
  const months = [...Array(6)].map((_, i) => { const d = new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; return { l: d.toLocaleDateString('id-ID', { month: 'short' }), v: store.payments.filter((x) => x.paid_at.startsWith(k)).reduce((s, x) => s + Number(x.amount), 0) }; });
  const max = Math.max(1, ...months.map((m) => m.v));
  const kpi = (icon, label, val, go) => `<button onclick="switchTab('${go}')" class="text-left bg-white rounded-2xl p-5 shadow-card border border-slate-100 hover:shadow-card-hover transition-shadow"><div class="w-10 h-10 rounded-xl bg-[#FFF0E9] text-[#C2410C] flex items-center justify-center"><i data-lucide="${icon}" class="w-5 h-5"></i></div><p class="text-xs font-semibold text-slate-500 mt-3">${label}</p><p class="text-2xl font-extrabold text-slate-900 mt-0.5">${val}</p></button>`;
  return `<div class="animate-fade-in space-y-5">
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">${kpi('inbox', 'Pertanyaan baru', newInq, 'inquiries')}${kpi('folder-heart', 'Proyek aktif', active.length, 'projects')}${kpi('wallet', 'Pemasukan bulan ini', formatRupiah(incomeMonth), 'projects')}${kpi('hourglass', 'Sisa tagihan klien', formatRupiah(receivable), 'projects')}</div>
    <div class="grid lg:grid-cols-2 gap-5">
      <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-5"><h3 class="font-bold text-slate-900 text-sm">Jadwal terdekat</h3>
        <div class="mt-3 divide-y divide-slate-100">${upcoming.map((p) => `<button onclick="openProjectDetail('${p.id}')" class="w-full text-left py-3 flex items-center justify-between gap-3"><div class="min-w-0"><p class="text-sm font-bold truncate">${esc(p.client_name)}</p><p class="text-[11px] text-slate-500 truncate">${esc(p.event_type)}${p.location ? ' · ' + esc(p.location) : ''}</p></div><span class="shrink-0 text-xs font-bold text-[#C2410C]">${esc(fmtDate(p.event_date, { day: 'numeric', month: 'short' }))}</span></button>`).join('') || '<p class="text-xs text-slate-400 py-3">Belum ada jadwal. Tambahkan proyek.</p>'}</div></div>
      <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-5"><h3 class="font-bold text-slate-900 text-sm">Pemasukan 6 bulan</h3>
        <div class="mt-4 flex items-end gap-3 h-40">${months.map((m) => `<div class="flex-1 flex flex-col items-center justify-end h-full gap-1.5"><span class="text-[10px] font-semibold text-slate-500">${m.v ? (m.v / 1e6).toFixed(1).replace('.0', '') + ' jt' : ''}</span><div class="w-full rounded-t-lg bg-[#C2410C]/85" style="height:${Math.max(3, m.v / max * 100)}%"></div><span class="text-[11px] text-slate-500">${m.l}</span></div>`).join('')}</div></div>
    </div></div>`;
}
