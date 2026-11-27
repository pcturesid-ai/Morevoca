/* Form tanya-tanya (jadi calon klien) dan form testimoni. */
let SETTINGS = null, CHOSEN_EVENT = '', CHOSEN_PKG = '';
function pickPackage(id) { document.querySelectorAll('#pkgChips .chip').forEach((c) => { const on = c.dataset.id === id; c.setAttribute('aria-pressed', on); c.classList.toggle('on', on); }); CHOSEN_PKG = id; document.getElementById('tanya').scrollIntoView(); }
function togglePkg(btn) { const on = btn.getAttribute('aria-pressed') !== 'true'; document.querySelectorAll('#pkgChips .chip').forEach((c) => { c.setAttribute('aria-pressed', false); c.classList.remove('on'); }); if (on) { btn.setAttribute('aria-pressed', true); btn.classList.add('on'); } CHOSEN_PKG = on ? btn.dataset.id : ''; }
function pickEvent(btn) { document.querySelectorAll('#eventChips .chip').forEach((c) => { c.setAttribute('aria-pressed', false); c.classList.remove('on'); }); btn.setAttribute('aria-pressed', true); btn.classList.add('on'); CHOSEN_EVENT = btn.dataset.v; }

async function submitInquiry(e) {
  e.preventDefault();
  const f = e.target, btn = f.querySelector('button[type=submit]');
  const row = { name: f.name.value.trim(), whatsapp: f.whatsapp.value.trim(), event_type: CHOSEN_EVENT || null, event_date: f.event_date.value || null, package_id: CHOSEN_PKG || null, message: f.message.value.trim() || null };
  btn.disabled = true; btn.textContent = 'Mengirim…';
  const { error } = await Api.sendInquiry(row);
  btn.disabled = false; btn.textContent = 'Kirim pertanyaan';
  if (error) { toast('Gagal mengirim. Coba lewat WhatsApp ya.', false); return; }
  const pkg = PACKAGES.find((p) => p.id === CHOSEN_PKG);
  f.reset(); CHOSEN_EVENT = ''; CHOSEN_PKG = '';
  document.querySelectorAll('#eventChips .chip, #pkgChips .chip').forEach((c) => { c.setAttribute('aria-pressed', false); c.classList.remove('on'); });
  document.getElementById('inquiryDone').hidden = false;
  const wa = SETTINGS?.whatsapp;
  const a = document.getElementById('inquiryWa'); a.hidden = !wa;
  if (wa) a.href = waLink(wa, `Halo, saya ${row.name}. Baru kirim pertanyaan lewat web${pkg ? ' untuk ' + pkg.name : ''}.`);
  toast('Terkirim! Kami segera menghubungi kamu.');
}

let RATING = 5;
function setRating(n) { RATING = n; document.querySelectorAll('#ratingBtns button').forEach((b, i) => { b.style.color = i < n ? '#F59E0B' : '#CBD5E1'; }); }
function openTesti() { document.getElementById('testiModal').hidden = false; document.body.style.overflow = 'hidden'; setRating(5); }
function closeTesti() { document.getElementById('testiModal').hidden = true; document.body.style.overflow = ''; }
async function submitTesti(e) {
  e.preventDefault(); const f = e.target;
  const { error } = await Api.sendTestimonial({ name: f.name.value.trim(), event_type: f.event_type.value.trim() || null, rating: RATING, message: f.message.value.trim() });
  if (error) { toast('Gagal mengirim testimoni.', false); return; }
  f.reset(); closeTesti(); toast('Terima kasih! Testimoni tampil setelah disetujui.');
}
