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
});
