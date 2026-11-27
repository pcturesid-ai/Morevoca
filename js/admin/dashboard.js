/* Ringkasan: layout & gaya mengikuti referensi Lumina, data asli Supabase. */
function renderDashboardView() {
  const today = todayStr();
  const ym = today.slice(0, 7);
  const prevYm = (() => { const d = new Date(today); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7); })();

  const active   = store.projects.filter((p) => !['selesai', 'batal'].includes(p.status));
  const newInq   = store.inquiries.filter((x) => x.status === 'baru').length;
  const prevInq  = store.inquiries.filter((x) => x.status === 'baru' && x.created_at < today).length; // approx

  const incomeMonth = store.payments.filter((x) => x.paid_at?.startsWith(ym)).reduce((s, x) => s + Number(x.amount), 0);
  const incomePrev  = store.payments.filter((x) => x.paid_at?.startsWith(prevYm)).reduce((s, x) => s + Number(x.amount), 0);
  const receivable  = active.reduce((s, p) => s + Math.max(0, p.price - paidOf(p.id)), 0);

  const trend = (now, prev) => {
    if (!prev) return '';
    const pct = Math.round(((now - prev) / prev) * 100);
    const up = pct >= 0;
    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}">${up ? '↑' : '↓'} ${Math.abs(pct)}%</span>`;
  };

  /* ---- KPI CARDS ---- */
  const kpi = (icon, iconBg, shadow, label, val, sub, go, trndHtml) =>
    `<button onclick="switchTab('${go}')" class="text-left bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100/80 transition-all flex items-center gap-4">
      <div class="w-12 h-12 rounded-full ${iconBg} text-white flex items-center justify-center shrink-0 ${shadow}">
        <i data-lucide="${icon}" class="w-5 h-5"></i>
      </div>
      <div class="min-w-0">
        <p class="text-[12.5px] font-medium text-slate-500">${label}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${val}</span>${trndHtml}
        </div>
        <p class="text-[11px] text-slate-400 mt-0.5">${sub}</p>
      </div>
    </button>`;

  /* ---- STATUS PROJECT BREAKDOWN ---- */
  const statuses = [
    ['booking', 'Booking',   'bg-amber-400'],
    ['dp',      'DP masuk',  'bg-sky-500'],
    ['editing', 'Editing',   'bg-violet-500'],
    ['selesai', 'Selesai',   'bg-emerald-500'],
  ];
  const total = store.projects.length || 1;
  const statusRows = statuses.map(([k, l, bar]) => {
    const n = store.projects.filter((p) => p.status === k).length;
    const pct = Math.round((n / total) * 100);
    return `<div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${bar} shrink-0"></span><span class="text-slate-600 font-medium">${l}</span></div>
        <span class="font-bold text-slate-800">${n}</span>
      </div>
      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="${bar} h-full rounded-full" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  /* ---- ALUR PRODUKSI (stage boxes) ---- */
  const bk  = store.projects.filter((p) => p.status === 'booking').length;
  const dp  = store.projects.filter((p) => p.status === 'dp').length;
  const ed  = store.projects.filter((p) => p.status === 'editing').length;
  const sl  = store.projects.filter((p) => p.status === 'selesai').length;
  const totalAll = bk + dp + ed + sl || 1;
  const compRate = Math.round((sl / totalAll) * 100);
  const r = 17.5, circ = +(2 * Math.PI * r).toFixed(2);
  const dashOff = +(circ * (1 - compRate / 100)).toFixed(2);
  const stageBox = (bg, hover, label, n) =>
    `<div onclick="switchTab('projects')" class="cursor-pointer ${bg} ${hover} transition-all rounded-xl p-2.5 text-center">
      <p class="text-[11px] font-medium text-slate-500 truncate">${label}</p>
      <p class="text-xl font-extrabold text-slate-900 mt-1">${n}</p>
    </div>`;

  /* ---- INCOME BARS ---- */
  const months = [...Array(6)].map((_, i) => {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1);
    const k = d.toISOString().slice(0, 7);
    const v = store.payments.filter((x) => x.paid_at?.startsWith(k)).reduce((s, x) => s + Number(x.amount), 0);
    return { l: d.toLocaleDateString('id-ID', { month: 'short' }), v };
  });
  const maxV = Math.max(1, ...months.map((m) => m.v));
  const bars = months.map((m, i) => {
    const pct = Math.max(10, Math.round((m.v / maxV) * 100));
    const isLast = i === months.length - 1;
    return `<div class="group relative flex-1 flex flex-col items-center h-full justify-end">
      <div class="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10.5px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-20">
        ${m.l}: ${m.v ? (m.v / 1e6).toFixed(1) + ' jt' : 'Rp 0'}
      </div>
      <div class="w-full max-w-[26px] rounded-t-lg rounded-b-sm transition-all duration-300 cursor-pointer ${isLast ? 'bg-[#C2410C] shadow-[0_4px_12px_rgba(194,65,12,0.35)]' : 'bg-[#E2E8F0] group-hover:bg-[#F9A87A]'}" style="height:${pct}%"></div>
      <span class="text-[11px] font-medium ${isLast ? 'text-[#C2410C] font-bold' : 'text-slate-400'} mt-2">${m.l}</span>
    </div>`;
  }).join('');

  /* ---- JADWAL TERDEKAT ---- */
  const upcoming = store.projects
    .filter((p) => p.event_date && p.event_date >= today && !['selesai', 'batal'].includes(p.status))
    .slice(0, 5);
  const statusDot = { booking: 'bg-amber-400', dp: 'bg-sky-500', editing: 'bg-violet-500' };
  const jadwalRows = upcoming.map((p) =>
    `<button onclick="openProjectDetail('${p.id}')" class="w-full text-left flex items-start gap-3 py-3 hover:bg-slate-50/80 -mx-1 px-1 rounded-xl transition-colors">
      <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${statusDot[p.status] || 'bg-slate-300'}"></div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-slate-800 truncate">${esc(p.client_name)}</p>
        <p class="text-[11.5px] text-slate-500 truncate">${esc(p.event_type)}${p.location ? ' · ' + esc(p.location) : ''}</p>
      </div>
      <span class="shrink-0 text-[11px] font-bold text-[#C2410C] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-lg">${fmtDate(p.event_date, { day: 'numeric', month: 'short' })}</span>
    </button>`).join('<div class="border-t border-slate-50"></div>') || '<p class="text-xs text-slate-400 py-3">Belum ada jadwal liputan.</p>';

  /* ---- PERTANYAAN MASUK TERBARU ---- */
  const recentInq = store.inquiries.filter((x) => x.status === 'baru').slice(0, 4);
  const inqRows = recentInq.map((x) =>
    `<div class="flex items-start gap-3 py-3">
      <div class="w-8 h-8 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="inbox" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-bold text-slate-800 truncate">${esc(x.name)}</p>
          <span class="w-2 h-2 rounded-full bg-[#C2410C] shrink-0"></span>
        </div>
        <p class="text-[11.5px] text-slate-500 mt-0.5 leading-snug truncate">${esc(x.event_type || 'Jenis acara belum diisi')}${x.event_date ? ' · ' + fmtDate(x.event_date, { day: 'numeric', month: 'short' }) : ''}</p>
        <span class="text-[10.5px] text-slate-400 mt-1 block">${new Date(x.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
      </div>
    </div>`).join('<div class="border-t border-slate-50"></div>') || '<p class="p-5 text-center text-xs text-slate-500">Tidak ada pertanyaan baru.</p>';

  return `<div class="animate-fade-in space-y-5">

    <!-- BARIS 1: 4 KPI Cards -->
    <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      ${kpi('inbox',       'bg-[#C2410C]',   'shadow-[0_6px_14px_rgba(194,65,12,0.28)]',   'Pertanyaan Baru',       newInq,                    'Belum ditindaklanjuti',    'inquiries', '')}
      ${kpi('folder-heart','bg-emerald-500', 'shadow-[0_6px_14px_rgba(16,185,129,0.28)]', 'Proyek Aktif',          active.length,             'Sedang berjalan',           'projects',  '')}
      ${kpi('wallet',      'bg-sky-500',     'shadow-[0_6px_14px_rgba(14,165,233,0.28)]', 'Pemasukan Bulan Ini',   formatRupiah(incomeMonth),  'Total pembayaran masuk',    'projects',  trend(incomeMonth, incomePrev))}
      ${kpi('hourglass',   'bg-amber-500',   'shadow-[0_6px_14px_rgba(245,158,11,0.28)]', 'Sisa Tagihan Klien',    formatRupiah(receivable),   'Belum dibayar klien aktif', 'projects',  '')}
    </section>

    <!-- BARIS 2: 3 Kartu Analitik -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Kartu 1: Status Proyek -->
      <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
        <div>
          <h3 class="text-[15px] font-bold text-slate-900">Status Proyek</h3>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs font-semibold text-slate-600">Total <span class="font-normal text-slate-400">(semua proyek)</span></span>
            <span class="text-[15px] font-extrabold text-slate-900">${store.projects.length}</span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2.5">
            <div class="h-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] rounded-full transition-all duration-500" style="width:${store.projects.length ? Math.round((sl / store.projects.length) * 100) : 0}%"></div>
          </div>
          <div class="mt-5 space-y-3">${statusRows}</div>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100">
          <button onclick="switchTab('projects')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">Lihat semua proyek <span>→</span></button>
        </div>
      </div>

      <!-- Kartu 2: Alur Produksi -->
      <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
        <div>
          <h3 class="text-[15px] font-bold text-slate-900">Alur Produksi</h3>
          <div class="grid grid-cols-4 gap-2.5 mt-4">
            ${stageBox('bg-[#FFF7ED]', 'hover:ring-2 hover:ring-amber-200', 'Booking', bk)}
            ${stageBox('bg-[#EFF6FF]', 'hover:ring-2 hover:ring-sky-200',   'DP',      dp)}
            ${stageBox('bg-[#F5F3FF]', 'hover:ring-2 hover:ring-violet-200','Editing', ed)}
            ${stageBox('bg-[#F0FDF4]', 'hover:ring-2 hover:ring-emerald-200','Selesai',sl)}
          </div>
          <div class="mt-5 flex items-center justify-between gap-4">
            <div>
              <p class="text-[11.5px] font-medium text-slate-400">Total Proyek</p>
              <p class="text-2xl font-extrabold text-slate-900 mt-0.5">${totalAll}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-[11.5px] font-medium text-slate-400">Tingkat Selesai</p>
                <p class="text-xl font-extrabold text-slate-900 mt-0.5">${compRate}%</p>
              </div>
              <svg class="w-12 h-12 -rotate-90 shrink-0" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="5.5"/>
                <circle cx="24" cy="24" r="${r}" fill="none" stroke="#C2410C" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${dashOff}" class="transition-all duration-500"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100">
          <button onclick="switchTab('projects')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">Detail proyek <span>→</span></button>
        </div>
      </div>

      <!-- Kartu 3: Pemasukan 6 Bulan -->
      <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
        <div>
          <h3 class="text-[15px] font-bold text-slate-900">Pemasukan 6 Bulan</h3>
          <div class="mt-2.5">
            <p class="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">${formatRupiah(incomeMonth)}</p>
            <p class="text-[11.5px] text-slate-400 mt-1">Bulan ini</p>
          </div>
          <div class="mt-4 h-[108px] flex items-end justify-between gap-2 pt-4">${bars}</div>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100">
          <button onclick="switchTab('projects')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">Lihat pembayaran <span>→</span></button>
        </div>
      </div>

    </section>

    <!-- BARIS 3: Jadwal + Pertanyaan Masuk -->
    <section class="grid grid-cols-1 xl:grid-cols-12 gap-5">

      <!-- Jadwal Terdekat (7 kolom) -->
      <div class="xl:col-span-7 bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
        <div class="flex items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900">Jadwal Liputan Terdekat</h3>
            <p class="text-xs text-slate-400 mt-0.5">Proyek mendatang yang belum selesai</p>
          </div>
          <button onclick="switchTab('calendar')" class="text-xs font-semibold text-[#C2410C] hover:underline">Kalender →</button>
        </div>
        <div class="divide-y divide-slate-50">${jadwalRows}</div>
      </div>

      <!-- Pertanyaan Masuk Baru (5 kolom) -->
      <div class="xl:col-span-5 bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
        <div class="flex items-center justify-between gap-2 mb-1 border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900">Pertanyaan Baru</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Belum ditindaklanjuti</p>
          </div>
          <button onclick="switchTab('inquiries')" class="text-xs font-semibold text-[#C2410C] hover:underline">Lihat semua →</button>
        </div>
        <div class="max-h-[300px] overflow-y-auto divide-y divide-slate-50">${inqRows}</div>
      </div>

    </section>

  </div>`;
}
