const INQ_STATUS = [['baru', 'Baru', 'bg-orange-50 text-orange-700'], ['dihubungi', 'Dihubungi', 'bg-sky-50 text-sky-700'], ['deal', 'Deal', 'bg-emerald-50 text-emerald-700'], ['batal', 'Batal', 'bg-slate-100 text-slate-600']];
let INQ_FILTER = 'semua';
function waUrl(num, text) { let n = String(num || '').replace(/\D/g, ''); if (n.startsWith('0')) n = '62' + n.slice(1); return `https://wa.me/${n}?text=${encodeURIComponent(text || '')}`; }
function renderInquiriesView() {
  const list = store.inquiries.filter((x) => INQ_FILTER === 'semua' || x.status === INQ_FILTER);
  const chips = [['semua', 'Semua'], ...INQ_STATUS.map((s) => [s[0], s[1]])].map(([v, l]) => {
    const n = v === 'semua' ? store.inquiries.length : store.inquiries.filter((x) => x.status === v).length;
    return `<button onclick="INQ_FILTER='${v}';renderApp()" class="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border ${INQ_FILTER === v ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-white text-slate-600 border-slate-200'}">${l} (${n})</button>`; }).join('');
  return `<div class="animate-fade-in">${pageHead('Pertanyaan Masuk', 'Calon klien yang mengisi form di website.')}
    <div class="flex gap-2 overflow-x-auto pb-3">${chips}</div>
    <div class="space-y-3">${list.map((x) => {
      const st = INQ_STATUS.find((s) => s[0] === x.status) || INQ_STATUS[0];
      return `<div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4 sm:p-5">
        <div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="font-bold text-slate-900">${esc(x.name)}</p>
          <p class="text-xs text-slate-500 mt-0.5">${esc(x.event_type || 'Jenis acara belum diisi')}${x.event_date ? ' · ' + esc(new Date(x.event_date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })) : ''}${x.packages?.name ? ' · Paket ' + esc(x.packages.name) : ''}</p></div>
          <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${st[2]}">${st[1]}</span></div>
        ${x.message ? `<p class="text-sm text-slate-600 mt-3 whitespace-pre-line">${esc(x.message)}</p>` : ''}
        <p class="text-[11px] text-slate-400 mt-2">${esc(x.whatsapp)} · ${new Date(x.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <a href="${waUrl(x.whatsapp, 'Halo ' + x.name + ', terima kasih sudah menghubungi Morevoca.')}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"><i data-lucide="message-circle" class="w-4 h-4"></i>WhatsApp</a>
          ${INQ_STATUS.filter((s) => s[0] !== x.status).map((s) => `<button onclick="setInquiryStatus('${x.id}','${s[0]}')" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">${s[1]}</button>`).join('')}
          <button onclick="deleteInquiry('${x.id}')" class="ml-auto p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50" aria-label="Hapus"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div></div>`; }).join('') || emptyBox('Belum ada pertanyaan masuk.')}</div></div>`;
}
async function setInquiryStatus(id, status) { if (await q(db.from('inquiries').update({ status }).eq('id', id).select())) { await reload('inquiries'); showToast('Status diubah', 'success'); } }
function deleteInquiry(id) { askConfirm('Hapus pertanyaan ini?', async () => { await q(db.from('inquiries').delete().eq('id', id).select()); reload('inquiries'); }); }
