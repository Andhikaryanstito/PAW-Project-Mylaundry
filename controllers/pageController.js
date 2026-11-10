/**
 * Controller untuk Halaman Web EJS (View)
 * Tugas Praktikum PAW Week 8:
 * Merender halaman frontend secara dinamis dengan EJS dan data langsung dari database PostgreSQL
 */

const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const appConfig = require('../config/appConfig');
const { formatCurrency, formatDateTime } = require('../utils/formatter');

class PageController {
  /**
   * Menampilkan Halaman Utama MyLaundry POS
   * Mengambil data produk langsung dari PostgreSQL via ProductModel
   */
  static async getHomePage(req, res) {
    try {
      const products = await ProductModel.getAll();
      const orders = OrderModel.getAll();
      const stats = OrderModel.getStats();
      const customers = CustomerModel.getAll();

      res.render('index', {
        title: 'MyLaundry POS - Website Kasir UMKM Laundry',
        appConfig,
        currentUser: req.user || res.locals.currentUser || null,
        products,
        orders,
        stats,
        customers,
        formatCurrency,
        formatDateTime
      });
    } catch (err) {
      console.error('[PAGE ERROR] Gagal memuat data dari database PostgreSQL:', err);
      res.status(500).send(`
        <div style="font-family:sans-serif; text-align:center; padding: 50px;">
          <h2 style="color:#e11d48;">Terjadi Kesalahan Koneksi Database</h2>
          <p>${err.message}</p>
          <p>Pastikan server PostgreSQL aktif dan database 'mylaundry' telah tersedia.</p>
        </div>
      `);
    }
  }

  /**
   * Menampilkan Halaman Tester & Dokumentasi API Week 8
   * Memudahkan asisten dan dosen melihat dan menguji endpoint CRUD
   */
  static getApiDocsPage(req, res) {
    res.render('apiDocs', {
      title: 'Dokumentasi & Tester API - Tugas Praktikum Week 8 (CRUD & Database)',
      appConfig
    });
  }
}

module.exports = PageController;
