/**
 * Controller API Endpoint
 * Tugas Praktikum PAW Week 8:
 * - Integrasi Database PostgreSQL & Operasi CRUD Lengkap:
 *   1. GET    /api/status      -> Status aplikasi & koneksi database
 *   2. GET    /api/produk      -> Tampil semua produk dari DB (Array JSON)
 *   3. GET    /api/produk/:id  -> Detail 1 produk berdasarkan ID dari DB
 *   4. POST   /api/produk      -> Tambah produk baru ke DB
 *   5. PUT    /api/produk/:id  -> Perbarui data produk di DB
 *   6. DELETE /api/produk/:id  -> Hapus data produk dari DB
 */

const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const appConfig = require('../config/appConfig');
const db = require('../config/database');

class ApiController {
  /**
   * Endpoint: GET /api/status
   * Mengirimkan status server, aplikasi, dan koneksi database dalam format JSON
   */
  static async getStatus(req, res) {
    const uptimeSeconds = process.uptime();
    const formattedUptime = `${Math.floor(uptimeSeconds / 60)} menit ${Math.floor(uptimeSeconds % 60)} detik`;

    let dbStatus = 'connected';
    try {
      await db.query('SELECT 1');
    } catch (err) {
      dbStatus = `disconnected (${err.message})`;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Server MyLaundry POS berjalan normal dan terhubung ke Database.',
      app: appConfig.appName,
      version: '2.0.0 (Week 8 - Database & CRUD)',
      environment: appConfig.env,
      timestamp: new Date().toISOString(),
      uptime: formattedUptime,
      database: {
        engine: 'PostgreSQL',
        status: dbStatus,
        databaseName: process.env.DB_NAME || 'mylaundry'
      },
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      },
      store: {
        name: appConfig.store.name,
        branch: appConfig.store.branch,
        owner: appConfig.store.owner
      }
    });
  }

  /**
   * Endpoint: GET /api/produk
   * Mengambil dan menampilkan seluruh data produk dari database PostgreSQL
   */
  static async getProduk(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).json(products);
    } catch (err) {
      console.error('[API ERROR] Gagal mengambil data produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data produk dari database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: GET /api/produk/:id
   * Mengambil detail satu data produk berdasarkan ID dari database
   */
  static async getProdukById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan di database.`
        });
      }

      return res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (err) {
      console.error('[API ERROR] Gagal mengambil detail produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server saat mengambil detail produk.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: POST /api/produk
   * Menambahkan data produk baru ke dalam database PostgreSQL (CREATE)
   */
  static async createProduk(req, res) {
    try {
      const { nama, harga, kategori, satuan, estimasi_jam, durasi_label, deskripsi, badge, icon, kode } = req.body;

      if (!nama || harga === undefined || harga === null || harga === '') {
        return res.status(400).json({
          status: 'error',
          message: 'Nama produk dan harga wajib diisi.'
        });
      }

      const newProduct = await ProductModel.create({
        nama,
        harga,
        kategori: kategori || 'Kiloan',
        satuan: satuan || 'kg',
        estimasi_jam: estimasi_jam || 24,
        durasi_label: durasi_label || `${estimasi_jam || 24} Jam`,
        deskripsi: deskripsi || '',
        badge: badge || '',
        icon: icon || '🧺',
        kode: kode || undefined
      });

      return res.status(201).json({
        status: 'success',
        message: 'Produk berhasil ditambahkan ke database PostgreSQL.',
        data: newProduct
      });
    } catch (err) {
      console.error('[API ERROR] Gagal menambahkan produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan data produk ke database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: PUT /api/produk/:id
   * Memperbarui data produk berdasarkan ID di database (UPDATE)
   */
  static async updateProduk(req, res) {
    try {
      const { id } = req.params;
      const { nama, harga, kategori, satuan, estimasi_jam, durasi_label, deskripsi, badge, icon } = req.body;

      const existing = await ProductModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan, tidak dapat diperbarui.`
        });
      }

      const updated = await ProductModel.update(id, {
        nama,
        harga,
        kategori,
        satuan,
        estimasi_jam,
        durasi_label,
        deskripsi,
        badge,
        icon
      });

      return res.status(200).json({
        status: 'success',
        message: `Data produk ID ${id} berhasil diperbarui di database.`,
        data: updated
      });
    } catch (err) {
      console.error('[API ERROR] Gagal memperbarui produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui data produk di database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: DELETE /api/produk/:id
   * Menghapus data produk berdasarkan ID dari database (DELETE)
   */
  static async deleteProduk(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProductModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan atau sudah dihapus sebelumnya.`
        });
      }

      return res.status(200).json({
        status: 'success',
        message: `Produk '${deleted.nama}' (ID ${id}) berhasil dihapus dari database.`,
        data: deleted
      });
    } catch (err) {
      console.error('[API ERROR] Gagal menghapus produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus produk dari database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint Tambahan: GET /api/antrean
   * Mengambil data seluruh antrean cucian dan ringkasan statistik toko
   */
  static getAntrean(req, res) {
    const orders = OrderModel.getAll();
    const stats = OrderModel.getStats();

    return res.status(200).json({
      status: 'success',
      stats: stats,
      total: orders.length,
      data: orders
    });
  }

  /**
   * Endpoint Tambahan: POST /api/pesanan
   * Menyimpan transaksi kasir baru
   */
  static async createOrder(req, res) {
    try {
      const { name, phone, packageCode, weight, notes, paymentStatus, paymentMethod, readyTime } = req.body;

      if (!name || !phone || !weight) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama pelanggan, nomor WhatsApp, dan berat pakaian wajib diisi.'
        });
      }

      const product = (await ProductModel.getByCode(packageCode || 'reguler')) || (await ProductModel.getAll())[0];
      const numWeight = parseFloat(weight) || 1;
      const totalPrice = Math.round(numWeight * (product ? product.harga : 7000));

      const newOrder = OrderModel.create({
        name,
        phone,
        packageCode: product ? product.kode : 'reguler',
        packageName: product ? product.nama : 'Cuci Reguler',
        weight: numWeight,
        price: totalPrice,
        notes,
        paymentStatus,
        paymentMethod,
        readyTime
      });

      return res.status(201).json({
        status: 'success',
        message: 'Transaksi kasir berhasil disimpan.',
        data: newOrder
      });
    } catch (err) {
      console.error('Error create order:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * Endpoint Tambahan: PATCH /api/pesanan/:id/status
   */
  static updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status baru wajib disertakan.'
      });
    }

    const updated = OrderModel.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: `Pesanan dengan ID ${id} tidak ditemukan.`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Status pesanan ${id} berhasil diubah menjadi ${status}.`,
      data: updated
    });
  }

  /**
   * Endpoint Tambahan: GET /api/pelanggan
   */
  static getPelanggan(req, res) {
    const { q } = req.query;
    if (q) {
      return res.status(200).json(CustomerModel.search(q));
    }
    return res.status(200).json(CustomerModel.getAll());
  }
}

module.exports = ApiController;
