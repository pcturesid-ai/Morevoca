/**
 * ============================================================
 * 5. RENDER HALAMAN UTAMA: DASHBOARD (EXACT 4-ROW LAYOUT)
 * ============================================================
 */
function renderDashboardView() {
  const stats = getComputedStats();
  const timeData = appState.timeTracking[appState.timePeriod];
  const maxHours = Math.max(...timeData.days.map(d => d.hours), 6.5);

  // Donut SVG calculation (r=20, circumference ~ 125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (stats.kanban.completionRate / 100) * circumference;

  // Filter timeline proyek
  const timelineProjects = appState.timelineFilter === 'thisMonth'
    ? appState.projects.slice(0, 4)
    : appState.projects.slice(-4);

  return `
    <div class="space-y-5 animate-fade-in">

      <!-- ===================================================
           BARIS 1: 4 KARTU KPI (Grid 4 Kolom)
      ==================================================== -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- KPI 1: Proyek Aktif -->
        <div onclick="switchTab('projects')" class="cursor-pointer bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100/80 transition-all flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#C2410C] text-white flex items-center justify-center shrink-0 shadow-[0_6px_14px_rgba(194,65,12,0.28)]">
            <i data-lucide="briefcase" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[12.5px] font-medium text-slate-500">Proyek Aktif</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${stats.activeProjectsCount}</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600">↑ 12%</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">vs bulan lalu</p>
          </div>
        </div>

        <!-- KPI 2: Editing & Album Selesai -->
        <div onclick="switchTab('tasks')" class="cursor-pointer bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100/80 transition-all flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_6px_14px_rgba(16,185,129,0.28)]">
            <i data-lucide="check-circle-2" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[12.5px] font-medium text-slate-500">Editing & Album Selesai</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${stats.completedKPI}</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600">↑ 18%</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">vs bulan lalu</p>
          </div>
        </div>

        <!-- KPI 3: Antrean Editing -->
        <div onclick="switchTab('kanban')" class="cursor-pointer bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100/80 transition-all flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-[0_6px_14px_rgba(245,158,11,0.28)]">
            <i data-lucide="layers" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[12.5px] font-medium text-slate-500">Antrean Editing</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${stats.pendingKPI}</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-500">↑ 8%</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">vs bulan lalu</p>
          </div>
        </div>

        <!-- KPI 4: Beban Kerja Tim -->
        <div onclick="switchTab('team')" class="cursor-pointer bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100/80 transition-all flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-[0_6px_14px_rgba(139,92,246,0.28)]">
            <i data-lucide="users" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <p class="text-[12.5px] font-medium text-slate-500">Beban Kerja Tim</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${stats.avgWorkload}%</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">Rata-rata kapasitas</p>
          </div>
        </div>
      </section>

      <!-- ===================================================
           BARIS 2: 3 KARTU ANALITIK (Grid 3 Kolom)
      ==================================================== -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- Kartu 1: Progres Musim Nikah (Sprint Progress) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900">Progres Musim Nikah</h3>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs font-semibold text-slate-600">Periode Nov <span class="font-normal text-slate-400">(1 Nov – 30 Nov)</span></span>
              <span class="text-[15px] font-extrabold text-slate-900">68%</span>
            </div>

            <!-- Progress Bar Horizontal Royal Blue -->
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2.5">
              <div class="h-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] rounded-full transition-all duration-500" style="width: 68%"></div>
            </div>

            <!-- Rincian dengan Titik Warna -->
            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span class="text-slate-600 font-medium">Selesai Kirim & Cetak</span>
                </div>
                <span class="font-bold text-slate-800">34</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0"></span>
                  <span class="text-slate-600 font-medium">Sedang Editing & Grading</span>
                </div>
                <span class="font-bold text-slate-800">18</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span class="text-slate-600 font-medium">Menunggu Hari-H</span>
                </div>
                <span class="font-bold text-slate-800">10</span>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('projects')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Detail Progres <span>→</span>
            </button>
          </div>
        </div>

        <!-- Kartu 2: Ringkasan Alur Produksi (Kanban Summary) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900">Ringkasan Alur Produksi</h3>

            <!-- 4 Kotak Statistik Pastel Berjejer -->
            <div class="grid grid-cols-4 gap-2.5 mt-4">
              <div onclick="switchTab('kanban')" class="cursor-pointer bg-[#EFF6FF] hover:ring-2 hover:ring-blue-200 transition-all rounded-xl p-2.5 text-center">
                <p class="text-[11px] font-medium text-slate-500 truncate">Briefing</p>
                <p class="text-xl font-extrabold text-slate-900 mt-1">${stats.kanban.briefing}</p>
              </div>
              <div onclick="switchTab('kanban')" class="cursor-pointer bg-[#FEFCE8] hover:ring-2 hover:ring-amber-200 transition-all rounded-xl p-2.5 text-center">
                <p class="text-[11px] font-medium text-slate-500 truncate">Editing</p>
                <p class="text-xl font-extrabold text-slate-900 mt-1">${stats.kanban.editing}</p>
              </div>
              <div onclick="switchTab('kanban')" class="cursor-pointer bg-[#FEF2F2] hover:ring-2 hover:ring-rose-200 transition-all rounded-xl p-2.5 text-center">
                <p class="text-[11px] font-medium text-slate-500 truncate">Revisi</p>
                <p class="text-xl font-extrabold text-slate-900 mt-1">${stats.kanban.revisi}</p>
              </div>
              <div onclick="switchTab('kanban')" class="cursor-pointer bg-[#F0FDF4] hover:ring-2 hover:ring-emerald-200 transition-all rounded-xl p-2.5 text-center">
                <p class="text-[11px] font-medium text-slate-500 truncate">Selesai</p>
                <p class="text-xl font-extrabold text-slate-900 mt-1">${stats.kanban.selesai}</p>
              </div>
            </div>

            <!-- Total Tugas + Donut SVG Tingkat Selesai -->
            <div class="mt-5 flex items-center justify-between gap-4">
              <div>
                <p class="text-[11.5px] font-medium text-slate-400">Total Tugas</p>
                <p class="text-2xl font-extrabold text-slate-900 mt-0.5">${stats.kanban.total}</p>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-[11.5px] font-medium text-slate-400">Tingkat Selesai</p>
                  <p class="text-xl font-extrabold text-slate-900 mt-0.5">${stats.kanban.completionRate}%</p>
                </div>
                <!-- Grafik Donat/Ring SVG -->
                <svg class="w-12 h-12 -rotate-90 shrink-0" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="${radius}" fill="none" stroke="#E2E8F0" stroke-width="5.5" />
                  <circle
                    cx="24"
                    cy="24"
                    r="${radius}"
                    fill="none"
                    stroke="#C2410C"
                    stroke-width="5.5"
                    stroke-linecap="round"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${dashOffset}"
                    class="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('kanban')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Papan Kanban <span>→</span>
            </button>
          </div>
        </div>

        <!-- Kartu 3: Log Jam Kerja (Time Tracking) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-[15px] font-bold text-slate-900">Log Jam Kerja</h3>
              <select
                onchange="changeTimePeriod(this.value)"
                class="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="thisWeek" ${appState.timePeriod === 'thisWeek' ? 'selected' : ''}>Minggu Ini</option>
                <option value="lastWeek" ${appState.timePeriod === 'lastWeek' ? 'selected' : ''}>Minggu Lalu</option>
              </select>
            </div>

            <div class="mt-2.5">
              <p class="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">${timeData.totalLabel}</p>
              <p class="text-[11.5px] text-slate-400 mt-1">Jam liputan & editing</p>
            </div>

            <!-- Grafik Batang 7 Hari dengan Tooltip Hover -->
            <div class="mt-4 h-[108px] flex items-end justify-between gap-2 pt-4">
              ${timeData.days.map(d => {
                const heightPct = Math.max(18, Math.round((d.hours / maxHours) * 100));
                return `
                  <div class="group relative flex-1 flex flex-col items-center h-full justify-end">
                    <!-- Tooltip Hover -->
                    <div class="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10.5px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-20">
                      <div>${d.day}: ${d.label}</div>
                      <div class="text-[9.5px] text-slate-300 font-normal">${d.note}</div>
                    </div>
                    <div
                      class="w-full max-w-[26px] rounded-t-lg rounded-b-sm transition-all duration-300 cursor-pointer ${
                        d.peak
                          ? 'bg-[#C2410C] shadow-[0_4px_12px_rgba(194,65,12,0.35)]'
                          : 'bg-[#E2E8F0] group-hover:bg-[#FDBA74]'
                      }"
                      style="height: ${heightPct}%"
                    ></div>
                    <span class="text-[10.5px] font-medium ${d.peak ? 'text-[#C2410C] font-bold' : 'text-slate-400'} mt-2">${d.day}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('timelog')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Log Waktu <span>→</span>
            </button>
          </div>
        </div>

      </section>

      <!-- ===================================================
           BARIS 3: 2 KARTU (Grid 12 Kolom: 8 Kiri + 4 Kanan)
      ==================================================== -->
      <section class="grid grid-cols-1 xl:grid-cols-12 gap-5">

        <!-- Kartu Kiri (8 Kolom): Timeline Proyek Wedding (Gantt Chart) -->
        <div class="xl:col-span-8 bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col">
          <!-- Header Timeline -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div class="flex flex-wrap items-center gap-4">
              <h3 class="text-[15px] font-bold text-slate-900">Timeline Proyek Wedding</h3>
              <div class="flex items-center gap-4 text-[11.5px] font-medium text-slate-500">
                <span class="flex items-center gap-1.5">
                  <span class="w-4 h-0.5 timeline-planned-line inline-block"></span> Rencana
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-4 h-1.5 rounded-full bg-[#C2410C] inline-block"></span> Aktual
                </span>
              </div>
            </div>
            <select
              onchange="changeTimelineFilter(this.value)"
              class="text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="thisMonth" ${appState.timelineFilter === 'thisMonth' ? 'selected' : ''}>Bulan Ini</option>
              <option value="nextMonth" ${appState.timelineFilter === 'nextMonth' ? 'selected' : ''}>Proyek Terbaru</option>
            </select>
          </div>

          <!-- Gantt Area (Scroll horizontal aman di layar kecil) -->
          <div class="overflow-x-auto pb-2">
            <div class="min-w-[560px]">
              <!-- Header Tanggal -->
              <div class="grid grid-cols-12 items-center pb-3 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <div class="col-span-4 pr-3">Nama Proyek</div>
                <div class="col-span-8 grid grid-cols-5 text-center">
                  <span>5 Nov</span>
                  <span>12 Nov</span>
                  <span>19 Nov</span>
                  <span>26 Nov</span>
                  <span>3 Des</span>
                </div>
              </div>

              <!-- Isi Baris Gantt + Garis Vertikal "Hari Ini" -->
              <div class="relative divide-y divide-slate-50">
                <!-- Garis Vertikal Merah Tipis (Hari Ini) di kolom kanan -->
                <div class="pointer-events-none absolute top-0 bottom-0 left-[33.333%] right-0">
                  <div class="absolute top-0 bottom-0 left-[54%] w-[1.5px] bg-rose-400/80 z-10"></div>
                </div>

                ${timelineProjects.map(p => `
                  <div onclick="openProjectDetail('${p.id}')" class="cursor-pointer grid grid-cols-12 items-center py-3.5 hover:bg-slate-50/70 transition-colors rounded-xl px-1 -mx-1">
                    <!-- Info Proyek Kiri -->
                    <div class="col-span-4 flex items-center gap-3 pr-3 min-w-0">
                      <div class="w-9 h-9 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0">
                        <i data-lucide="${p.icon}" class="w-4 h-4"></i>
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800 truncate">${p.name}</p>
                        <p class="text-[11px] text-slate-400">${p.dateRange}</p>
                      </div>
                    </div>

                    <!-- Track Bar Kanan -->
                    <div class="col-span-8 relative h-8 flex items-center px-2">
                      <!-- Grid Lines Tipis -->
                      <div class="absolute inset-0 grid grid-cols-5 pointer-events-none">
                        <div class="border-l border-slate-100/80 h-full"></div>
                        <div class="border-l border-slate-100/80 h-full"></div>
                        <div class="border-l border-slate-100/80 h-full"></div>
                        <div class="border-l border-slate-100/80 h-full"></div>
                        <div class="border-l border-slate-100/80 h-full"></div>
                      </div>

                      <!-- Garis Putus-putus Rencana -->
                      <div
                        class="absolute h-1 timeline-planned-line"
                        style="left: ${p.timeline.startPct}%; width: ${p.timeline.planWidthPct}%"
                      ></div>

                      <!-- Batang Biru Solid Aktual + Tooltip Hover -->
                      <div
                        class="group absolute h-3 rounded-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] shadow-[0_2px_8px_rgba(194,65,12,0.3)] z-10 transition-all hover:h-3.5"
                        style="left: ${p.timeline.startPct}%; width: ${p.timeline.actualWidthPct}%"
                      >
                        <div class="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10.5px] px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl z-30">
                          <div class="font-bold">${p.name} (${p.progress}%)</div>
                          <div class="text-slate-300 text-[10px]">${p.venue} • Status: ${p.status}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Label "Hari Ini" di bawah garis merah -->
              <div class="grid grid-cols-12 pt-1.5">
                <div class="col-span-4"></div>
                <div class="col-span-8 relative h-4">
                  <span class="absolute left-[54%] -translate-x-1/2 text-[10.5px] font-bold text-rose-500">
                    Hari Ini
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kartu Kanan (4 Kolom): Deadline Mendatang -->
        <div class="xl:col-span-4 bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900 mb-4">Deadline Mendatang</h3>

            <div class="space-y-3.5">
              ${appState.deadlines.map(dl => `
                <div onclick="switchTab('tasks')" class="cursor-pointer group flex items-center justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div class="flex items-start gap-2.5 min-w-0">
                    <span class="w-2 h-2 rounded-full ${dl.dotColor} mt-1.5 shrink-0"></span>
                    <div class="min-w-0">
                      <p class="text-[12.5px] font-bold text-slate-800 group-hover:text-[#C2410C] transition-colors truncate">${dl.title}</p>
                      <p class="text-[11px] text-slate-400 truncate mt-0.5">${dl.project}</p>
                    </div>
                  </div>
                  <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${dl.pillClass}">
                    ${dl.date}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('tasks')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Semua Deadline <span>→</span>
            </button>
          </div>
        </div>

      </section>

      <!-- ===================================================
           BARIS 4: 3 KARTU (Grid 3 Kolom)
      ==================================================== -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- Kartu 1: Catatan & Revisi Klien (Recent Comments) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <h3 class="text-[15px] font-bold text-slate-900">Catatan & Revisi Klien</h3>
              <button onclick="toggleQuickCommentForm()" class="text-[11px] font-semibold text-[#C2410C] bg-[#FFF0E9] hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors">
                + Catatan
              </button>
            </div>

            <!-- Input Ringkas Opsional Tambah Catatan -->
            ${appState.showQuickCommentForm ? `
              <form onsubmit="handleAddComment(event)" class="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 animate-fade-in">
                <input required id="quickCommentText" type="text" placeholder="Tulis catatan revisi klien / kru..." class="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#C2410C]" />
                <div class="flex items-center justify-between gap-2">
                  <select id="quickCommentProject" class="flex-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600 focus:outline-none">
                    ${appState.projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                  </select>
                  <button type="submit" class="px-3 py-1 rounded-lg bg-[#C2410C] text-white text-[11px] font-semibold hover:bg-[#9A3412]">Kirim</button>
                </div>
              </form>
            ` : ''}

            <!-- Daftar Komentar -->
            <div class="space-y-4">
              ${appState.comments.slice(0, 3).map(c => `
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full ${c.avatarStyle} font-bold text-xs flex items-center justify-center shrink-0">
                    ${c.initials}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-bold text-slate-800 truncate">${c.author}</p>
                      <span class="text-[10.5px] text-slate-400 shrink-0">${c.time}</span>
                    </div>
                    <p class="text-[11.5px] text-slate-600 mt-1 leading-relaxed">${c.text}</p>
                    <p class="text-[10.5px] text-slate-400 mt-1 font-medium">Pada: <span class="text-[#C2410C]">${c.project}</span></p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('tasks')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Semua Catatan <span>→</span>
            </button>
          </div>
        </div>

        <!-- Kartu 2: Kapasitas Tim Fotografer (Team Members) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <h3 class="text-[15px] font-bold text-slate-900 mb-4">Kapasitas Tim Fotografer</h3>

            <div class="space-y-3.5">
              ${appState.team.map(member => `
                <div onclick="switchTab('team')" class="cursor-pointer flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-full ${member.avatarBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      ${member.initials}
                    </div>
                    <div class="min-w-0">
                      <p class="text-[12.5px] font-bold text-slate-800 truncate">${member.name}</p>
                      <p class="text-[11px] text-slate-400 truncate">${member.role}</p>
                    </div>
                  </div>
                  <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg ${member.badgeClass}">
                    ${member.workload}%
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button onclick="switchTab('team')" class="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors">
              Lihat Semua Tim <span>→</span>
            </button>
          </div>
        </div>

        <!-- Kartu 3: Proyek Wedding Aktif (Active Projects) -->
        <div class="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <h3 class="text-[15px] font-bold text-slate-900">Proyek Wedding Aktif</h3>
              <button onclick="switchTab('projects')" class="text-xs font-semibold text-[#C2410C] hover:underline">
                Lihat Semua →
              </button>
            </div>

            <div class="space-y-4">
              ${appState.projects.slice(0, 4).map(p => `
                <div onclick="openProjectDetail('${p.id}')" class="cursor-pointer group flex items-center gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div class="w-10 h-10 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0">
                    <i data-lucide="${p.icon}" class="w-[18px] h-[18px]"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-[12.5px] font-bold text-slate-800 group-hover:text-[#C2410C] transition-colors truncate">${p.name}</p>
                      <span class="text-xs font-extrabold text-slate-800 shrink-0">${p.progress}%</span>
                    </div>
                    <div class="flex items-center gap-2.5 mt-1.5">
                      <span class="text-[10.5px] text-slate-400 shrink-0">${p.dueLabel}</span>
                      <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full ${p.barColor} rounded-full transition-all duration-500" style="width: ${p.progress}%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Menampilkan 4 dari ${appState.projects.length} proyek unggulan</span>
            <button onclick="openModal('newProjectModal')" class="text-xs font-semibold text-[#C2410C] hover:underline">+ Tambah</button>
          </div>
        </div>

      </section>

    </div>
  `;
}
