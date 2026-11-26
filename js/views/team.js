// 6.7 Halaman Tim Fotografer
function renderTeamView() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
      ${appState.team.map(m => `
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl ${m.avatarBg} font-bold text-sm flex items-center justify-center shadow-sm">${m.initials}</div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">${m.name}</h3>
                  <p class="text-xs text-slate-400">${m.role}</p>
                </div>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg ${m.badgeClass}">${m.workload}%</span>
            </div>

            <div class="mt-4 space-y-2 text-xs text-slate-600">
              <div class="flex items-center gap-2"><i data-lucide="camera" class="w-3.5 h-3.5 text-slate-400"></i><span>${m.gear}</span></div>
              <div class="flex items-center gap-2"><i data-lucide="briefcase" class="w-3.5 h-3.5 text-slate-400"></i><span>${m.activeShoots} Proyek Aktif Bulan Ini</span></div>
              <div class="flex items-center gap-2"><i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i><span>${m.phone}</span></div>
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400 font-medium">Beban Kapasitas</span>
                <span class="font-bold text-slate-700">${m.workload}%</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full ${m.barClass} rounded-full" style="width: ${m.workload}%"></div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <button onclick="showToast('Jadwal tugas ${m.name} disalin ke clipboard.', 'info')" class="text-xs font-semibold text-slate-500 hover:text-slate-800">Salin Kontak</button>
            <button onclick="switchTab('calendar')" class="text-xs font-semibold text-[#C2410C] hover:underline">Lihat Jadwal →</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
