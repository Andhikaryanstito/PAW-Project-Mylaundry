/**
 * Model Produk / Layanan MyLaundry
 * Tugas Praktikum PAW Week 7 & Sesuai PRD (Andhika Ryan Stito - 20240140263)
 * Data produk dikelola melalui Model (array statis)
 */

const products = [
  {
    id: 'PRD-001',
    kode: 'reguler',
    nama: 'Cuci Reguler',
    kategori: 'Kiloan',
    harga: 7000,
    satuan: 'kg',
    estimasi_jam: 48,
    durasi_label: '2 - 3 Hari',
    deskripsi: 'Cuci bersih higienis, pengeringan maksimal, dan setrika uap rapi bergaransi.',
    badge: 'Paling Hemat',
    is_populer: true,
    icon: '🧺'
  },
  {
    id: 'PRD-002',
    kode: 'kilat',
    nama: 'Cuci Kilat',
    kategori: 'Kiloan',
    harga: 10000,
    satuan: 'kg',
    estimasi_jam: 24,
    durasi_label: '1 Hari (24 Jam)',
    deskripsi: 'Proses cuci dan pengeringan cepat wangi tahan lama, cocok untuk kebutuhan mendesak.',
    badge: '1 Hari Selesai',
    is_populer: false,
    icon: '⚡'
  },
  {
    id: 'PRD-003',
    kode: 'express',
    nama: 'Cuci Ekspress',
    kategori: 'Kiloan',
    harga: 15000,
    satuan: 'kg',
    estimasi_jam: 6,
    durasi_label: '6 Jam',
    deskripsi: 'Prioritas utama antrean mesin. Pakaian langsung dicuci, dikeringkan & disetrika instan.',
    badge: 'Prioritas Kilat',
    is_populer: false,
    icon: '🚀'
  }
];

class ProductModel {
  /**
   * Mengambil semua daftar produk / paket layanan (3 paket resmi sesuai PRD & Figma)
   * @returns {Array}
   */
  static getAll() {
    return products;
  }

  /**
   * Cari produk berdasarkan ID
   * @param {string} id
   * @returns {object|null}
   */
  static getById(id) {
    return products.find(p => p.id === id) || null;
  }

  /**
   * Cari produk berdasarkan kode unik (reguler, kilat, express)
   * @param {string} kode
   * @returns {object|null}
   */
  static getByCode(kode) {
    return products.find(p => p.kode.toLowerCase() === kode.toLowerCase()) || null;
  }

  /**
   * Hitung estimasi harga dan waktu
   * @param {string} kode
   * @param {number} weight
   * @returns {object|null}
   */
  static calculate(kode, weight) {
    const product = this.getByCode(kode) || products[0];
    const totalHarga = Math.round(weight * product.harga);
    return {
      product,
      weight,
      totalHarga
    };
  }
}

module.exports = ProductModel;
