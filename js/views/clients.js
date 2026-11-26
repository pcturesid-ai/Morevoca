// 6.8 Halaman Klien Pengantin
function renderClientsView() {
  return `
    <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-fade-in">
      <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-bold text-slate-900">Database Pasangan Pengantin</h3>
          <p class="text-xs text-slate-400 mt-0.5">Kelola kontak klien, status pembayaran DP, dan paket wedding.</p>
        </div>
        <button onclick="openModal('newProjectModal')" class="inline-flex items-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold px-4 py-2 rounded-xl">
          <i data-lucide="user-plus" class="w-4 h-4"></i> Klien Baru
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr class="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <th class="px-5 py-3.5">Pasangan Pengantin</th>
              <th class="px-5 py-3.5">Paket & Venue</th>
              <th class="px-5 py-3.5">Tanggal Acara</th>
              <th class="px-5 py-3.5">Nilai Kontrak</th>
              <th class="px-5 py-3.5">Status Bayar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            ${appState.clients.map(c => `
              <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="px-5 py-4">
                  <p class="font-bold text-slate-800">${c.couple}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">${c.phone} • ${c.email}</p>
                </td>
                <td class="px-5 py-4">
                  <p class="font-semibold text-slate-700">${c.package}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">${c.venue}</p>
                </td>
                <td class="px-5 py-4 font-medium text-slate-600">${c.date}</td>
                <td class="px-5 py-4 font-bold text-slate-800">${c.total}</td>
                <td class="px-5 py-4">
                  <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${c.payment === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}">
                    ${c.payment}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
