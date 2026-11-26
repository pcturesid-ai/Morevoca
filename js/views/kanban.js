// 6.3 Halaman Papan Kanban (4 Kolom Interaktif)
function renderKanbanView() {
  const columns = [
    { key: 'briefing', label: 'Briefing', bg: 'bg-[#EFF6FF]', dot: 'bg-blue-500', countOffset: appState.kanbanOffsets.briefing },
    { key: 'editing', label: 'Shooting & Edit', bg: 'bg-[#FEFCE8]', dot: 'bg-amber-400', countOffset: appState.kanbanOffsets.editing },
    { key: 'revisi', label: 'Revisi Klien', bg: 'bg-[#FEF2F2]', dot: 'bg-rose-500', countOffset: appState.kanbanOffsets.revisi },
    { key: 'selesai', label: 'Selesai', bg: 'bg-[#F0FDF4]', dot: 'bg-emerald-500', countOffset: appState.kanbanOffsets.selesai },
  ];
  const stageKeys = ['briefing', 'editing', 'revisi', 'selesai'];

  return `
    <div class="space-y-5 animate-fade-in">
      <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-bold text-slate-900">Papan Kanban Produksi Wedding</h3>
          <p class="text-xs text-slate-400 mt-0.5">Pindahkan kartu antar tahap dengan tombol panah atau dropdown — Ringkasan Kanban di Dashboard otomatis terbarui.</p>
        </div>
        <button onclick="openModal('newTaskModal')" class="inline-flex items-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i> Kartu Baru
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        ${columns.map((col, colIdx) => {
          const cards = appState.kanbanTasks.filter(t => t.stage === col.key);
          return `
            <div class="bg-white rounded-2xl p-4 shadow-card border border-slate-100 space-y-3">
              <div class="flex items-center justify-between px-2.5 py-2 rounded-xl ${col.bg}">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full ${col.dot}"></span>
                  <h4 class="text-xs font-bold text-slate-800">${col.label}</h4>
                </div>
                <span class="text-xs font-extrabold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md">${col.countOffset + cards.length}</span>
              </div>

              <div class="space-y-3">
                ${cards.length === 0 ? `
                  <div class="border border-dashed border-slate-200 rounded-xl p-5 text-center text-xs text-slate-400">
                    Belum ada kartu aktif di tahap ini
                  </div>
                ` : cards.map(card => `
                  <div class="p-3.5 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-600">${card.tag}</span>
                      <span class="text-[10.5px] font-semibold ${card.priority === 'Tinggi' ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-100'} px-2 py-0.5 rounded-md">${card.priority}</span>
                    </div>
                    <p class="text-[12.5px] font-bold text-slate-800 leading-snug">${card.title}</p>
                    <p class="text-[11px] text-slate-400 mt-1 truncate">${card.project}</p>

                    <div class="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full ${card.avatarColor} text-[10px] font-bold flex items-center justify-center">${card.initials}</span>
                        <span class="text-[11px] text-slate-500 font-medium">${card.due}</span>
                      </div>
                      <!-- Kontrol Geser Tahap -->
                      <div class="flex items-center gap-1">
                        <button
                          onclick="moveKanbanCard('${card.id}', '${stageKeys[colIdx - 1] || ''}')"
                          ${colIdx === 0 ? 'disabled' : ''}
                          class="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#C2410C] hover:border-[#C2410C] disabled:opacity-30 disabled:pointer-events-none"
                          title="Geser Kiri"
                        >
                          <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
                        </button>
                        <button
                          onclick="moveKanbanCard('${card.id}', '${stageKeys[colIdx + 1] || ''}')"
                          ${colIdx === stageKeys.length - 1 ? 'disabled' : ''}
                          class="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#C2410C] hover:border-[#C2410C] disabled:opacity-30 disabled:pointer-events-none"
                          title="Geser Kanan"
                        >
                          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
