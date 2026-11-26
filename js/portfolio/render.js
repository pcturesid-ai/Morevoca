/* Render tiap bagian halaman publik dari data. */
const EVENT_TYPES = ['Pernikahan', 'Akad', 'Resepsi', 'Prewedding', 'Lamaran', 'Lainnya'];
const empty = (text) => `<div class="mx-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">${text}</div>`;

function renderBrand(s) {
  const name = esc(s?.brand_name || 'Morevoca');
  document.title = `${s?.brand_name || 'Morevoca'} — ${s?.tagline || 'Wedding Photography'}`;
  document.querySelectorAll('[data-brand]').forEach((el) => (el.textContent = s?.brand_name || 'Morevoca'));
  document.getElementById('heroTitle').textContent = s?.hero_title || 'Momen pernikahanmu, diabadikan dengan hangat';
  document.getElementById('heroSub').textContent = s?.hero_subtitle || '';
  document.getElementById('aboutText').textContent = s?.about_text || '';
  const img = s?.hero_image_url;
  if (img) document.getElementById('heroImg').style.backgroundImage = `url("${img.replace(/"/g, '%22')}")`;
  const wa = s?.whatsapp, ig = s?.instagram;
  const links = [];
  if (wa) links.push(`<a href="${waLink(wa, 'Halo, saya mau tanya soal jasa foto wedding')}" target="_blank" rel="noopener" class="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500">${icon('message-circle')}<span class="font-semibold text-sm">WhatsApp<br><span class="font-normal text-slate-500">${esc(wa)}</span></span></a>`);
  if (ig) links.push(`<a href="https://instagram.com/${esc(ig.replace('@', ''))}" target="_blank" rel="noopener" class="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-500">${icon('instagram')}<span class="font-semibold text-sm">Instagram<br><span class="font-normal text-slate-500">@${esc(ig.replace('@', ''))}</span></span></a>`);
  if (s?.email) links.push(`<div class="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200">${icon('mail')}<span class="font-semibold text-sm">Email<br><span class="font-normal text-slate-500 select-all">${esc(s.email)}</span></span></div>`);
  if (s?.address) links.push(`<div class="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200">${icon('map-pin')}<span class="font-semibold text-sm">Studio<br><span class="font-normal text-slate-500">${esc(s.address)}</span></span></div>`);
  document.getElementById('contactLinks').innerHTML = links.join('') || '<p class="text-sm text-slate-500">Kontak belum diisi.</p>';
  document.getElementById('heroWa').href = wa ? waLink(wa, 'Halo, saya mau tanya soal jasa foto wedding') : '#kontak';
}

let ALBUMS = [], FILTER = 'Semua';
function renderAlbums() {
  const types = ['Semua', ...EVENT_TYPES.filter((t) => ALBUMS.some((a) => a.event_type === t))];
  document.getElementById('albumFilters').innerHTML = types.length > 2 ? types.map((t) =>
    `<button class="chip shrink-0 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold ${t === FILTER ? 'on' : 'bg-white text-slate-600'}" aria-pressed="${t === FILTER}" onclick="setFilter('${t}')">${t}</button>`).join('') : '';
  const list = ALBUMS.filter((a) => FILTER === 'Semua' || a.event_type === FILTER);
  const el = document.getElementById('albumGrid');
  if (!ALBUMS.length) { el.innerHTML = empty('Album segera hadir. Pantau terus ya!'); return; }
  el.innerHTML = list.map((a) => `
    <button onclick="openAlbum('${a.id}')" class="group text-left rounded-2xl overflow-hidden bg-white border border-slate-200 hover:shadow-lg transition-shadow">
      <div class="aspect-[4/5] bg-slate-100 overflow-hidden">${a.cover_url ? `<img src="${esc(a.cover_url)}" alt="${esc(a.title)}" loading="lazy" class="fade-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onload="this.classList.add('loaded')">` : ''}</div>
      <div class="p-3.5">
        <p class="text-[11px] font-semibold text-brand-600">${esc(a.event_type)}${a.event_date ? ' · ' + esc(fmtDate(a.event_date)) : ''}</p>
        <h3 class="font-bold text-[15px] mt-0.5 leading-snug">${esc(a.couple_names || a.title)}</h3>
        ${a.location ? `<p class="text-xs text-slate-500 mt-0.5">${esc(a.location)}</p>` : ''}
      </div>
    </button>`).join('');
}
function setFilter(t) { FILTER = t; renderAlbums(); lucide.createIcons(); }

let PACKAGES = [];
function renderPackages(list) {
  PACKAGES = list;
  const el = document.getElementById('packageSlider');
  if (!list.length) { el.innerHTML = empty('Paket akan ditampilkan di sini.'); el.className = ''; return; }
  el.innerHTML = list.map((p) => `
    <article class="relative rounded-3xl p-6 flex flex-col ${p.is_popular ? 'bg-brand-600 text-white shadow-xl' : 'bg-white border border-slate-200'}">
      ${p.is_popular ? '<span class="absolute -top-3 left-6 bg-white text-brand-600 border border-brand-500 text-[11px] font-bold px-3 py-1 rounded-full">Paling dipilih</span>' : ''}
      <h3 class="font-bold text-lg">${esc(p.name)}</h3>
      <p class="font-display text-3xl font-extrabold mt-2">${rupiah(p.price)}</p>
      <p class="text-xs mt-1 ${p.is_popular ? 'text-orange-100' : 'text-slate-500'}">DP mulai ${p.dp_percent}% (${rupiah(Math.round(p.price * p.dp_percent / 100))})</p>
      ${p.description ? `<p class="text-sm mt-3 ${p.is_popular ? 'text-orange-50' : 'text-slate-600'}">${esc(p.description)}</p>` : ''}
      <ul class="mt-4 space-y-2 text-sm flex-1">${(p.features || []).map((f) => `<li class="flex gap-2">${icon('check', 'w-4 h-4 mt-0.5 shrink-0')}<span>${esc(f)}</span></li>`).join('')}</ul>
      <button onclick="pickPackage('${p.id}')" class="mt-5 w-full py-3 rounded-xl text-sm font-bold ${p.is_popular ? 'bg-white text-brand-600' : 'bg-brand-600 text-white'}">Pilih paket ini</button>
    </article>`).join('');
  document.getElementById('pkgChips').innerHTML = list.map((p) => `<button type="button" class="chip px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold bg-white text-slate-600" data-id="${p.id}" aria-pressed="false" onclick="togglePkg(this)">${esc(p.name)}</button>`).join('');
}

function renderTestimonials(list) {
  const el = document.getElementById('testiSlider');
  if (!list.length) { el.innerHTML = empty('Belum ada testimoni. Jadilah yang pertama!'); el.className = ''; return; }
  el.innerHTML = list.map((t) => `
    <figure class="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col">
      <div class="text-amber-500 tracking-widest text-sm" aria-label="${t.rating} dari 5">${stars(t.rating)}</div>
      <blockquote class="text-sm text-slate-700 mt-3 leading-relaxed flex-1">“${esc(t.message)}”</blockquote>
      <figcaption class="mt-4 text-sm font-bold">${esc(t.name)}${t.event_type ? `<span class="block font-normal text-xs text-slate-500">${esc(t.event_type)}</span>` : ''}</figcaption>
    </figure>`).join('');
}
