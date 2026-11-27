/* Akses data publik dari Supabase. Mengembalikan kosong bila belum tersambung. */
const Api = {
  async settings() {
    if (!window.db) return null;
    const { data } = await db.from('site_settings').select('*').eq('id', 1).maybeSingle();
    return data;
  },
  async albums() {
    if (!window.db) return [];
    const { data } = await db.from('albums').select('*').order('sort').order('created_at', { ascending: false });
    return data || [];
  },
  async photos(albumId) {
    if (!window.db) return [];
    const { data } = await db.from('album_photos').select('*').eq('album_id', albumId).order('sort');
    return data || [];
  },
  async packages() {
    if (!window.db) return [];
    const { data } = await db.from('packages').select('*').order('sort');
    return data || [];
  },
  async testimonials() {
    if (!window.db) return [];
    const { data } = await db.from('testimonials').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    return data || [];
  },
  async sendInquiry(row) {
    if (!window.db) return { error: { message: 'Database belum tersambung' } };
    return db.from('inquiries').insert(row);
  },
  async sendTestimonial(row) {
    if (!window.db) return { error: { message: 'Database belum tersambung' } };
    return db.from('testimonials').insert(row);
  }
};
