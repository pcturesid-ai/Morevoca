function renderApp() {
  try {
    renderSidebar();
    renderNotifications();
    const views = {
      dashboard: renderDashboardView, inquiries: renderInquiriesView, projects: renderProjectsView, calendar: renderCalendarView,
      albums: renderAlbumsAdminView, packages: renderPackagesAdminView, testimonials: renderTestimonialsAdminView, site: renderSiteView,
    };
    document.getElementById('mainContent').innerHTML = (views[appState.activeTab] || renderDashboardView)();
    lucide.createIcons();
  } catch (err) {
    console.error('Gagal merender tampilan:', err);
  }
}
document.addEventListener('DOMContentLoaded', () => { bootAdmin(); });
