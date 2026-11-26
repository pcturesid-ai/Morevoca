function renderPackagesAdminView() {
  return `<div class="animate-fade-in">${pageHead('Paket & Harga', 'Tampil di website. DP diatur per paket.', addBtn('Tambah paket', 'openPackageForm()'))}
    <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">${store.packages.map((p) => `
      <div class="bg-white rounded-2xl shadow-card border ${p.is_popular ? 'border-[#C2410C]' : 'border-slate-100'} p-5 flex flex-col">
        <div class="flex items-start justify-between gap-2"><h4 class="font-bold text-slate-900">${esc(p.name)}</h4>
          <div class="flex gap-1.5">${p.is_popular ? '<span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-orange-50 text-orange-700">Populer</span>' : ''}${p.is_active ? '' : '<span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-500">Disembunyikan</span>'}</div></div>
        <p class="text-2xl font-extrabold text-slate-900 mt-2">${formatRupiah(p.price)}</p>
        <p class="text-xs text-slate-500 mt-0.5">DP ${p.dp_percent}% = ${formatRupiah(Math.round(p.price * p.dp_percent / 100))}</p>
        <ul class="text-xs text-slate-600 mt-3 space-y-1 flex-1">${(p.features || []).map((f) => `<li>• ${esc(f)}</li>`).join('')}</ul>
        <div class="flex gap-2 mt-4"><button onclick="openPackageForm('${p.id}')" class="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50">Ubah</button>
          <button onclick="deletePackage('${p.id}')" class="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50" aria-label="Hapus"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>
      </div>`).join('') || `<div class="sm:col-span-2 xl:col-span-3">${emptyBox('Belum ada paket. Tambahkan paket pertama.')}</div>`}</div></div>`;
}
function openPackageForm(id) {
  const p = store.packages.find((x) => x.id === id) || { name: '', price: 0, dp_percent: 30, description: '', features: [], is_popular: false, is_active: true, sort: store.packages.length };
  openSheet(id ? 'Ubah paket' : 'Paket baru', `<form onsubmit="savePackage(event,'${id || ''}')" class="space-y-4">
    ${field('Nama paket', `<input name="name" required maxlength="60" value="${esc(p.name)}" class="${INPUT}" placeholder="Contoh: Silver">`)}
    <div class="grid grid-cols-2 gap-3">${field('Harga (Rp)', `<input name="price" required inputmode="numeric" oninput="rpInput(this)" value="${p.price ? Number(p.price).toLocaleString('id-ID') : ''}" class="${INPUT}" placeholder="3.000.000">`)}
    ${field('DP minimal (%)', `<input name="dp" type="number" min="0" max="100" required value="${p.dp_percent}" class="${INPUT}">`)}</div>
    ${field('Deskripsi singkat', `<input name="description" maxlength="140" value="${esc(p.description || '')}" class="${INPUT}">`)}
    ${field('Isi paket (satu baris satu poin)', `<textarea name="features" rows="5" class="${INPUT}" placeholder="2 fotografer&#10;Album 30 lembar">${esc((p.features || []).join('\n'))}</textarea>`)}
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="popular" ${p.is_popular ? 'checked' : ''} class="accent-[#C2410C] w-4 h-4"> Tandai "Paling dipilih"</label>
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="active" ${p.is_active ? 'checked' : ''} class="accent-[#C2410C] w-4 h-4"> Tampilkan di website</label>
    <button class="w-full py-3 rounded-xl ${BTN} text-sm font-bold">Simpan</button></form>`);
}
async function savePackage(e, id) {
  e.preventDefault(); const f = e.target;
  const row = { name: f.name.value.trim(), price: rpValue(f.price), dp_percent: Number(f.dp.value), description: f.description.value.trim() || null, features: f.features.value.split('\n').map((s) => s.trim()).filter(Boolean), is_popular: f.popular.checked, is_active: f.active.checked };
  const res = id ? await q(db.from('packages').update(row).eq('id', id).select()) : await q(db.from('packages').insert({ ...row, sort: store.packages.length }).select());
  if (res) { closeSheet(); await reload('packages'); showToast('Paket disimpan', 'success'); }
}
function deletePackage(id) { askConfirm('Hapus paket ini?', async () => { await q(db.from('packages').delete().eq('id', id).select()); reload('packages'); }); }
