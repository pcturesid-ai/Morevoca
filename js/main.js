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
      inquiries: renderInquiriesView,
      albums: renderAlbumsAdminView,
      packages: renderPackagesAdminView,
      testimonials: renderTestimonialsAdminView,
      site: renderSiteView,
    };

    const renderer = views[appState.activeTab] || renderDashboardView;
    const notice = NAV_ITEMS.find(n => n.id === appState.activeTab)?.dummy
      ? '<div class="mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3">Halaman ini masih memakai data contoh, belum tersambung ke database.</div>' : '';
    main.innerHTML = notice + renderer();
    lucide.createIcons();
  } catch (err) {
    console.error('Terjadi kesalahan saat merender tampilan:', err);
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  bootAdmin();
});
