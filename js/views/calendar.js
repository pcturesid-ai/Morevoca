// 6.4 Halaman Jadwal Liputan (Kalender Bulanan Visual)
function renderCalendarView() {
  const monthNames = ['November 2026', 'Desember 2026', 'Januari 2027'];
  const currentMonthLabel = monthNames[appState.calendarMonthOffset] || 'November 2026';
  const daysInMonth = appState.calendarMonthOffset === 1 ? 31 : 30;
  const startDayOffset = appState.calendarMonthOffset === 0 ? 6 : 1; // Nov 1 2026 = Minggu (offset 6 dr Senin)
  const dayHeaders = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const selectedEvents = appState.calendarEvents.filter(e => e.day === appState.selectedCalendarDay);

  let cellsHtml = '';
  for (let i = 0; i < startDayOffset; i++) {
    cellsHtml += `<div class="min-h-[82px] sm:min-h-[96px] bg-slate-50/40 rounded-xl border border-slate-100/60"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const eventsOnDay = appState.calendarMonthOffset === 0 ? appState.calendarEvents.filter(e => e.day === d) : [];
    const isToday = appState.calendarMonthOffset === 0 && d === 25;
    const isSelected = appState.selectedCalendarDay === d;

    cellsHtml += `
      <div
        onclick="selectCalendarDay(${d})"
        class="cursor-pointer min-h-[82px] sm:min-h-[96px] p-2 rounded-xl border transition-all flex flex-col ${
          isSelected
            ? 'bg-[#FFF0E9]/60 border-[#C2410C] ring-2 ring-[#C2410C]/15'
            : 'bg-white border-slate-100 hover:border-orange-200'
        }"
      >
        <div class="flex items-center justify-between">
          <span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
            isToday ? 'bg-[#C2410C] text-white' : 'text-slate-700'
          }">${d}</span>
          ${eventsOnDay.length ? `<span class="w-1.5 h-1.5 rounded-full bg-[#C2410C]"></span>` : ''}
        </div>
        <div class="mt-1.5 space-y-1 overflow-hidden">
          ${eventsOnDay.map(ev => `
            <div class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border truncate ${ev.color}">
              ${ev.title}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-fade-in">
      <!-- Kalender Utama -->
      <div class="xl:col-span-8 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900">${currentMonthLabel}</h3>
            <p class="text-xs text-slate-400">Klik tanggal untuk melihat detail jadwal liputan akad, resepsi & prewedding</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="changeCalendarMonth(-1)" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
            <button onclick="changeCalendarMonth(1)" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 mb-2 text-center">
          ${dayHeaders.map(dh => `<div class="text-[11px] font-bold text-slate-400 py-1">${dh}</div>`).join('')}
        </div>
        <div class="grid grid-cols-7 gap-2">
          ${cellsHtml}
        </div>
      </div>

      <!-- Panel Detail Tanggal & Agenda -->
      <div class="xl:col-span-4 space-y-5">
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h4 class="text-sm font-bold text-slate-900">Agenda Tanggal ${appState.selectedCalendarDay} ${currentMonthLabel}</h4>
          <div class="mt-3 space-y-3">
            ${selectedEvents.length === 0 ? `
              <div class="p-4 rounded-xl bg-slate-50 text-center">
                <p class="text-xs text-slate-500">Tidak ada jadwal liputan di tanggal ini.</p>
                <button onclick="openModal('newProjectModal')" class="mt-2 text-xs font-semibold text-[#C2410C] hover:underline">+ Booking Jadwal Baru</button>
              </div>
            ` : selectedEvents.map(ev => `
              <div class="p-3.5 rounded-xl border ${ev.color}">
                <span class="text-[10px] font-bold uppercase tracking-wider">${ev.type}</span>
                <p class="text-xs font-bold mt-1">${ev.title}</p>
                <p class="text-[11px] mt-1 opacity-80">📍 ${ev.venue} • 🕒 ${ev.time}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 mb-3">Jadwal Liputan Bulan Ini</h4>
          <div class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            ${appState.calendarEvents.map(ev => `
              <div onclick="selectCalendarDay(${ev.day})" class="cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div class="w-10 h-10 rounded-xl bg-[#FFF0E9] text-[#C2410C] flex flex-col items-center justify-center shrink-0">
                  <span class="text-xs font-extrabold leading-none">${ev.day}</span>
                  <span class="text-[9px] font-semibold">Nov</span>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">${ev.title}</p>
                  <p class="text-[11px] text-slate-400 truncate">${ev.venue}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
