function renderAlbumsAdminView() {
  return `<div class="animate-fade-in">${pageHead('Album Portofolio', 'Satu album untuk satu pasangan/acara. Hanya yang diterbitkan tampil di website.', addBtn('Album baru', 'openAlbumForm()'))}
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">${store.albums.map((a) => `
      <button onclick="openAlbumForm('${a.id}')" class="text-left bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-card-hover transition-shadow">
        <div class="aspect-[4/5] bg-slate-100 relative">${a.cover_url ? `<img src="${esc(a.cover_url)}" alt="" loading="lazy" class="w-full h-full object-cover">` : '<div class="w-full h-full flex items-center justify-center text-slate-300"><i data-lucide="image" class="w-8 h-8"></i></div>'}
          <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-lg ${a.is_published ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}">${a.is_published ? 'Tayang' : 'Draf'}</span></div>
        <div class="p-3"><p class="text-[11px] font-semibold text-[#C2410C]">${esc(a.event_type)}</p><p class="font-bold text-sm text-slate-900 leading-snug">${esc(a.couple_names || a.title)}</p></div></button>`).join('') || `<div class="col-span-full">${emptyBox('Belum ada album. Buat album pertama.')}</div>`}</div></div>`;
}
let ALBUM_EVENT = 'Pernikahan';
function openAlbumForm(id) {
  const a = store.albums.find((x) => x.id === id) || { title: '', couple_names: '', event_type: 'Pernikahan', event_date: '', location: '', description: '', is_published: false };
  ALBUM_EVENT = a.event_type;
  openSheet(id ? 'Ubah album' : 'Album baru', `<form onsubmit="saveAlbum(event,'${id || ''}')" class="space-y-4">
    ${field('Nama pasangan', `<input name="couple" required maxlength="80" value="${esc(a.couple_names || a.title)}" class="${INPUT}" placeholder="Rina & Dimas">`)}
    <div><span class="text-xs font-bold text-slate-700">Jenis acara</span><div class="flex flex-wrap gap-2 mt-2" id="albumTypes">${EVENT_TYPES.map((t) => `<button type="button" data-v="${t}" onclick="pickAlbumType(this)" class="px-3.5 py-2 rounded-full border text-xs font-semibold ${t === a.event_type ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-white text-slate-600 border-slate-200'}">${t}</button>`).join('')}</div></div>
    <div class="grid grid-cols-2 gap-3">${field('Tanggal', `<input type="date" name="date" value="${a.event_date || ''}" class="${INPUT}">`)}${field('Lokasi', `<input name="location" maxlength="80" value="${esc(a.location || '')}" class="${INPUT}">`)}</div>
    ${field('Cerita singkat', `<textarea name="description" rows="3" maxlength="600" class="${INPUT}">${esc(a.description || '')}</textarea>`)}
    <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="pub" ${a.is_published ? 'checked' : ''} class="accent-[#C2410C] w-4 h-4"> Tayangkan di website</label>
    <button class="w-full py-3 rounded-xl ${BTN} text-sm font-bold">${id ? 'Simpan' : 'Buat album & tambah foto'}</button></form>
    ${id ? `<div class="mt-6 pt-5 border-t border-slate-100"><div class="flex items-center justify-between"><h4 class="text-sm font-bold">Foto</h4>
      <label class="inline-flex items-center gap-1.5 ${BTN} text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer"><i data-lucide="upload" class="w-4 h-4"></i>Tambah foto<input type="file" accept="image/*" multiple class="hidden" onchange="uploadAlbumPhotos('${id}',this)"></label></div>
      <div id="albumPhotos" class="grid grid-cols-3 gap-2 mt-3"><p class="col-span-3 text-xs text-slate-400">Memuat…</p></div>
      <button onclick="deleteAlbum('${id}')" class="mt-5 text-xs font-semibold text-rose-600">Hapus album ini</button></div>` : ''}`, true);
  if (id) loadAlbumPhotos(id);
}
function pickAlbumType(btn) { ALBUM_EVENT = btn.dataset.v; document.querySelectorAll('#albumTypes button').forEach((b) => (b.className = `px-3.5 py-2 rounded-full border text-xs font-semibold ${b === btn ? 'bg-[#C2410C] text-white border-[#C2410C]' : 'bg-white text-slate-600 border-slate-200'}`)); }
async function saveAlbum(e, id) {
  e.preventDefault(); const f = e.target;
  const row = { title: f.couple.value.trim(), couple_names: f.couple.value.trim(), event_type: ALBUM_EVENT, event_date: f.date.value || null, location: f.location.value.trim() || null, description: f.description.value.trim() || null, is_published: f.pub.checked };
  if (id) { if (await q(db.from('albums').update(row).eq('id', id).select())) { closeSheet(); await reload('albums'); showToast('Album disimpan', 'success'); } }
  else { const d = await q(db.from('albums').insert(row).select().single()); if (d) { await reload('albums'); showToast('Album dibuat. Tambahkan foto.', 'success'); openAlbumForm(d.id); } }
}
async function loadAlbumPhotos(id) {
  const rows = await q(db.from('album_photos').select('*').eq('album_id', id).order('sort').order('created_at')) || [];
  store.photos[id] = rows;
  const cover = store.albums.find((x) => x.id === id)?.cover_url;
  const el = document.getElementById('albumPhotos'); if (!el) return;
  el.innerHTML = rows.map((p) => `<div class="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
    <img src="${esc(p.url)}" alt="" loading="lazy" class="w-full h-full object-cover">
    ${p.url === cover ? '<span class="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C2410C] text-white">Sampul</span>' : `<button onclick="setCover('${id}','${p.id}')" class="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-1 rounded bg-white/90">Jadikan sampul</button>`}
    <button onclick="deletePhoto('${id}','${p.id}')" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-rose-600 text-sm leading-none" aria-label="Hapus foto">×</button></div>`).join('') || '<p class="col-span-3 text-xs text-slate-400">Belum ada foto.</p>';
}
async function uploadAlbumPhotos(id, input) {
  const files = [...input.files]; if (!files.length) return;
  let ok = 0;
  for (let i = 0; i < files.length; i++) {
    showToast(`Mengunggah ${i + 1} dari ${files.length}…`);
    const up = await uploadPhoto(files[i], 'albums/' + id); if (!up) continue;
    const row = await q(db.from('album_photos').insert({ album_id: id, url: up.url, sort: (store.photos[id]?.length || 0) + ok }).select().single());
    if (row) { ok++; const al = store.albums.find((x) => x.id === id); if (al && !al.cover_url) { await q(db.from('albums').update({ cover_url: up.url }).eq('id', id).select()); al.cover_url = up.url; } }
  }
  input.value = ''; await loadAlbumPhotos(id); await reload('albums'); showToast(`${ok} foto terunggah`, 'success');
}
async function setCover(albumId, photoId) {
  const p = store.photos[albumId].find((x) => x.id === photoId);
  if (await q(db.from('albums').update({ cover_url: p.url }).eq('id', albumId).select())) { store.albums.find((x) => x.id === albumId).cover_url = p.url; loadAlbumPhotos(albumId); reload('albums'); showToast('Sampul diganti', 'success'); }
}
async function deletePhoto(albumId, photoId) {
  const p = store.photos[albumId].find((x) => x.id === photoId);
  await q(db.from('album_photos').delete().eq('id', photoId).select());
  const path = pathFromUrl(p.url); if (path) await db.storage.from('portfolio').remove([path]);
  const al = store.albums.find((x) => x.id === albumId);
  if (al?.cover_url === p.url) { const next = store.photos[albumId].find((x) => x.id !== photoId); await q(db.from('albums').update({ cover_url: next?.url || null }).eq('id', albumId).select()); al.cover_url = next?.url || null; }
  await loadAlbumPhotos(albumId); reload('albums');
}
function deleteAlbum(id) {
  askConfirm('Hapus album beserta semua fotonya?', async () => {
    const paths = (store.photos[id] || []).map((p) => pathFromUrl(p.url)).filter(Boolean);
    if (paths.length) await db.storage.from('portfolio').remove(paths);
    await q(db.from('albums').delete().eq('id', id).select()); reload('albums'); showToast('Album dihapus', 'success');
  });
}
