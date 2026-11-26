function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}
const fmtDate = (d, opt) => d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', opt || { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
