/**
 * Model Produk / Layanan MyLaundry (PostgreSQL Version)
 * Tugas Praktikum PAW - Week 8 (Integrasi Database & CRUD)
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 * Mengelola operasi CRUD langsung ke tabel `products` di PostgreSQL
 */

const db = require('../config/database');

class ProductModel {
  /**
   * Mengambil semua daftar produk / paket layanan dari database
   * @returns {Promise<Array>}
   */
  static async getAll() {
    const sql = 'SELECT * FROM products ORDER BY id ASC';
    const result = await db.query(sql);
    return result.rows;
  }

  /**
   * Cari produk berdasarkan ID (Primary Key)
   * @param {number|string} id
   * @returns {Promise<object|null>}
   */
  static async getById(id) {
    const sql = 'SELECT * FROM products WHERE id = $1';
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Cari produk berdasarkan kode unik (misal: 'reguler', 'kilat')
   * @param {string} kode
   * @returns {Promise<object|null>}
   */
  static async getByCode(kode) {
    if (!kode) return null;
    const sql = 'SELECT * FROM products WHERE LOWER(kode) = LOWER($1) LIMIT 1';
    const result = await db.query(sql, [kode.trim()]);
    return result.rows[0] || null;
  }

  /**
   * Menambahkan data produk / paket baru ke database (CREATE)
   * @param {object} data
   * @returns {Promise<object>}
   */
  static async create(data) {
    const {
      kode,
      nama,
      kategori = 'Kiloan',
      harga,
      satuan = 'kg',
      estimasi_jam = 24,
      durasi_label,
      deskripsi = '',
      badge = '',
      is_populer = false,
      icon = '🧺'
    } = data;

    // Generate kode unik otomatis jika tidak disediakan
    const cleanKode = kode ? kode.trim().toLowerCase() : (nama.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString().slice(-4));
    const finalDurasi = durasi_label || `${estimasi_jam} Jam`;

    const sql = `
      INSERT INTO products 
        (kode, nama, kategori, harga, satuan, estimasi_jam, durasi_label, deskripsi, badge, is_populer, icon, created_at, updated_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      cleanKode,
      nama,
      kategori,
      parseInt(harga, 10),
      satuan,
      parseInt(estimasi_jam, 10),
      finalDurasi,
      deskripsi,
      badge,
      Boolean(is_populer),
      icon
    ];

    const result = await db.query(sql, values);
    return result.rows[0];
  }

  /**
   * Memperbarui data produk berdasarkan ID (UPDATE)
   * @param {number|string} id
   * @param {object} data
   * @returns {Promise<object|null>}
   */
  static async update(id, data) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const {
      nama = existing.nama,
      kategori = existing.kategori,
      harga = existing.harga,
      satuan = existing.satuan,
      estimasi_jam = existing.estimasi_jam,
      durasi_label = existing.durasi_label,
      deskripsi = existing.deskripsi,
      badge = existing.badge,
      is_populer = existing.is_populer,
      icon = existing.icon
    } = data;

    const sql = `
      UPDATE products 
      SET 
        nama = $1,
        kategori = $2,
        harga = $3,
        satuan = $4,
        estimasi_jam = $5,
        durasi_label = $6,
        deskripsi = $7,
        badge = $8,
        is_populer = $9,
        icon = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const values = [
      nama,
      kategori,
      parseInt(harga, 10),
      satuan,
      parseInt(estimasi_jam, 10),
      durasi_label,
      deskripsi,
      badge,
      Boolean(is_populer),
      icon,
      id
    ];

    const result = await db.query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Menghapus data produk berdasarkan ID (DELETE)
   * @param {number|string} id
   * @returns {Promise<object|null>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Hitung kalkulasi pesanan berdasarkan kode paket dan berat
   * @param {string} kode
   * @param {number} weight
   * @returns {Promise<object>}
   */
  static async calculate(kode, weight) {
    let product = await this.getByCode(kode);
    if (!product) {
      const all = await this.getAll();
      product = all[0];
    }
    const parsedWeight = parseFloat(weight) || 1;
    const totalHarga = Math.round(parsedWeight * (product ? product.harga : 7000));
    return {
      product,
      weight: parsedWeight,
      totalHarga
    };
  }
}

module.exports = ProductModel;
