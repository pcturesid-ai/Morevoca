// 6.5 Halaman Log Jam Kerja
function renderTimeLogView() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
      <div class="lg:col-span-5 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <h3 class="text-[15px] font-bold text-slate-900">Catat Jam Liputan / Editing</h3>
        <p class="text-xs text-slate-400 mt-0.5 mb-4">Rekam durasi kerja kru untuk evaluasi kapasitas studio.</p>
        <form onsubmit="handleAddTimeLog(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Proyek Wedding</label>
            <select id="tlProject" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white">
              ${appState.projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Aktivitas</label>
            <input required id="tlActivity" type="text" placeholder="Contoh: Retouching 100 Foto Akad" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#C2410C]" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Anggota Tim</label>
              <select id="tlMember" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white">
                ${appState.team.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Durasi (Jam)</label>
              <input required id="tlDuration" type="number" step="0.5" min="0.5" max="16" value="2.5" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#C2410C]" />
            </div>
          </div>
          <button type="submit" class="w-full py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold shadow-sm transition-all">
            Simpan Log Waktu
          </button>
        </form>
      </div>

      <div class="lg:col-span-7 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <h3 class="text-[15px] font-bold text-slate-900 mb-4">Riwayat Log Jam Kerja Terbaru</h3>
        <div class="space-y-3">
          ${appState.timeLogsHistory.map(log => `
            <div class="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800">${log.activity}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">${log.project} • <span class="text-slate-600 font-medium">${log.member}</span></p>
              </div>
              <div class="text-right shrink-0">
                <span class="inline-block text-xs font-extrabold text-[#C2410C] bg-[#FFF0E9] px-2.5 py-1 rounded-lg">${log.duration}</span>
                <p class="text-[10px] text-slate-400 mt-1">${log.date}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
