function openProjectDetail(projectId) {
  const p = appState.projects.find(item => item.id === projectId);
  if (!p) return;

  const body = document.getElementById('projectDetailBody');
  body.innerHTML = `
    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl ${p.iconBg} flex items-center justify-center">
          <i data-lucide="${p.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900">${p.name}</h3>
          <p class="text-[11px] text-slate-400">${p.package}</p>
        </div>
      </div>
      <button onclick="closeModal('projectDetailModal')" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>
    <div class="p-6 space-y-4">
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-50">
          <p class="text-[10.5px] text-slate-400">Pasangan Pengantin</p>
          <p class="font-bold text-slate-800 mt-0.5">${p.couple}</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-50">
          <p class="text-[10.5px] text-slate-400">Lead Fotografer</p>
          <p class="font-bold text-slate-800 mt-0.5">${p.photographer}</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-50">
          <p class="text-[10.5px] text-slate-400">Venue / Lokasi</p>
          <p class="font-bold text-slate-800 mt-0.5">${p.venue}</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-50">
          <p class="text-[10.5px] text-slate-400">Nilai Paket</p>
          <p class="font-bold text-[#C2410C] mt-0.5">${formatRupiah(p.value)}</p>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs mb-1.5">
          <span class="font-semibold text-slate-600">Sesuaikan Progres Produksi</span>
          <span id="detailProgressVal" class="font-extrabold text-[#C2410C]">${p.progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value="${p.progress}"
          oninput="updateProjectProgress('${p.id}', this.value)"
          class="w-full accent-[#C2410C] cursor-pointer"
        />
      </div>

      <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
        <button onclick="closeModal('projectDetailModal')" class="px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-semibold hover:bg-[#9A3412]">
          Selesai
        </button>
      </div>
    </div>
  `;
  openModal('projectDetailModal');
}

function updateProjectProgress(projectId, val) {
  const p = appState.projects.find(item => item.id === projectId);
  if (!p) return;
  p.progress = parseInt(val, 10);
  p.timeline.actualWidthPct = Math.max(8, Math.round((p.progress / 100) * p.timeline.planWidthPct));
  const label = document.getElementById('detailProgressVal');
  if (label) label.textContent = p.progress + '%';
  renderApp();
}
