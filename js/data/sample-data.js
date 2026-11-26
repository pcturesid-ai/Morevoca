/**
 * ============================================================
 * 1. DATA & STATE APLIKASI (Autentik Studio Wedding Indonesia)
 * ============================================================
 */
const NAV_ITEMS = [
  // Data asli (Supabase)
  { id: 'inquiries', label: 'Pertanyaan Masuk', icon: 'inbox' },
  { id: 'albums', label: 'Album Portofolio', icon: 'images' },
  { id: 'packages', label: 'Paket & Harga', icon: 'package' },
  { id: 'testimonials', label: 'Testimoni', icon: 'message-square-quote' },
  { id: 'site', label: 'Pengaturan Situs', icon: 'globe' },
  // Halaman di bawah ini masih data contoh
  { id: 'dashboard', label: 'Dashboard', icon: 'home', dummy: true },
  { id: 'projects', label: 'Proyek Wedding', icon: 'folder-heart', dummy: true },
  { id: 'tasks', label: 'Tugas & Editing', icon: 'check-circle-2', dummy: true },
  { id: 'kanban', label: 'Papan Kanban', icon: 'columns-3', dummy: true },
  { id: 'calendar', label: 'Jadwal Liputan', icon: 'calendar', dummy: true },
  { id: 'timelog', label: 'Log Jam Kerja', icon: 'clock', dummy: true },
  { id: 'reports', label: 'Laporan', icon: 'bar-chart-3', dummy: true },
  { id: 'team', label: 'Tim Fotografer', icon: 'users', dummy: true },
  { id: 'clients', label: 'Klien Pengantin', icon: 'heart-handshake', dummy: true },
  { id: 'documents', label: 'Kontrak & Album', icon: 'file-text', dummy: true },
  { id: 'settings', label: 'Pengaturan', icon: 'settings', dummy: true },
];

const appState = {
  activeTab: 'dashboard',
  timePeriod: 'thisWeek', // 'thisWeek' | 'lastWeek'
  timelineFilter: 'thisMonth', // 'thisMonth' | 'nextMonth'
  projectFilter: 'Semua',
  calendarMonthOffset: 0, // 0 = November 2026
  selectedCalendarDay: 20,
  showQuickCommentForm: false,

  // Offset agar angka KPI awal cocok persis dengan desain referensi (24, 186, 57) namun tetap dinamis saat data ditambah/diubah
  kpiOffsets: {
    activeProjects: 18, // + 6 proyek aktif = 24
    completedItems: 182, // + 4 tugas selesai = 186
    editingQueue: 49, // + 8 tugas belum selesai = 57
  },
  // Offset Kanban agar angka awal persis 23, 15, 8, 31 (Total 77) dan berubah real-time saat kartu dipindahkan
  kanbanOffsets: {
    briefing: 20,
    editing: 12,
    revisi: 5,
    selesai: 28,
  },

  projects: [
    {
      id: 'PRJ-01',
      name: 'Resepsi Andini & Reza',
      couple: 'Andini Putri & Reza Mahendra',
      package: 'Platinum Akad & Resepsi',
      venue: 'Hotel Mulia Senayan, Jakarta',
      photographer: 'Raka Pratama',
      dateRange: '5 Nov – 25 Nov',
      dueLabel: 'Tenggat 25 Nov',
      dueDate: '2026-11-25',
      progress: 68,
      status: 'Editing',
      icon: 'camera',
      iconBg: 'bg-blue-50 text-[#C2410C]',
      barColor: 'bg-[#C2410C]',
      timeline: { startPct: 2, planWidthPct: 68, actualWidthPct: 48, month: 'thisMonth' },
      value: 28000000,
    },
    {
      id: 'PRJ-02',
      name: 'Prewedding Clara & Dimas',
      couple: 'Clara Wijaya & Dimas Saputra',
      package: 'Prewedding Destination',
      venue: 'Savana Bromo & Malang',
      photographer: 'Dimas Anggara',
      dateRange: '8 Nov – 5 Des',
      dueLabel: 'Tenggat 5 Des',
      dueDate: '2026-12-05',
      progress: 55,
      status: 'Editing',
      icon: 'image',
      iconBg: 'bg-orange-50 text-orange-700',
      barColor: 'bg-[#EA580C]',
      timeline: { startPct: 12, planWidthPct: 76, actualWidthPct: 54, month: 'thisMonth' },
      value: 12500000,
    },
    {
      id: 'PRJ-03',
      name: 'Akad & Resepsi Nadia & Fajar',
      couple: 'Nadia Larasati & Fajar Nugroho',
      package: 'Gold Resepsi + Cinema',
      venue: 'Plataran Menteng, Jakarta',
      photographer: 'Nadya Kusuma',
      dateRange: '12 Nov – 2 Des',
      dueLabel: 'Tenggat 2 Des',
      dueDate: '2026-12-02',
      progress: 45,
      status: 'Revisi',
      icon: 'film',
      iconBg: 'bg-sky-50 text-sky-600',
      barColor: 'bg-sky-500',
      timeline: { startPct: 24, planWidthPct: 64, actualWidthPct: 38, month: 'thisMonth' },
      value: 19500000,
    },
    {
      id: 'PRJ-04',
      name: 'Intimate Bali – Siska & Bima',
      couple: 'Siska Permata & Bima Pratama',
      package: 'Intimate Wedding',
      venue: 'Tirtha Uluwatu, Bali',
      photographer: 'Raka Pratama',
      dateRange: '15 Nov – 30 Nov',
      dueLabel: 'Tenggat 30 Nov',
      dueDate: '2026-11-30',
      progress: 75,
      status: 'Cetak Album',
      icon: 'sparkles',
      iconBg: 'bg-purple-50 text-purple-600',
      barColor: 'bg-[#EA580C]',
      timeline: { startPct: 34, planWidthPct: 54, actualWidthPct: 42, month: 'thisMonth' },
      value: 22000000,
    },
    {
      id: 'PRJ-05',
      name: 'Siraman & Akad Tiara & Kevin',
      couple: 'Tiara Ayu & Kevin Tanoto',
      package: 'Platinum Akad & Resepsi',
      venue: 'Ritz-Carlton Pacific Place',
      photographer: 'Bagas Mahendra',
      dateRange: '18 Nov – 10 Des',
      dueLabel: 'Tenggat 10 Des',
      dueDate: '2026-12-10',
      progress: 35,
      status: 'Persiapan',
      icon: 'heart',
      iconBg: 'bg-rose-50 text-rose-500',
      barColor: 'bg-rose-500',
      timeline: { startPct: 45, planWidthPct: 50, actualWidthPct: 22, month: 'nextMonth' },
      value: 31000000,
    },
    {
      id: 'PRJ-06',
      name: 'Engagement Laila & Hendra',
      couple: 'Laila Sari & Hendra Gunawan',
      package: 'Intimate Wedding',
      venue: 'Glass House Bandung',
      photographer: 'Sinta Maharani',
      dateRange: '22 Nov – 8 Des',
      dueLabel: 'Tenggat 8 Des',
      dueDate: '2026-12-08',
      progress: 20,
      status: 'Persiapan',
      icon: 'aperture',
      iconBg: 'bg-amber-50 text-amber-600',
      barColor: 'bg-amber-500',
      timeline: { startPct: 58, planWidthPct: 40, actualWidthPct: 16, month: 'nextMonth' },
      value: 9500000,
    },
  ],

  // Tugas interaktif untuk Kanban & Daftar Tugas (3 per tahap awal + offset = 23, 15, 8, 31)
  kanbanTasks: [
    { id: 'TSK-1', title: 'Technical Meeting & Rundown Akad', project: 'Siraman & Akad Tiara & Kevin', stage: 'briefing', assignee: 'Sinta Maharani', initials: 'SM', avatarColor: 'bg-emerald-100 text-emerald-700', due: '21 Nov', priority: 'Tinggi', tag: 'Briefing' },
    { id: 'TSK-2', title: 'Survey Lighting Venue Glass House', project: 'Engagement Laila & Hendra', stage: 'briefing', assignee: 'Dimas Anggara', initials: 'DA', avatarColor: 'bg-amber-100 text-amber-700', due: '23 Nov', priority: 'Sedang', tag: 'Lokasi' },
    { id: 'TSK-3', title: 'Finalisasi Moodboard Wardrobe Bromo', project: 'Prewedding Clara & Dimas', stage: 'briefing', assignee: 'Raka Pratama', initials: 'RP', avatarColor: 'bg-orange-100 text-orange-800', due: '24 Nov', priority: 'Normal', tag: 'Konsep' },

    { id: 'TSK-4', title: 'Kirim Teaser 50 Foto High-Res', project: 'Resepsi Andini & Reza', stage: 'editing', assignee: 'Bagas Mahendra', initials: 'BM', avatarColor: 'bg-rose-100 text-rose-700', due: '20 Nov', priority: 'Tinggi', tag: 'Editing' },
    { id: 'TSK-5', title: 'Color Grading Video Highlight 3 Menit', project: 'Akad & Resepsi Nadia & Fajar', stage: 'editing', assignee: 'Nadya Kusuma', initials: 'NK', avatarColor: 'bg-sky-100 text-sky-700', due: '24 Nov', priority: 'Tinggi', tag: 'Video' },
    { id: 'TSK-6', title: 'Culling 2.400 File RAW Resepsi', project: 'Resepsi Andini & Reza', stage: 'editing', assignee: 'Dimas Anggara', initials: 'DA', avatarColor: 'bg-amber-100 text-amber-700', due: '25 Nov', priority: 'Sedang', tag: 'RAW' },

    { id: 'TSK-7', title: 'Finalisasi Layout Album 20x30cm', project: 'Prewedding Clara & Dimas', stage: 'revisi', assignee: 'Bagas Mahendra', initials: 'BM', avatarColor: 'bg-rose-100 text-rose-700', due: '22 Nov', priority: 'Tinggi', tag: 'Album' },
    { id: 'TSK-8', title: 'Ganti Backsound Teaser Instagram Reels', project: 'Akad & Resepsi Nadia & Fajar', stage: 'revisi', assignee: 'Nadya Kusuma', initials: 'NK', avatarColor: 'bg-sky-100 text-sky-700', due: '23 Nov', priority: 'Sedang', tag: 'Revisi Klien' },
    { id: 'TSK-9', title: 'Penyesuaian Skin Tone Foto Keluarga', project: 'Intimate Bali – Siska & Bima', stage: 'revisi', assignee: 'Bagas Mahendra', initials: 'BM', avatarColor: 'bg-rose-100 text-rose-700', due: '26 Nov', priority: 'Sedang', tag: 'Retouch' },

    { id: 'TSK-10', title: 'Cetak Kanvas 60x90 & Box Kayu Eksklusif', project: 'Intimate Bali – Siska & Bima', stage: 'selesai', assignee: 'Sinta Maharani', initials: 'SM', avatarColor: 'bg-emerald-100 text-emerald-700', due: '28 Nov', priority: 'Normal', tag: 'Cetak' },
    { id: 'TSK-11', title: 'Upload Galeri Online Pixieset (420 Foto)', project: 'Resepsi Andini & Reza', stage: 'selesai', assignee: 'Raka Pratama', initials: 'RP', avatarColor: 'bg-orange-100 text-orange-800', due: '18 Nov', priority: 'Normal', tag: 'Delivery' },
    { id: 'TSK-12', title: 'Backup Ganda NAS & Google Drive RAW', project: 'Intimate Bali – Siska & Bima', stage: 'selesai', assignee: 'Dimas Anggara', initials: 'DA', avatarColor: 'bg-amber-100 text-amber-700', due: '17 Nov', priority: 'Normal', tag: 'Backup' },
  ],

  deadlines: [
    { id: 'DL-1', title: 'Kirim Teaser 50 Foto', project: 'Resepsi Andini & Reza', date: '20 Nov', dotColor: 'bg-[#C2410C]', pillClass: 'bg-rose-50 text-rose-600 border border-rose-100' },
    { id: 'DL-2', title: 'Finalisasi Layout Album', project: 'Prewedding Clara & Dimas', date: '22 Nov', dotColor: 'bg-orange-500', pillClass: 'bg-orange-50 text-orange-600 border border-orange-100' },
    { id: 'DL-3', title: 'Color Grading Video Highlight', project: 'Akad Nadia & Fajar', date: '24 Nov', dotColor: 'bg-purple-500', pillClass: 'bg-amber-50 text-amber-700 border border-amber-100' },
    { id: 'DL-4', title: 'Cetak Kanvas & Box Kayu', project: 'Intimate Bali – Siska & Bima', date: '28 Nov', dotColor: 'bg-emerald-500', pillClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  ],

  comments: [
    {
      id: 'CMT-1',
      author: 'Andini Putri (Klien)',
      initials: 'AP',
      avatarStyle: 'bg-orange-100 text-orange-800',
      time: '2j lalu',
      text: 'Tone warnanya suka banget! Boleh sedikit dicerahkan skin tone di foto pelaminan nomor #142 ya mas? ✨',
      project: 'Resepsi Andini & Reza',
    },
    {
      id: 'CMT-2',
      author: 'Clara Wijaya (Klien)',
      initials: 'CW',
      avatarStyle: 'bg-rose-100 text-rose-700',
      time: '5j lalu',
      text: 'Kami sudah pilih 65 foto favorit untuk layout album cetak di link proofing tadi pagi.',
      project: 'Prewedding Clara & Dimas',
    },
    {
      id: 'CMT-3',
      author: 'Nadya Kusuma (Kru)',
      initials: 'NK',
      avatarStyle: 'bg-sky-100 text-sky-700',
      time: '1h lalu',
      text: 'Musik teaser sudah diganti ke versi akustik sesuai request Fajar, siap direview sebelum export 4K.',
      project: 'Akad & Resepsi Nadia & Fajar',
    },
  ],

  team: [
    { id: 'TM-1', name: 'Raka Pratama', role: 'Lead Photographer', workload: 85, badgeClass: 'bg-rose-50 text-rose-600', barClass: 'bg-rose-500', initials: 'RP', avatarBg: 'bg-orange-600 text-white', gear: 'Sony A7R V + 35mm f/1.4 GM', activeShoots: 4, phone: '0812-8891-4402' },
    { id: 'TM-2', name: 'Dimas Anggara', role: 'Second Shooter', workload: 70, badgeClass: 'bg-amber-50 text-amber-600', barClass: 'bg-amber-400', initials: 'DA', avatarBg: 'bg-amber-500 text-white', gear: 'Sony A7 IV + 85mm f/1.4 GM', activeShoots: 3, phone: '0813-7721-9018' },
    { id: 'TM-3', name: 'Nadya Kusuma', role: 'Videographer', workload: 65, badgeClass: 'bg-emerald-50 text-emerald-600', barClass: 'bg-emerald-500', initials: 'NK', avatarBg: 'bg-sky-500 text-white', gear: 'Sony FX3 + DJI RS4 Pro', activeShoots: 3, phone: '0811-4429-1182' },
    { id: 'TM-4', name: 'Bagas Mahendra', role: 'Colorist & Retoucher', workload: 90, badgeClass: 'bg-rose-50 text-rose-600', barClass: 'bg-rose-500', initials: 'BM', avatarBg: 'bg-purple-600 text-white', gear: 'Mac Studio M2 Ultra + ProDisplay', activeShoots: 5, phone: '0815-9910-3321' },
    { id: 'TM-5', name: 'Sinta Maharani', role: 'Wedding Coordinator', workload: 60, badgeClass: 'bg-emerald-50 text-emerald-600', barClass: 'bg-emerald-500', initials: 'SM', avatarBg: 'bg-emerald-600 text-white', gear: 'iPad Pro + Client Sync Hub', activeShoots: 4, phone: '0812-3318-7764' },
  ],

  timeTracking: {
    thisWeek: {
      totalLabel: '28j 45m',
      days: [
        { day: 'Sen', hours: 3.5, label: '3j 30m', note: 'Culling & Backup RAW', peak: false },
        { day: 'Sel', hours: 3.0, label: '3j 00m', note: 'Meeting Klien Clara & Dimas', peak: false },
        { day: 'Rab', hours: 6.5, label: '6j 30m', note: 'Liputan Prewedding + Grading', peak: true },
        { day: 'Kam', hours: 3.25, label: '3j 15m', note: 'Layout Album Cetak', peak: false },
        { day: 'Jum', hours: 4.75, label: '4j 45m', note: 'Color Grading Video Highlight', peak: false },
        { day: 'Sab', hours: 2.5, label: '2j 30m', note: 'Briefing Kru & Persiapan Gear', peak: false },
        { day: 'Min', hours: 5.25, label: '5j 15m', note: 'Liputan Akad & Resepsi', peak: false },
      ],
    },
    lastWeek: {
      totalLabel: '34j 20m',
      days: [
        { day: 'Sen', hours: 4.5, label: '4j 30m', note: 'Editing Galeri Siska & Bima', peak: false },
        { day: 'Sel', hours: 4.0, label: '4j 00m', note: 'Revisi Album Klien', peak: false },
        { day: 'Rab', hours: 3.5, label: '3j 30m', note: 'Cek Vendor Cetak Kanvas', peak: false },
        { day: 'Kam', hours: 5.0, label: '5j 00m', note: 'Prewedding Outdoor', peak: false },
        { day: 'Jum', hours: 4.3, label: '4j 20m', note: 'Persiapan Gear & Baterai', peak: false },
        { day: 'Sab', hours: 8.0, label: '8j 00m', note: 'Full Day Resepsi Andini & Reza', peak: true },
        { day: 'Min', hours: 5.0, label: '5j 00m', note: 'Liputan Intimate Engagement', peak: false },
      ],
    },
  },

  timeLogsHistory: [
    { id: 'TL-1', date: '25 Nov 2026', project: 'Resepsi Andini & Reza', activity: 'Color Grading & Retouching', member: 'Bagas Mahendra', duration: '3j 45m' },
    { id: 'TL-2', date: '24 Nov 2026', project: 'Akad & Resepsi Nadia & Fajar', activity: 'Editing Video Highlight 4K', member: 'Nadya Kusuma', duration: '4j 20m' },
    { id: 'TL-3', date: '22 Nov 2026', project: 'Prewedding Clara & Dimas', activity: 'Layout Album 20x30cm', member: 'Raka Pratama', duration: '2j 30m' },
    { id: 'TL-4', date: '20 Nov 2026', project: 'Intimate Bali – Siska & Bima', activity: 'Quality Check Cetak Kanvas', member: 'Sinta Maharani', duration: '1j 50m' },
  ],

  notifications: [
    { id: 'N-1', title: 'Komentar Revisi Baru', desc: 'Andini Putri mengomentari foto #142 di galeri proofing.', time: '2 jam lalu', unread: true, icon: 'message-square', color: 'bg-blue-50 text-[#C2410C]' },
    { id: 'N-2', title: 'Pelunasan DP 50% Diterima', desc: 'Transfer Rp 15.500.000 dari Tiara & Kevin terverifikasi.', time: '5 jam lalu', unread: true, icon: 'wallet', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'N-3', title: 'Album Selesai Dicetak', desc: 'Vendor cetak konfirmasi box kayu Siska & Bima siap kirim.', time: '1 hari lalu', unread: true, icon: 'package-check', color: 'bg-purple-50 text-purple-600' },
    { id: 'N-4', title: 'Pengingat Jadwal Liputan', desc: 'Technical meeting Akad Tiara & Kevin besok pukul 14:00 WIB.', time: '2 hari lalu', unread: false, icon: 'calendar-clock', color: 'bg-amber-50 text-amber-600' },
  ],

  calendarEvents: [
    { day: 5, title: 'Akad & Resepsi Andini & Reza', type: 'Resepsi', venue: 'Hotel Mulia Senayan', time: '07:00 – 21:00', color: 'bg-[#FFF0E9] text-[#C2410C] border-orange-200' },
    { day: 8, title: 'Prewedding Clara & Dimas', type: 'Prewedding', venue: 'Savana Bromo', time: '05:00 – 16:00', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { day: 12, title: 'Akad Nadia & Fajar', type: 'Akad', venue: 'Plataran Menteng', time: '08:00 – 14:00', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { day: 15, title: 'Intimate Bali – Siska & Bima', type: 'Resepsi', venue: 'Tirtha Uluwatu, Bali', time: '14:00 – 22:00', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { day: 20, title: 'Deadline Teaser Andini & Reza', type: 'Deadline', venue: 'Studio Morevoca', time: '17:00 WIB', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { day: 22, title: 'Engagement Laila & Hendra', type: 'Engagement', venue: 'Glass House Bandung', time: '09:00 – 14:00', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { day: 25, title: 'Meeting Konsep Tiara & Kevin', type: 'Meeting', venue: 'Kopi Nalar / Zoom', time: '15:00 WIB', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { day: 28, title: 'Resepsi Siraman Tiara & Kevin', type: 'Resepsi', venue: 'Ritz-Carlton Pacific Place', time: '08:00 – 21:00', color: 'bg-[#FFF0E9] text-[#C2410C] border-orange-200' },
  ],

  clients: [
    { id: 'CL-1', couple: 'Andini Putri & Reza Mahendra', phone: '+62 812-9041-2210', email: 'andini.reza@gmail.com', date: '5 Nov 2026', package: 'Platinum Akad & Resepsi', payment: 'Lunas', total: 'Rp 28.000.000', venue: 'Hotel Mulia Senayan' },
    { id: 'CL-2', couple: 'Clara Wijaya & Dimas Saputra', phone: '+62 811-8832-1190', email: 'clara.wijaya@gmail.com', date: '8 Nov 2026', package: 'Prewedding Destination', payment: 'Lunas', total: 'Rp 12.500.000', venue: 'Savana Bromo' },
    { id: 'CL-3', couple: 'Nadia Larasati & Fajar Nugroho', phone: '+62 813-4420-8721', email: 'nadia.fajar@gmail.com', date: '12 Nov 2026', package: 'Gold Resepsi + Cinema', payment: 'DP 70%', total: 'Rp 19.500.000', venue: 'Plataran Menteng' },
    { id: 'CL-4', couple: 'Siska Permata & Bima Pratama', phone: '+62 817-6612-0041', email: 'siska.bima@gmail.com', date: '15 Nov 2026', package: 'Intimate Wedding', payment: 'Lunas', total: 'Rp 22.000.000', venue: 'Tirtha Uluwatu, Bali' },
    { id: 'CL-5', couple: 'Tiara Ayu & Kevin Tanoto', phone: '+62 812-7765-9932', email: 'tiara.kevin@gmail.com', date: '28 Nov 2026', package: 'Platinum Akad & Resepsi', payment: 'DP 50%', total: 'Rp 31.000.000', venue: 'Ritz-Carlton PP' },
  ],

  documents: [
    { id: 'DOC-1', title: 'Kontrak Liputan Wedding #2026-041', couple: 'Andini & Reza', type: 'Kontrak Digital', status: 'Ditandatangani', albumStatus: 'Siap Cetak', updated: '18 Nov 2026' },
    { id: 'DOC-2', title: 'Form Pemilihan Foto Album 20x30', couple: 'Clara & Dimas', type: 'Proofing Album', status: 'Disetujui Klien', albumStatus: 'Layout Final', updated: '21 Nov 2026' },
    { id: 'DOC-3', title: 'Kontrak Liputan & Hak Cipta Musik', couple: 'Nadia & Fajar', type: 'Kontrak Digital', status: 'Ditandatangani', albumStatus: 'Menunggu Pilih Foto', updated: '19 Nov 2026' },
    { id: 'DOC-4', title: 'Surat Jalan Pengiriman Box Kayu', couple: 'Siska & Bima', type: 'Pengiriman Album', status: 'Dalam Kurir', albumStatus: 'Selesai Cetak', updated: '24 Nov 2026' },
    { id: 'DOC-5', title: 'Kontrak Paket Platinum #2026-048', couple: 'Tiara & Kevin', type: 'Kontrak Digital', status: 'Menunggu TTD', albumStatus: 'Belum Liputan', updated: '25 Nov 2026' },
  ],
};
