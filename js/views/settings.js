// 6.10 Halaman Pengaturan
function renderSettingsView() {
  return `
    <div class="max-w-3xl bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-6 animate-fade-in">
      <div>
        <h3 class="text-base font-bold text-slate-900">Pengaturan Workspace Studio</h3>
        <p class="text-xs text-slate-400 mt-0.5">Sesuaikan identitas Morevoca dan otomatisasi notifikasi pengantin.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Studio</label>
          <input type="text" value="Morevoca" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Subjudul Workspace</label>
          <input type="text" value="Wedding Workspace" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Admin Studio</label>
          <input type="email" value="hello@morevoca.id" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">Watermark Galeri Proofing</label>
          <input type="text" value="© Morevoca Photography" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium" />
        </div>
      </div>
      <div class="space-y-3 pt-2 border-t border-slate-100">
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <p class="text-xs font-bold text-slate-800">Notifikasi Otomatis WhatsApp Klien</p>
            <p class="text-[11px] text-slate-400">Kirim pengingat H-7 liputan dan link galeri proofing saat selesai edit.</p>
          </div>
          <input type="checkbox" checked class="w-4 h-4 accent-[#C2410C] rounded" />
        </label>
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <p class="text-xs font-bold text-slate-800">Sinkronisasi Backup Cloud RAW</p>
            <p class="text-[11px] text-slate-400">Otomatis arsipkan file RAW setelah 90 hari pengiriman album fisik.</p>
          </div>
          <input type="checkbox" checked class="w-4 h-4 accent-[#C2410C] rounded" />
        </label>
      </div>
      <div class="pt-3 flex justify-end">
        <button onclick="showToast('Pengaturan studio berhasil disimpan!', 'success')" class="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold shadow-sm">
          Simpan Perubahan
        </button>
      </div>
    </div>
  `;
}
