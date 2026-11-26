const TM_STATUS = { pending: ['Menunggu', 'bg-amber-50 text-amber-700'], approved: ['Tampil', 'bg-emerald-50 text-emerald-700'], hidden: ['Disembunyikan', 'bg-slate-100 text-slate-600'] };
function renderTestimonialsAdminView() {
  return `<div class="animate-fade-in">${pageHead('Testimoni', 'Yang dikirim pengunjung perlu disetujui dulu sebelum tampil.', addBtn('Tambah manual', 'openTestimonialForm()'))}
    <div class="grid md:grid-cols-2 gap-4">${store.testimonials.map((t) => {
      const st = TM_STATUS[t.status] || TM_STATUS.pending;
      return `<div class="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
        <div class="flex items-start justify-between gap-2"><div><p class="font-bold text-slate-900">${esc(t.name)}</p><p class="text-xs text-slate-500">${esc(t.event_type || '')}</p></div><span class="text-[11px] font-bold px-2.5 py-1 rounded-lg ${st[1]}">${st[0]}</span></div>
        <p class="text-amber-500 text-sm mt-2">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</p>
        <p class="text-sm text-slate-600 mt-2 whitespace-pre-line">${esc(t.message)}</p>
        <div class="flex flex-wrap gap-2 mt-4">
          ${t.status !== 'approved' ? `<button onclick="setTestimonial('${t.id}','approved')" class="px-3.5 py-2 rounded-xl ${BTN} text-xs font-semibold">Setujui</button>` : ''}
          ${t.status !== 'hidden' ? `<button onclick="setTestimonial('${t.id}','hidden')" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold">Sembunyikan</button>` : ''}
          <button onclick="deleteTestimonial('${t.id}')" class="ml-auto p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50" aria-label="Hapus"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></div>`; }).join('') || `<div class="md:col-span-2">${emptyBox('Belum ada testimoni.')}</div>`}</div></div>`;
}
async function setTestimonial(id, status) { if (await q(db.from('testimonials').update({ status }).eq('id', id).select())) { await reload('testimonials'); showToast('Testimoni diperbarui', 'success'); } }
function deleteTestimonial(id) { askConfirm('Hapus testimoni ini?', async () => { await q(db.from('testimonials').delete().eq('id', id).select()); reload('testimonials'); }); }
let TM_RATING = 5;
function openTestimonialForm() {
  TM_RATING = 5;
  openSheet('Tambah testimoni', `<form onsubmit="saveTestimonial(event)" class="space-y-4">
    <div id="tmStars" class="flex gap-1 text-3xl text-amber-500">${[1, 2, 3, 4, 5].map((n) => `<button type="button" onclick="TM_RATING=${n};document.querySelectorAll('#tmStars button').forEach((b,i)=>b.className=i<${n}?'text-amber-500':'text-slate-300')">★</button>`).join('')}</div>
    ${field('Nama klien', `<input name="name" required maxlength="80" class="${INPUT}">`)}
    ${field('Acara', `<input name="event_type" maxlength="40" class="${INPUT}" placeholder="Pernikahan">`)}
    ${field('Isi testimoni', `<textarea name="message" required minlength="5" maxlength="800" rows="4" class="${INPUT}"></textarea>`)}
    <button class="w-full py-3 rounded-xl ${BTN} text-sm font-bold">Simpan & tampilkan</button></form>`);
}
async function saveTestimonial(e) {
  e.preventDefault(); const f = e.target;
  if (await q(db.from('testimonials').insert({ name: f.name.value.trim(), event_type: f.event_type.value.trim() || null, rating: TM_RATING, message: f.message.value.trim(), status: 'approved' }).select())) { closeSheet(); await reload('testimonials'); showToast('Testimoni ditambahkan', 'success'); }
}
