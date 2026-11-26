function renderSiteView() {
  const s = store.settings || {};
  return `<div class="animate-fade-in max-w-2xl">${pageHead('Pengaturan Situs', 'Teks dan kontak yang tampil di website portofolio.')}
  <form onsubmit="saveSite(event)" class="bg-white rounded-2xl shadow-card border border-slate-100 p-5 sm:p-6 space-y-4">
    ${field('Foto utama (hero)', `<div class="flex items-center gap-3"><div id="heroPrev" class="w-24 h-16 rounded-xl bg-slate-100 bg-cover bg-center shrink-0" style="${s.hero_image_url ? `background-image:url('${esc(s.hero_image_url)}')` : ''}"></div>
      <input type="file" accept="image/*" onchange="uploadHero(this)" class="text-xs"></div>`)}
    ${field('Nama brand', `<input name="brand_name" value="${esc(s.brand_name)}" class="${INPUT}">`)}
    ${field('Judul utama', `<input name="hero_title" maxlength="120" value="${esc(s.hero_title)}" class="${INPUT}">`)}
    ${field('Kalimat di bawah judul', `<input name="hero_subtitle" maxlength="200" value="${esc(s.hero_subtitle)}" class="${INPUT}">`)}
    ${field('Tentang kami', `<textarea name="about_text" rows="5" class="${INPUT}">${esc(s.about_text)}</textarea>`)}
    <div class="grid sm:grid-cols-2 gap-3">${field('WhatsApp', `<input name="whatsapp" inputmode="tel" value="${esc(s.whatsapp)}" class="${INPUT}" placeholder="08xxxxxxxxxx">`)}
    ${field('Instagram', `<input name="instagram" value="${esc(s.instagram)}" class="${INPUT}" placeholder="@morevoca">`)}
    ${field('Email', `<input name="email" type="email" value="${esc(s.email)}" class="${INPUT}">`)}
    ${field('Alamat studio', `<input name="address" value="${esc(s.address)}" class="${INPUT}">`)}</div>
    <button class="w-full sm:w-auto px-6 py-3 rounded-xl ${BTN} text-sm font-bold">Simpan</button>
  </form></div>`;
}
async function uploadHero(input) {
  const file = input.files[0]; if (!file) return;
  showToast('Mengunggah foto…');
  const up = await uploadPhoto(file, 'site'); if (!up) return;
  if (await q(db.from('site_settings').update({ hero_image_url: up.url }).eq('id', 1).select())) {
    store.settings.hero_image_url = up.url; document.getElementById('heroPrev').style.backgroundImage = `url('${up.url}')`; showToast('Foto utama diganti', 'success');
  }
}
async function saveSite(e) {
  e.preventDefault(); const f = e.target;
  const row = {}; ['brand_name', 'hero_title', 'hero_subtitle', 'about_text', 'whatsapp', 'instagram', 'email', 'address'].forEach((k) => (row[k] = f[k].value.trim()));
  row.updated_at = new Date().toISOString();
  if (await q(db.from('site_settings').update(row).eq('id', 1).select())) { Object.assign(store.settings, row); showToast('Pengaturan disimpan', 'success'); }
}
