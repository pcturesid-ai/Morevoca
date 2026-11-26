/* Panel geser dari bawah (pengganti pop-up bawaan browser) + konfirmasi + input rupiah. */
function openSheet(title, html, wide = false) {
  let s = document.getElementById('sheet');
  if (!s) { s = document.createElement('div'); s.id = 'sheet'; document.body.appendChild(s); }
  s.className = 'fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/50';
  s.onclick = (e) => { if (e.target === s) closeSheet(); };
  s.innerHTML = `<div class="bg-white w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 animate-fade-in">
    <div class="flex items-center justify-between mb-4"><h3 class="text-base font-bold text-slate-900">${esc(title)}</h3><button onclick="closeSheet()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-lg leading-none" aria-label="Tutup">×</button></div>
    <div id="sheetBody">${html}</div></div>`;
  lucide.createIcons();
}
function closeSheet() { const s = document.getElementById('sheet'); if (s) s.remove(); }
function askConfirm(message, onYes, yesLabel = 'Hapus') {
  openSheet('Konfirmasi', `<p class="text-sm text-slate-600">${esc(message)}</p>
    <div class="flex gap-3 mt-5"><button onclick="closeSheet()" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">Batal</button>
    <button id="confirmYes" class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold">${esc(yesLabel)}</button></div>`);
  document.getElementById('confirmYes').onclick = () => { closeSheet(); onYes(); };
}
function rpInput(el) { const d = el.value.replace(/\D/g, ''); el.value = d ? Number(d).toLocaleString('id-ID') : ''; }
function rpValue(el) { return Number(String(el.value).replace(/\D/g, '')) || 0; }
const field = (label, inner) => `<label class="block"><span class="text-xs font-bold text-slate-700">${label}</span><div class="mt-1.5">${inner}</div></label>`;
const emptyBox = (t) => `<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">${t}</div>`;
const pageHead = (title, sub, btn) => `<div class="flex items-start justify-between gap-3 mb-5"><div><h3 class="text-lg font-bold text-slate-900">${title}</h3><p class="text-xs text-slate-500 mt-0.5">${sub}</p></div>${btn || ''}</div>`;
const addBtn = (label, fn) => `<button onclick="${fn}" class="shrink-0 inline-flex items-center gap-1.5 ${BTN} text-xs font-semibold px-4 py-2.5 rounded-xl"><i data-lucide="plus" class="w-4 h-4"></i>${label}</button>`;
