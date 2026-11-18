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
  { id: 'CUST-07', name: 'Rina Kusuma', phone: '087711223344', note: 'Blazer & rok plisket' }
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
   * Tambah pelanggan baru ke PostgreSQL
   */
  static async create(data) {
    const nextId = `CUST-${String(cachedCustomers.length + 1).padStart(2, '0')}`;
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
    } catch (err) {
      console.warn('[CustomerModel] Gagal simpan ke DB:', err.message);
    }

    cachedCustomers.push(newCust);
    return newCust;
  }
}

module.exports = CustomerModel;
