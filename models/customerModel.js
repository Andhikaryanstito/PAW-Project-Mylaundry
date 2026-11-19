/**
 * Model Data Pelanggan Langganan (PostgreSQL Version)
 * Sesuai PRD US-02: Fitur saran otomatis nama & nomor WhatsApp
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

const db = require('../config/database');

let cachedCustomers = [
  { id: 'CUST-01', name: 'Budi Santoso', phone: '081234567890', note: 'Langganan kemeja kantor' },
  { id: 'CUST-02', name: 'Siti Rahmawati', phone: '085712345678', note: 'Gamis & jilbab lembut' },
  { id: 'CUST-03', name: 'Mas Dimas (Kost Putra)', phone: '089698765432', note: 'Pakaian futsal & celana jeans' },
  { id: 'CUST-04', name: 'Ibu Ratna Dewi', phone: '081388990011', note: 'Sprei king size & selimut tebal' },
  { id: 'CUST-05', name: 'Ahmad Fauzi', phone: '082155443322', note: 'Kaos oblong & jaket hoodie' },
  { id: 'CUST-06', name: 'Pak Bambang', phone: '081223344556', note: 'Kemeja batik & dinas' },
  { id: 'CUST-07', name: 'Rina Kusuma', phone: '087711223344', note: 'Blazer & rok plisket' },
  { id: 'CUST-08', name: 'Yoga Pratama', phone: '085299887766', note: 'Pakaian kasual harian' },
  { id: 'CUST-09', name: 'Lestari Putri', phone: '081900112233', note: 'Gamis & pakaian kerja' },
  { id: 'CUST-10', name: 'Dedi Setiawan', phone: '083812345678', note: 'Kaos & kemeja santai' }
];

// Sinkronkan cache dari database PostgreSQL saat file dimuat
(async () => {
  try {
    const res = await db.query('SELECT * FROM customers ORDER BY id ASC');
    if (res.rows && res.rows.length > 0) {
      cachedCustomers = res.rows;
    }
  } catch (err) {
    // Gunakan fallback default jika koneksi belum siap
  }
})();

class CustomerModel {
  /**
   * Mengambil semua pelanggan dari PostgreSQL
   */
  static async getAllFromDb() {
    try {
      const res = await db.query('SELECT * FROM customers ORDER BY id ASC');
      if (res.rows) {
        cachedCustomers = res.rows;
        return res.rows;
      }
    } catch (err) {
      console.warn('[CustomerModel] Fallback cache:', err.message);
    }
    return cachedCustomers;
  }

  /**
   * Mengambil daftar pelanggan (kompatibel sync & async)
   */
  static getAll() {
    return cachedCustomers;
  }

  /**
   * Cari pelanggan berdasarkan nama atau no WA
   */
  static search(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return cachedCustomers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }

  /**
   * Mengambil ID berikutnya secara aman berdasarkan nilai maksimum yang ada di database
   */
  static async getNextId() {
    let maxNum = 0;
    try {
      const res = await db.query("SELECT id FROM customers WHERE id ~ '^CUST-[0-9]+$'");
      if (res.rows) {
        res.rows.forEach(r => {
          const num = parseInt(r.id.replace('CUST-', ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });
      }
    } catch (e) {
      // fallback
    }
    cachedCustomers.forEach(r => {
      const num = parseInt((r.id || '').replace('CUST-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `CUST-${String(maxNum + 1).padStart(2, '0')}`;
  }

  /**
   * Tambah pelanggan baru ke PostgreSQL
   */
  static async create(data) {
    const nextId = await this.getNextId();
    const newCust = {
      id: nextId,
      name: data.name,
      phone: data.phone,
      note: data.note || '-'
    };

    try {
      await db.query(
        'INSERT INTO customers (id, name, phone, note) VALUES ($1, $2, $3, $4)',
        [newCust.id, newCust.name, newCust.phone, newCust.note]
      );
      console.log(`[CustomerModel] ✅ Berhasil menyimpan pelanggan ${newCust.id} (${newCust.name}) ke PostgreSQL.`);
    } catch (err) {
      console.error('[CustomerModel] Gagal simpan ke DB:', err.message);
    }

    cachedCustomers.push(newCust);
    return newCust;
  }

  /**
   * Perbarui data pelanggan di PostgreSQL dan cache (UPDATE)
   */
  static async update(id, data) {
    const { name, phone, note } = data;
    try {
      await db.query(
        'UPDATE customers SET name=$1, phone=$2, note=$3 WHERE id=$4',
        [name, phone, note || '-', id]
      );
    } catch (err) {
      console.warn('[CustomerModel] Gagal update DB:', err.message);
    }
    const idx = cachedCustomers.findIndex(c => c.id === id);
    if (idx !== -1) cachedCustomers[idx] = { ...cachedCustomers[idx], name, phone, note: note || '-' };
    return cachedCustomers[idx] || null;
  }

  /**
   * Hapus pelanggan dari PostgreSQL dan cache (DELETE)
   */
  static async delete(id) {
    try {
      await db.query('DELETE FROM customers WHERE id=$1', [id]);
    } catch (err) {
      console.warn('[CustomerModel] Gagal hapus dari DB:', err.message);
    }
    const idx = cachedCustomers.findIndex(c => c.id === id);
    if (idx !== -1) cachedCustomers.splice(idx, 1);
    return true;
  }
}

module.exports = CustomerModel;
