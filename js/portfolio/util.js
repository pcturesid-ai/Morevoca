const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const waNumber = (s) => { let n = String(s || '').replace(/\D/g, ''); if (n.startsWith('0')) n = '62' + n.slice(1); return n; };
const waLink = (num, text) => `https://wa.me/${waNumber(num)}?text=${encodeURIComponent(text || '')}`;
const stars = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
const icon = (name, cls = 'w-5 h-5') => `<i data-lucide="${name}" class="${cls}"></i>`;
function toast(msg, ok = true) {
  const t = document.createElement('div');
  t.className = `fixed left-1/2 -translate-x-1/2 bottom-24 z-[80] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg text-white ${ok ? 'bg-emerald-600' : 'bg-rose-600'}`;
  t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
}
