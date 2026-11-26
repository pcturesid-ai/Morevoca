// 6.2 Halaman Tugas & Editing (Checklist Interaktif)
function renderTasksView() {
  return `
    <div class="space-y-5 animate-fade-in">
      <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-bold text-slate-900">Checklist Tugas Editing & Cetak</h3>
          <p class="text-xs text-slate-400 mt-0.5">Centang tugas yang sudah selesai untuk memperbarui statistik KPI secara otomatis.</p>
        </div>
        <button onclick="openModal('newTaskModal')" class="inline-flex items-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i> Tambah Tugas
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div class="divide-y divide-slate-100">
          ${appState.kanbanTasks.map(task => {
            const isDone = task.stage === 'selesai';
            const stageBadge = {
              briefing: 'bg-blue-50 text-blue-600',
              editing: 'bg-amber-50 text-amber-700',
              revisi: 'bg-rose-50 text-rose-600',
              selesai: 'bg-emerald-50 text-emerald-600',
            }[task.stage];
            const stageLabel = { briefing: 'Briefing', editing: 'Shooting & Edit', revisi: 'Revisi Klien', selesai: 'Selesai' }[task.stage];

            return `
              <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div class="flex items-start sm:items-center gap-3.5 min-w-0">
                  <button
                    onclick="toggleTaskComplete('${task.id}')"
                    class="w-5 h-5 mt-0.5 sm:mt-0 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white hover:border-[#C2410C]'
                    }"
                    aria-label="Toggle Selesai"
                  >
                    ${isDone ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
                  </button>
                  <div class="min-w-0">
                    <p class="text-[13px] font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}">${task.title}</p>
                    <p class="text-[11.5px] text-slate-400 mt-0.5">${task.project} • <span class="text-slate-500 font-medium">${task.assignee}</span></p>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <span class="text-[11px] font-semibold px-2.5 py-1 rounded-lg ${stageBadge}">${stageLabel}</span>
                  <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">${task.due}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
