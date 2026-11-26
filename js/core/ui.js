/**
 * Menampilkan notifikasi Toast elegan di pojok kanan bawah
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const id = 'toast-' + Date.now();
  const styles = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-slate-900 text-white',
    warning: 'bg-amber-500 text-white',
  };
  const iconName = type === 'success' ? 'check-circle-2' : type === 'warning' ? 'alert-circle' : 'info';

  const el = document.createElement('div');
  el.id = id;
  el.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold ${styles[type] || styles.info} animate-fade-in`;
  el.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i><span>${message}</span>`;
  container.appendChild(el);
  lucide.createIcons();

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'all 0.25s ease';
    setTimeout(() => el.remove(), 250);
  }, 3200);
}

/**
 * ============================================================
 * 3. NAVIGASI, SIDEBAR, DROPDOWN & MODAL CONTROLS
 * ============================================================
 */
function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = NAV_ITEMS.map(item => {
    const isActive = appState.activeTab === item.id;
    return `
      <button
        onclick="switchTab('${item.id}')"
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
          isActive
            ? 'bg-[#FFF0E9] text-[#C2410C] font-semibold shadow-[inset_0_0_0_1px_rgba(194,65,12,0.08)]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }"
      >
        <i data-lucide="${item.icon}" class="w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#C2410C]' : 'text-slate-400'}"></i>
        <span class="truncate">${item.label}</span>${item.dummy ? '<span class="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">contoh</span>' : ''}
      </button>
    `;
  }).join('');
}

function switchTab(tabId) {
  appState.activeTab = tabId;
  const found = NAV_ITEMS.find(n => n.id === tabId);
  document.getElementById('pageTitle').textContent = found ? found.label : 'Dashboard';
  toggleSidebar(false);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar(forceState) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  const nextOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

  if (window.innerWidth < 1024) {
    if (nextOpen) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  } else {
    // Di desktop, izinkan collapse/expand halus
    if (typeof forceState === 'undefined') {
      sidebar.classList.toggle('lg:hidden');
    }
  }
}

function toggleDropdown(id) {
  const ids = ['notifDropdown', 'profileDropdown', 'searchDropdown'];
  ids.forEach(item => {
    const el = document.getElementById(item);
    if (!el) return;
    if (item === id) {
      el.classList.toggle('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

// Tutup dropdown saat klik di luar
document.addEventListener('click', (e) => {
  if (!e.target.closest('#notifBtn') && !e.target.closest('#notifDropdown')) {
    document.getElementById('notifDropdown')?.classList.add('hidden');
  }
  if (!e.target.closest('#profileDropdown') && !e.target.closest('[onclick*="profileDropdown"]')) {
    document.getElementById('profileDropdown')?.classList.add('hidden');
  }
  if (!e.target.closest('#globalSearchInput') && !e.target.closest('#searchDropdown')) {
    document.getElementById('searchDropdown')?.classList.add('hidden');
  }
});

function openModal(id) {
  if (id === 'newTaskModal') {
    const sel = document.getElementById('taskProject');
    sel.innerHTML = appState.projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * ============================================================
 * 4. NOTIFIKASI & PENCARIAN GLOBAL
 * ============================================================
 */
function renderNotifications() {
  const unreadCount = appState.notifications.filter(n => n.unread).length;
  const badge = document.getElementById('notifBadge');
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  const list = document.getElementById('notifList');
  list.innerHTML = appState.notifications.map(n => `
    <div class="px-4 py-3 flex items-start gap-3 hover:bg-slate-50/80 transition-colors ${n.unread ? 'bg-[#FFF0E9]/35' : ''}">
      <div class="w-8 h-8 rounded-xl ${n.color} flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="${n.icon}" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-bold text-slate-800 truncate">${n.title}</p>
          ${n.unread ? '<span class="w-2 h-2 rounded-full bg-[#C2410C] shrink-0"></span>' : ''}
        </div>
        <p class="text-[11.5px] text-slate-500 mt-0.5 leading-snug">${n.desc}</p>
        <span class="text-[10.5px] text-slate-400 mt-1 block">${n.time}</span>
      </div>
    </div>
  `).join('');
}

function markAllNotificationsRead() {
  appState.notifications.forEach(n => (n.unread = false));
  renderNotifications();
  lucide.createIcons();
  showToast('Semua notifikasi ditandai sudah dibaca.', 'success');
}

function handleGlobalSearch(query) {
  const dropdown = document.getElementById('searchDropdown');
  const clearBtn = document.getElementById('clearSearchBtn');
  const q = query.trim().toLowerCase();

  if (q.length === 0) {
    dropdown.classList.add('hidden');
    clearBtn.classList.add('hidden');
    return;
  }

  clearBtn.classList.remove('hidden');
  const matchedProjects = appState.projects.filter(
    p => p.name.toLowerCase().includes(q) || p.couple.toLowerCase().includes(q) || p.venue.toLowerCase().includes(q)
  );
  const matchedClients = appState.clients.filter(
    c => c.couple.toLowerCase().includes(q) || c.package.toLowerCase().includes(q)
  );

  if (matchedProjects.length === 0 && matchedClients.length === 0) {
    dropdown.innerHTML = `
      <div class="p-4 text-center">
        <p class="text-xs font-medium text-slate-500">Tidak ditemukan hasil untuk "<strong>${query}</strong>"</p>
      </div>
    `;
  } else {
    dropdown.innerHTML = `
      ${matchedProjects.length ? `
        <p class="px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Proyek Wedding</p>
        ${matchedProjects.slice(0, 4).map(p => `
          <button onclick="openProjectDetail('${p.id}'); document.getElementById('searchDropdown').classList.add('hidden')" class="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-slate-800 truncate">${p.name}</p>
              <p class="text-[11px] text-slate-400 truncate">${p.venue}</p>
            </div>
            <span class="text-[11px] font-bold text-[#C2410C] bg-[#FFF0E9] px-2 py-0.5 rounded-lg shrink-0">${p.progress}%</span>
          </button>
        `).join('')}
      ` : ''}
      ${matchedClients.length ? `
        <p class="px-2.5 pt-2 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">Klien Pengantin</p>
        ${matchedClients.slice(0, 3).map(c => `
          <button onclick="switchTab('clients'); document.getElementById('searchDropdown').classList.add('hidden')" class="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-slate-800 truncate">${c.couple}</p>
              <p class="text-[11px] text-slate-400 truncate">${c.package}</p>
            </div>
            <span class="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">${c.payment}</span>
          </button>
        `).join('')}
      ` : ''}
    `;
  }

  dropdown.classList.remove('hidden');
}

function clearGlobalSearch() {
  document.getElementById('globalSearchInput').value = '';
  document.getElementById('searchDropdown').classList.add('hidden');
  document.getElementById('clearSearchBtn').classList.add('hidden');
}
