// 6.9 Halaman Kontrak & Album
function renderDocumentsView() {
  return `
    <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-fade-in">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900">Status Kontrak Digital & Produksi Album Fisik</h3>
          <p class="text-xs text-slate-400 mt-0.5">Pantau tanda tangan kontrak, proofing klien, hingga cetak box kayu.</p>
        </div>
      </div>
      <div class="divide-y divide-slate-100">
        ${appState.documents.map(doc => `
          <div class="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-[#FFF0E9] text-[#C2410C] flex items-center justify-center shrink-0">
                <i data-lucide="file-text" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800">${doc.title}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Klien: ${doc.couple} • ${doc.type} • Update ${doc.updated}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-center">
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">Album: ${doc.albumStatus}</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-lg ${doc.status === 'Menunggu TTD' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-600'}">${doc.status}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
