/**
 * ============================================================
 * 6. RENDER HALAMAN LAINNYA (LENGKAP & INTERAKTIF)
 * ============================================================
 */

// 6.1 Halaman Proyek Wedding
function renderProjectsView() {
  const filters = ['Semua', 'Persiapan', 'Editing', 'Revisi', 'Cetak Album'];
  const filtered = appState.projectFilter === 'Semua'
    ? appState.projects
    : appState.projects.filter(p => p.status === appState.projectFilter);

  return `
    <div class="space-y-5 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl shadow-card border border-slate-100">
        <div class="flex flex-wrap items-center gap-2">
          ${filters.map(f => `
            <button onclick="setProjectFilter('${f}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              appState.projectFilter === f
                ? 'bg-[#C2410C] text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }">${f}</button>
          `).join('')}
        </div>
        <button onclick="openModal('newProjectModal')" class="inline-flex items-center justify-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all">
          <i data-lucide="plus" class="w-4 h-4"></i> + Proyek Baru
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        ${filtered.map(p => `
          <div class="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100 transition-all flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0">
                    <i data-lucide="${p.icon}" class="w-5 h-5"></i>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900 truncate">${p.name}</h3>
                    <p class="text-[11.5px] text-slate-400 truncate">${p.package}</p>
                  </div>
                </div>
                <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FFF0E9] text-[#C2410C]">${p.status}</span>
              </div>

              <div class="mt-4 space-y-2 text-xs text-slate-600">
                <div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i><span class="truncate">${p.venue}</span></div>
                <div class="flex items-center gap-2"><i data-lucide="user-check" class="w-3.5 h-3.5 text-slate-400"></i><span>Lead: <strong>${p.photographer}</strong></span></div>
                <div class="flex items-center gap-2"><i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i><span>${p.dateRange}</span></div>
              </div>

              <div class="mt-4">
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="text-slate-500 font-medium">Progres Produksi</span>
                  <span class="font-bold text-slate-800">${p.progress}%</span>
                </div>
                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full ${p.barColor} rounded-full transition-all" style="width: ${p.progress}%"></div>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700">${formatRupiah(p.value)}</span>
              <button onclick="openProjectDetail('${p.id}')" class="text-xs font-semibold text-[#C2410C] hover:underline">Detail Proyek →</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
