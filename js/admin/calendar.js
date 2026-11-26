/* Jadwal liputan: kalender bulanan dari proyek. */
const CAL = { y: new Date().getFullYear(), m: new Date().getMonth(), sel: todayStr() };
function calMove(d) { CAL.m += d; if (CAL.m < 0) { CAL.m = 11; CAL.y--; } if (CAL.m > 11) { CAL.m = 0; CAL.y++; } renderApp(); }
function calSel(d) { CAL.sel = d; renderApp(); }
function renderCalendarView() {
  const first = new Date(CAL.y, CAL.m, 1), days = new Date(CAL.y, CAL.m + 1, 0).getDate(), offset = (first.getDay() + 6) % 7;
  const by = {}; store.projects.filter((p) => p.event_date && p.status !== 'batal').forEach((p) => (by[p.event_date] = (by[p.event_date] || []).concat(p)));
  const today = todayStr(); let cells = '';
  for (let i = 0; i < offset; i++) cells += '<div></div>';
  for (let d = 1; d <= days; d++) {
    const key = `${CAL.y}-${String(CAL.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, n = (by[key] || []).length, sel = key === CAL.sel;
    cells += `<button onclick="calSel('${key}')" class="aspect-square sm:aspect-[4/3] rounded-xl flex flex-col items-center justify-center text-sm font-semibold border ${sel ? 'bg-[#C2410C] text-white border-[#C2410C]' : key === today ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent hover:bg-slate-50 text-slate-700'}">${d}${n ? `<span class="mt-0.5 text-[9px] font-bold ${sel ? 'text-white' : 'text-[#C2410C]'}">${n} acara</span>` : ''}</button>`;
  }
  const dayList = by[CAL.sel] || [];
  return `<div class="animate-fade-in grid lg:grid-cols-[1fr_340px] gap-5">
    <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4 sm:p-5">
      <div class="flex items-center justify-between mb-4"><button onclick="calMove(-1)" class="w-9 h-9 rounded-xl border border-slate-200" aria-label="Bulan lalu">‹</button>
        <h3 class="font-bold text-slate-900">${first.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3><button onclick="calMove(1)" class="w-9 h-9 rounded-xl border border-slate-200" aria-label="Bulan depan">›</button></div>
      <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((x) => `<div>${x}</div>`).join('')}</div>
      <div class="grid grid-cols-7 gap-1">${cells}</div></div>
    <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-5"><h4 class="font-bold text-slate-900 text-sm">${esc(fmtDate(CAL.sel, { weekday: 'long', day: 'numeric', month: 'long' }))}</h4>
      <div class="mt-3 space-y-2">${dayList.map((p) => `<button onclick="openProjectDetail('${p.id}')" class="w-full text-left rounded-xl bg-orange-50/60 hover:bg-orange-50 p-3"><p class="text-sm font-bold">${esc(p.client_name)}</p><p class="text-[11px] text-slate-500">${esc(p.event_type)}${p.event_time ? ' · ' + esc(p.event_time) : ''}${p.location ? ' · ' + esc(p.location) : ''}</p></button>`).join('') || '<p class="text-xs text-slate-400">Tidak ada liputan di hari ini.</p>'}</div>
      <button onclick="openProjectForm()" class="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold">+ Tambah proyek</button></div></div>`;
}
