/**
 * ============================================================
 * 7. HANDLER INTERAKTIVITAS (CRUD & REAL-TIME SYNC)
 * ============================================================
 */
function changeTimePeriod(val) {
  appState.timePeriod = val;
  renderApp();
}

function changeTimelineFilter(val) {
  appState.timelineFilter = val;
  renderApp();
}

function setProjectFilter(val) {
  appState.projectFilter = val;
  renderApp();
}

function toggleQuickCommentForm() {
  appState.showQuickCommentForm = !appState.showQuickCommentForm;
  renderApp();
}

function handleAddComment(e) {
  e.preventDefault();
  const text = document.getElementById('quickCommentText').value.trim();
  const project = document.getElementById('quickCommentProject').value;
  if (!text) return;

  appState.comments.unshift({
    id: 'CMT-' + Date.now(),
    author: 'Raka Pratama (Lead)',
    initials: 'RP',
    avatarStyle: 'bg-[#FFF0E9] text-[#C2410C]',
    time: 'Baru saja',
    text,
    project,
  });
  appState.showQuickCommentForm = false;
  renderApp();
  showToast('Catatan baru ditambahkan ke proyek ' + project, 'success');
}

function handleCreateProject(e) {
  e.preventDefault();
  const name = document.getElementById('projName').value.trim();
  const pkg = document.getElementById('projPackage').value;
  const dateVal = document.getElementById('projDate').value;
  const photographer = document.getElementById('projPhotographer').value;
  const venue = document.getElementById('projVenue').value.trim();

  const d = new Date(dateVal);
  const day = d.getDate() || 29;
  const monthShort = d.toLocaleDateString('id-ID', { month: 'short' });

  const newProj = {
    id: 'PRJ-' + (appState.projects.length + 1),
    name,
    couple: name.replace(/^(Resepsi|Akad|Prewedding|Intimate)\s+/i, ''),
    package: pkg,
    venue,
    photographer,
    dateRange: `Hari ini – ${day} ${monthShort}`,
    dueLabel: `Tenggat ${day} ${monthShort}`,
    dueDate: dateVal,
    progress: 15,
    status: 'Persiapan',
    icon: 'camera',
    iconBg: 'bg-orange-50 text-[#C2410C]',
    barColor: 'bg-[#C2410C]',
    timeline: { startPct: 48, planWidthPct: 44, actualWidthPct: 14, month: 'thisMonth' },
    value: pkg.includes('Platinum') ? 28000000 : pkg.includes('Gold') ? 18000000 : 14000000,
  };

  // Masukkan ke awal array agar langsung muncul di Proyek Aktif, Timeline & KPI bertambah!
  appState.projects.unshift(newProj);
  appState.clients.unshift({
    id: 'CL-' + Date.now(),
    couple: newProj.couple,
    phone: '+62 812-0000-8899',
    email: 'klien.baru@morevoca.id',
    date: `${day} ${monthShort} 2026`,
    package: pkg,
    payment: 'DP 50%',
    total: formatRupiah(newProj.value),
    venue,
  });

  document.getElementById('newProjectForm').reset();
  closeModal('newProjectModal');
  renderApp();
  showToast(`Proyek "${name}" berhasil ditambahkan! KPI & Timeline diperbarui.`, 'success');
}

function handleCreateTask(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const project = document.getElementById('taskProject').value;
  const stage = document.getElementById('taskStage').value;
  const assignee = document.getElementById('taskAssignee').value;
  const initials = assignee.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();

  appState.kanbanTasks.unshift({
    id: 'TSK-' + Date.now(),
    title,
    project,
    stage,
    assignee,
    initials,
    avatarColor: 'bg-orange-100 text-orange-800',
    due: '29 Nov',
    priority: 'Tinggi',
    tag: 'Baru',
  });

  document.getElementById('taskTitle').value = '';
  closeModal('newTaskModal');
  renderApp();
  showToast(`Tugas "${title}" ditambahkan ke papan produksi.`, 'success');
}

function moveKanbanCard(taskId, targetStage) {
  if (!targetStage) return;
  const task = appState.kanbanTasks.find(t => t.id === taskId);
  if (!task) return;
  task.stage = targetStage;
  const stageNames = { briefing: 'Briefing', editing: 'Shooting & Edit', revisi: 'Revisi Klien', selesai: 'Selesai' };
  renderApp();
  showToast(`"${task.title}" dipindahkan ke tahap ${stageNames[targetStage]}.`, 'info');
}

function toggleTaskComplete(taskId) {
  const task = appState.kanbanTasks.find(t => t.id === taskId);
  if (!task) return;
  task.stage = task.stage === 'selesai' ? 'editing' : 'selesai';
  renderApp();
  showToast(task.stage === 'selesai' ? 'Tugas ditandai selesai!' : 'Tugas dikembalikan ke tahap Editing.', 'success');
}

function selectCalendarDay(day) {
  appState.selectedCalendarDay = day;
  renderApp();
}

function changeCalendarMonth(delta) {
  const next = appState.calendarMonthOffset + delta;
  if (next >= 0 && next <= 2) {
    appState.calendarMonthOffset = next;
    appState.selectedCalendarDay = 1;
    renderApp();
  }
}

function handleAddTimeLog(e) {
  e.preventDefault();
  const project = document.getElementById('tlProject').value;
  const activity = document.getElementById('tlActivity').value.trim();
  const member = document.getElementById('tlMember').value;
  const hours = parseFloat(document.getElementById('tlDuration').value);

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const durLabel = `${h}j ${m < 10 ? '0' + m : m}m`;

  appState.timeLogsHistory.unshift({
    id: 'TL-' + Date.now(),
    date: 'Hari Ini',
    project,
    activity,
    member,
    duration: durLabel,
  });

  document.getElementById('tlActivity').value = '';
  renderApp();
  showToast(`Log waktu (${durLabel}) berhasil dicatat!`, 'success');
}
