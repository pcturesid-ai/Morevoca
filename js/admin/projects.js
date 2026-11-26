/* Proyek & klien: jadwal, harga, DP, pembayaran, status. */
let PROJ_FILTER = 'aktif';
function renderProjectsView() {
  const f = PROJ_FILTER;
  const list = store.projects.filter((p) => f === 'semua' ? true : f === 'aktif' ? !['selesai', 'batal'].includes(p.status) : p.status === f);
  const chips = [['aktif', 'Aktif'], ['booking', 'Booking'], ['dp', 'DP masuk'], ['editing', 'Editing'], ['selesai', 'Selesai'], ['batal', 'Batal'], ['semua', 'Semua']].map(([v, l]) =>
    `<button onclick="PROJ_FILTER='${v}';renderApp()" class="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border ${f === v ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-white text-slate-600 border-slate-200'}">${l}</button>`).join('');
  return `<div class="animate-fade-in">${pageHead('Proyek & Klien', 'Klien yang sudah booking: jadwal, harga, DP dan pelunasan.', addBtn('Proyek baru', 'openProjectForm()'))}
    <div class="flex gap-2 overflow-x-auto pb-3">${chips}</div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">${list.map((p) => {
      const paid = paidOf(p.id), pct = p.price ? Math.min(100, Math.round(paid / p.price * 100)) : 0, st = PROJ_STATUS[p.status];
      return `<button onclick="openProjectDetail('${p.id}')" class="text-left bg-white rounded-2xl shadow-card border border-slate-100 p-5 hover:shadow-card-hover transition-shadow">
        <div class="flex items-start justify-between gap-2"><div class="min-w-0"><p class="font-bold text-slate-900 truncate">${esc(p.client_name)}</p>
          <p class="text-xs text-slate-500 mt-0.5">${esc(p.event_type)}${p.event_date ? ' · ' + esc(fmtDate(p.event_date)) : ''}</p>${p.location ? `<p class="text-xs text-slate-400 truncate">${esc(p.location)}</p>` : ''}</div>
          <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${st[1]}">${st[0]}</span></div>
        <div class="mt-4"><div class="flex justify-between text-[11px] font-semibold text-slate-500"><span>Terbayar ${formatRupiah(paid)}</span><span>${pct}%</span></div>
          <div class="h-2 rounded-full bg-slate-100 mt-1.5 overflow-hidden"><div class="h-full bg-[#C2410C] rounded-full" style="width:${pct}%"></div></div>
          <p class="text-[11px] text-slate-400 mt-1.5">Total ${formatRupiah(p.price)}${p.price > paid ? ' · sisa ' + formatRupiah(p.price - paid) : ' · lunas'}</p></div></button>`; }).join('') || `<div class="md:col-span-2 xl:col-span-3">${emptyBox('Belum ada proyek di tampilan ini.')}</div>`}</div></div>`;
}

let PF = {};
function openProjectForm(id, inquiryId) {
  const inq = store.inquiries.find((x) => x.id === inquiryId);
  const p = store.projects.find((x) => x.id === id) || {
    client_name: inq?.name || '', whatsapp: inq?.whatsapp || '', event_type: inq?.event_type || 'Pernikahan', event_date: inq?.event_date || '', event_time: '', location: '',
    package_id: inq?.package_id || null, price: 0, dp_percent: 30, status: 'booking', notes: inq?.message || '' };
  const pkg = store.packages.find((x) => x.id === p.package_id);
  if (!id && pkg) { p.price = pkg.price; p.dp_percent = pkg.dp_percent; }
  PF = { event: p.event_type, pkg: p.package_id, status: p.status, inquiryId: inquiryId || p.inquiry_id || null };
  const chip = (cls, on, attrs, label) => `<button type="button" ${attrs} class="${cls} px-3.5 py-2 rounded-full border text-xs font-semibold ${on ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-white text-slate-600 border-slate-200'}">${label}</button>`;
  openSheet(id ? 'Ubah proyek' : 'Proyek baru', `<form onsubmit="saveProject(event,'${id || ''}')" class="space-y-4">
    ${field('Nama klien / pasangan', `<input name="client" required maxlength="100" value="${esc(p.client_name)}" class="${INPUT}" placeholder="Rina & Dimas">`)}
    ${field('WhatsApp', `<input name="wa" inputmode="tel" value="${esc(p.whatsapp || '')}" class="${INPUT}" placeholder="08xxxxxxxxxx">`)}
    <div><span class="text-xs font-bold text-slate-700">Jenis acara</span><div class="flex flex-wrap gap-2 mt-2">${EVENT_TYPES.map((t) => chip('pf-ev', t === p.event_type, `data-v="${t}" onclick="pfPick('ev',this)"`, t)).join('')}</div></div>
    <div class="grid grid-cols-2 gap-3">${field('Tanggal acara', `<input type="date" name="date" value="${p.event_date || ''}" class="${INPUT}">`)}${field('Jam', `<input name="time" maxlength="20" value="${esc(p.event_time || '')}" class="${INPUT}" placeholder="08.00">`)}</div>
    ${field('Lokasi', `<input name="location" maxlength="120" value="${esc(p.location || '')}" class="${INPUT}">`)}
    <div><span class="text-xs font-bold text-slate-700">Paket</span><div class="flex flex-wrap gap-2 mt-2">${store.packages.map((x) => chip('pf-pk', x.id === p.package_id, `data-v="${x.id}" onclick="pfPick('pk',this)"`, esc(x.name))).join('') || '<span class="text-xs text-slate-400">Belum ada paket</span>'}</div></div>
    <div class="grid grid-cols-2 gap-3">${field('Harga (Rp)', `<input name="price" required inputmode="numeric" oninput="rpInput(this);pfDp()" value="${p.price ? Number(p.price).toLocaleString('id-ID') : ''}" class="${INPUT}">`)}${field('DP minimal (%)', `<input name="dp" type="number" min="0" max="100" required oninput="pfDp()" value="${p.dp_percent}" class="${INPUT}">`)}</div>
    <p id="pfDpInfo" class="text-xs font-semibold text-[#C2410C]"></p>
    ${id ? `<div><span class="text-xs font-bold text-slate-700">Status</span><div class="flex flex-wrap gap-2 mt-2">${Object.entries(PROJ_STATUS).map(([k, v]) => chip('pf-st', k === p.status, `data-v="${k}" onclick="pfPick('st',this)"`, v[0])).join('')}</div></div>` : ''}
    ${field('Catatan', `<textarea name="notes" rows="3" class="${INPUT}">${esc(p.notes || '')}</textarea>`)}
    <button class="w-full py-3 rounded-xl ${BTN} text-sm font-bold">Simpan</button></form>`, true);
  pfDp();
}
function pfPick(kind, btn) {
  const cls = { ev: 'pf-ev', pk: 'pf-pk', st: 'pf-st' }[kind];
  const was = btn.classList.contains('bg-[#C2410C]');
  document.querySelectorAll('.' + cls).forEach((b) => (b.className = `${cls} px-3.5 py-2 rounded-full border text-xs font-semibold bg-white text-slate-600 border-slate-200`));
  const on = kind === 'pk' && was ? false : true;
  if (on) btn.className = `${cls} px-3.5 py-2 rounded-full border text-xs font-semibold bg-[#C2410C] text-white border-[#C2410C]`;
  const v = on ? btn.dataset.v : null;
  if (kind === 'ev') PF.event = v; if (kind === 'st') PF.status = v;
  if (kind === 'pk') { PF.pkg = v; const pk = store.packages.find((x) => x.id === v); const f = document.querySelector('#sheet form'); if (pk && f) { f.price.value = Number(pk.price).toLocaleString('id-ID'); f.dp.value = pk.dp_percent; pfDp(); } }
}
function pfDp() { const f = document.querySelector('#sheet form'); const el = document.getElementById('pfDpInfo'); if (!f || !el) return; const price = rpValue(f.price); el.textContent = price ? `DP minimal ${formatRupiah(Math.round(price * Number(f.dp.value || 0) / 100))}` : ''; }
async function saveProject(e, id) {
  e.preventDefault(); const f = e.target;
  const row = { client_name: f.client.value.trim(), whatsapp: f.wa.value.trim() || null, event_type: PF.event || 'Pernikahan', event_date: f.date.value || null, event_time: f.time.value.trim() || null, location: f.location.value.trim() || null, package_id: PF.pkg || null, price: rpValue(f.price), dp_percent: Number(f.dp.value), notes: f.notes.value.trim() || null };
  if (id) row.status = PF.status; else row.inquiry_id = PF.inquiryId;
  const res = id ? await q(db.from('projects').update(row).eq('id', id).select()) : await q(db.from('projects').insert(row).select());
  if (!res) return;
  if (!id && PF.inquiryId) await q(db.from('inquiries').update({ status: 'deal' }).eq('id', PF.inquiryId).select());
  closeSheet(); await Promise.all([reload('projects'), reload('inquiries')]); showToast('Proyek disimpan', 'success');
}

function openProjectDetail(id) {
  const p = store.projects.find((x) => x.id === id); if (!p) return;
  const pays = store.payments.filter((x) => x.project_id === id), paid = pays.reduce((s, x) => s + Number(x.amount), 0), st = PROJ_STATUS[p.status];
  const dpMin = Math.round(p.price * p.dp_percent / 100);
  openSheet(p.client_name, `
    <div class="flex items-center gap-2 flex-wrap"><span class="text-[11px] font-bold px-2.5 py-1 rounded-lg ${st[1]}">${st[0]}</span>
      <span class="text-xs text-slate-500">${esc(p.event_type)}${p.event_date ? ' · ' + esc(fmtDate(p.event_date)) : ''}${p.event_time ? ' · ' + esc(p.event_time) : ''}</span></div>
    ${p.location ? `<p class="text-xs text-slate-500 mt-1">${esc(p.location)}</p>` : ''}${p.packages?.name ? `<p class="text-xs text-slate-500">Paket ${esc(p.packages.name)}</p>` : ''}
    <div class="grid grid-cols-3 gap-2 mt-4 text-center">
      <div class="rounded-xl bg-slate-50 p-3"><p class="text-[10px] text-slate-500 font-semibold">Total</p><p class="text-sm font-extrabold">${formatRupiah(p.price)}</p></div>
      <div class="rounded-xl bg-emerald-50 p-3"><p class="text-[10px] text-emerald-700 font-semibold">Terbayar</p><p class="text-sm font-extrabold text-emerald-700">${formatRupiah(paid)}</p></div>
      <div class="rounded-xl ${p.price > paid ? 'bg-orange-50' : 'bg-emerald-50'} p-3"><p class="text-[10px] text-slate-500 font-semibold">Sisa</p><p class="text-sm font-extrabold">${formatRupiah(Math.max(0, p.price - paid))}</p></div></div>
    <p class="text-[11px] text-slate-500 mt-2">DP minimal ${p.dp_percent}% = ${formatRupiah(dpMin)} ${paid >= dpMin && dpMin > 0 ? '· <span class="text-emerald-600 font-semibold">DP terpenuhi</span>' : ''}</p>
    ${p.notes ? `<p class="text-sm text-slate-600 mt-3 whitespace-pre-line">${esc(p.notes)}</p>` : ''}
    <div class="mt-5"><h4 class="text-sm font-bold">Pembayaran</h4>
      <div class="mt-2 divide-y divide-slate-100">${pays.map((x) => `<div class="py-2 flex items-center justify-between gap-2"><div><p class="text-sm font-semibold">${formatRupiah(x.amount)}</p><p class="text-[11px] text-slate-400">${esc(fmtDate(x.paid_at))}${x.note ? ' · ' + esc(x.note) : ''}</p></div><button onclick="deletePayment('${x.id}','${id}')" class="text-slate-400 hover:text-rose-600 text-lg leading-none" aria-label="Hapus">×</button></div>`).join('') || '<p class="text-xs text-slate-400 py-2">Belum ada pembayaran.</p>'}</div>
      <form onsubmit="addPayment(event,'${id}')" class="mt-3 flex gap-2 items-end"><div class="flex-1 min-w-0"><input name="amount" required inputmode="numeric" oninput="rpInput(this)" placeholder="Nominal (Rp)" class="${INPUT}"></div><div class="w-28 shrink-0"><input name="note" maxlength="40" placeholder="DP / Pelunasan" class="${INPUT}"></div><button class="px-4 py-2.5 rounded-xl ${BTN} text-xs font-bold shrink-0">Catat</button></form></div>
    <div class="mt-5 flex flex-wrap gap-2">
      ${p.whatsapp ? `<a href="${waUrl(p.whatsapp, 'Halo ' + p.client_name)}" target="_blank" rel="noopener" class="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold">WhatsApp</a>` : ''}
      <button onclick="openProjectForm('${id}')" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold">Ubah</button>
      ${p.status === 'dp' ? `<button onclick="setProjectStatus('${id}','editing')" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold">Mulai editing</button>` : ''}
      ${p.status === 'editing' ? `<button onclick="setProjectStatus('${id}','selesai')" class="px-4 py-2.5 rounded-xl ${BTN} text-xs font-semibold">Tandai selesai</button>` : ''}
      <button onclick="deleteProject('${id}')" class="ml-auto px-3 py-2.5 text-xs font-semibold text-rose-600">Hapus</button></div>`, true);
}
async function addPayment(e, id) {
  e.preventDefault(); const f = e.target, amount = rpValue(f.amount); if (!amount) return;
  if (!(await q(db.from('payments').insert({ project_id: id, amount, note: f.note.value.trim() || null }).select()))) return;
  const p = store.projects.find((x) => x.id === id);
  if (p.status === 'booking') await q(db.from('projects').update({ status: 'dp' }).eq('id', id).select());
  await Promise.all([reload('payments'), reload('projects')]); openProjectDetail(id); showToast('Pembayaran dicatat', 'success');
}
async function deletePayment(pid, id) { await q(db.from('payments').delete().eq('id', pid).select()); await reload('payments'); openProjectDetail(id); }
async function setProjectStatus(id, status) { if (await q(db.from('projects').update({ status }).eq('id', id).select())) { await reload('projects'); openProjectDetail(id); } }
function deleteProject(id) { askConfirm('Hapus proyek beserta catatan pembayarannya?', async () => { await q(db.from('projects').delete().eq('id', id).select()); await Promise.all([reload('projects'), reload('payments')]); showToast('Proyek dihapus', 'success'); }); }
