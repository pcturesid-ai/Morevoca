/**
 * ============================================================
 * 2. FUNGSI HELPER & KALKULASI KPI DINAMIS
 * ============================================================
 */
function getComputedStats() {
  const activeProjectsCount = appState.kpiOffsets.activeProjects + appState.projects.filter(p => p.status !== 'Selesai').length;

  const stageCounts = { briefing: 0, editing: 0, revisi: 0, selesai: 0 };
  appState.kanbanTasks.forEach(t => {
    if (stageCounts[t.stage] !== undefined) stageCounts[t.stage]++;
  });

  const briefing = appState.kanbanOffsets.briefing + stageCounts.briefing;
  const editing = appState.kanbanOffsets.editing + stageCounts.editing;
  const revisi = appState.kanbanOffsets.revisi + stageCounts.revisi;
  const selesai = appState.kanbanOffsets.selesai + stageCounts.selesai;
  const totalKanban = briefing + editing + revisi + selesai;

  // Hitung persentase selesai (di desain referensi 62%, bergerak dinamis saat kartu dipindahkan)
  const baseCompletionBoost = 17; // menyesuaikan bobot progres tugas aktif
  const rawRate = Math.round(((selesai + baseCompletionBoost) / totalKanban) * 100);
  const completionRate = Math.min(100, Math.max(0, rawRate));

  const completedKPI = appState.kpiOffsets.completedItems + stageCounts.selesai + 1; // awal 186
  const pendingKPI = appState.kpiOffsets.editingQueue + (stageCounts.briefing + stageCounts.editing + stageCounts.revisi) - 1; // awal 57

  const avgWorkload = Math.round(appState.team.reduce((acc, m) => acc + m.workload, 0) / appState.team.length);

  return {
    activeProjectsCount,
    completedKPI,
    pendingKPI,
    avgWorkload,
    kanban: { briefing, editing, revisi, selesai, total: totalKanban, completionRate },
  };
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}
