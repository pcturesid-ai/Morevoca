// 6.6 Halaman Laporan
function renderReportsView() {
  const totalRevenue = appState.projects.reduce((sum, p) => sum + p.value, 0);
  const monthlyBars = [
    { m: 'Jun', val: 88, label: 'Rp 88jt' },
    { m: 'Jul', val: 112, label: 'Rp 112jt' },
    { m: 'Agu', val: 145, label: 'Rp 145jt' },
    { m: 'Sep', val: 128, label: 'Rp 128jt' },
    { m: 'Okt', val: 164, label: 'Rp 164jt' },
    { m: 'Nov', val: 192, label: 'Rp 192jt', active: true },
  ];

  return `
    <div class="space-y-5 animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <p class="text-xs font-medium text-slate-400">Estimasi Omzet Proyek Aktif</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">${formatRupiah(totalRevenue)}</p>
          <span class="inline-block mt-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">↑ 22% vs bulan lalu</span>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <p class="text-xs font-medium text-slate-400">Rata-rata Nilai Paket Wedding</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">${formatRupiah(Math.round(totalRevenue / appState.projects.length))}</p>
          <span class="inline-block mt-2 text-[11px] font-bold text-[#C2410C] bg-[#FFF0E9] px-2 py-0.5 rounded-md">Paket Platinum Terlaris</span>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <p class="text-xs font-medium text-slate-400">Kepuasan Klien (Rating)</p>
          <p class="text-2xl font-extrabold text-slate-900 mt-1">4.9 / 5.0</p>
          <span class="inline-block mt-2 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Dari 84 ulasan pengantin</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h3 class="text-[15px] font-bold text-slate-900 mb-5">Pertumbuhan Omzet 6 Bulan Terakhir</h3>
          <div class="h-[200px] flex items-end justify-between gap-4 pt-6">
            ${monthlyBars.map(b => `
              <div class="flex-1 flex flex-col items-center h-full justify-end group">
                <span class="text-[11px] font-bold ${b.active ? 'text-[#C2410C]' : 'text-slate-400'} mb-1.5">${b.label}</span>
                <div class="w-full max-w-[44px] rounded-t-xl transition-all ${b.active ? 'bg-gradient-to-t from-[#C2410C] to-[#EA580C] shadow-soft' : 'bg-slate-200 group-hover:bg-orange-200'}" style="height: ${Math.round((b.val / 200) * 100)}%"></div>
                <span class="text-xs font-semibold text-slate-500 mt-2">${b.m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h3 class="text-[15px] font-bold text-slate-900 mb-4">Distribusi Paket Wedding</h3>
          <div class="space-y-4">
            ${[
              { name: 'Platinum Akad & Resepsi', pct: 42, color: 'bg-[#C2410C]' },
              { name: 'Gold Resepsi + Cinema', pct: 28, color: 'bg-purple-500' },
              { name: 'Intimate Wedding', pct: 18, color: 'bg-emerald-500' },
              { name: 'Prewedding Destination', pct: 12, color: 'bg-amber-400' },
            ].map(pkg => `
              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="font-semibold text-slate-700">${pkg.name}</span>
                  <span class="font-bold text-slate-900">${pkg.pct}%</span>
                </div>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full ${pkg.color} rounded-full" style="width: ${pkg.pct}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
