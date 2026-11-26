/* Detail album + penampil foto layar penuh. */
let LB = { photos: [], i: 0 };
async function openAlbum(id) {
  const a = ALBUMS.find((x) => x.id === id); if (!a) return;
  const photos = await Api.photos(id);
  LB = { photos: photos.length ? photos : (a.cover_url ? [{ url: a.cover_url }] : []), i: 0, album: a };
  const box = document.getElementById('albumModal');
  document.getElementById('albumModalBody').innerHTML = `
    <p class="text-xs font-semibold text-brand-600">${esc(a.event_type)}${a.event_date ? ' · ' + esc(fmtDate(a.event_date)) : ''}</p>
    <h3 class="text-xl font-extrabold mt-1">${esc(a.couple_names || a.title)}</h3>
    ${a.location ? `<p class="text-sm text-slate-500 mt-1">${esc(a.location)}</p>` : ''}
    ${a.description ? `<p class="text-sm text-slate-600 mt-3 leading-relaxed">${esc(a.description)}</p>` : ''}
    <div class="grid grid-cols-2 gap-2 mt-5">${LB.photos.map((p, k) => `<button onclick="openPhoto(${k})" class="rounded-xl overflow-hidden bg-slate-100 ${k % 5 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'}"><img src="${esc(p.url)}" alt="${esc(p.caption || a.title)}" loading="lazy" class="fade-img w-full h-full object-cover" onload="this.classList.add('loaded')"></button>`).join('') || '<p class="col-span-2 text-sm text-slate-500">Foto belum ditambahkan.</p>'}</div>`;
  box.hidden = false; document.body.style.overflow = 'hidden';
}
function closeAlbum() { document.getElementById('albumModal').hidden = true; document.body.style.overflow = ''; }
function openPhoto(i) { LB.i = i; const lb = document.getElementById('lightbox'); lb.hidden = false; showPhoto(); }
function showPhoto() {
  const p = LB.photos[LB.i]; if (!p) return;
  document.getElementById('lbImg').src = p.url;
  document.getElementById('lbCount').textContent = `${LB.i + 1} / ${LB.photos.length}`;
}
function stepPhoto(d) { LB.i = (LB.i + d + LB.photos.length) % LB.photos.length; showPhoto(); }
function closePhoto() { document.getElementById('lightbox').hidden = true; }
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').hidden) { if (e.key === 'Escape') closePhoto(); if (e.key === 'ArrowRight') stepPhoto(1); if (e.key === 'ArrowLeft') stepPhoto(-1); }
  else if (!document.getElementById('albumModal').hidden && e.key === 'Escape') closeAlbum();
});
(() => { let x = 0; const lb = () => document.getElementById('lightbox');
  document.addEventListener('touchstart', (e) => { if (!lb().hidden) x = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => { if (lb().hidden) return; const dx = e.changedTouches[0].clientX - x; if (Math.abs(dx) > 50) stepPhoto(dx < 0 ? 1 : -1); });
})();
