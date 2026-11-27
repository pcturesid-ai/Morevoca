document.addEventListener('DOMContentLoaded', async () => {
  const hdr = document.getElementById('hdr');
  const onScroll = () => hdr.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.getElementById('eventChips').innerHTML = EVENT_TYPES.map((t) => `<button type="button" class="chip px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold bg-white text-slate-600" data-v="${t}" aria-pressed="false" onclick="pickEvent(this)">${t}</button>`).join('');
  try {
    const [s, albums, pkgs, testi] = await Promise.all([Api.settings(), Api.albums(), Api.packages(), Api.testimonials()]);
    SETTINGS = s; ALBUMS = albums;
    renderBrand(s); renderAlbums(); renderPackages(pkgs); renderTestimonials(testi);
    if (!s?.hero_image_url && albums[0]?.cover_url) document.getElementById('heroImg').style.backgroundImage = `url("${albums[0].cover_url}")`;
  } catch (e) { console.error(e); renderBrand(null); renderAlbums(); renderPackages([]); renderTestimonials([]); }
  lucide.createIcons();
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* Tab bawah: highlight sesuai posisi scroll */
  (function () {
    const tabs = document.querySelectorAll('nav.tabbar a');
    if (!tabs.length) return;
    const ORDER = ['top', 'album', 'paket', 'tentang', 'testimoni', 'tanya', 'kontak'];
    function tick() {
      const y = window.scrollY + 130;
      let cur = 'top';
      for (const id of ORDER) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      tabs.forEach((a) => {
        const id = (a.getAttribute('href') || '').replace('#', '');
        const active = id === cur || (id === 'top' && cur === 'top');
        a.classList.toggle('text-brand-600', active);
        a.classList.toggle('text-slate-500', !active);
      });
    }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  })();
});
