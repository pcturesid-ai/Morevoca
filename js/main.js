/**
 * ============================================================
 * 8. MASTER RENDER & INISIALISASI
 * ============================================================
 */
function renderApp() {
  try {
    renderSidebar();
    renderNotifications();

    const main = document.getElementById('mainContent');
    const views = {
      dashboard: renderDashboardView,
      projects: renderProjectsView,
      tasks: renderTasksView,
      kanban: renderKanbanView,
      calendar: renderCalendarView,
      timelog: renderTimeLogView,
      reports: renderReportsView,
      team: renderTeamView,
      clients: renderClientsView,
      documents: renderDocumentsView,
      settings: renderSettingsView,
    };

    const renderer = views[appState.activeTab] || renderDashboardView;
    main.innerHTML = renderer();
    lucide.createIcons();
  } catch (err) {
    console.error('Terjadi kesalahan saat merender tampilan:', err);
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
