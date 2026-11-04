/**
 * Controller untuk Halaman Web EJS (View)
 * Tugas Praktikum PAW Week 7:
 * Merender halaman frontend secara dinamis dengan EJS dan data dari backend
 */

const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const appConfig = require('../config/appConfig');
const { formatCurrency, formatDateTime } = require('../utils/formatter');

class PageController {
  /**
   * Menampilkan Halaman Utama MyLaundry POS
   * Mengirimkan data produk, antrean, statistik, dan pelanggan langsung dari backend
   */
  static getHomePage(req, res) {
    const products = ProductModel.getAll();
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
  }

  /**
   * Menampilkan Halaman Tester & Dokumentasi API Week 7
   * Memudahkan asisten dan dosen melihat hasil endpoint /api/status dan /api/produk
   */
  static getApiDocsPage(req, res) {
    res.render('apiDocs', {
      title: 'Dokumentasi & Tester API - Tugas Praktikum Week 7',
      appConfig
    });
  }
}

module.exports = PageController;
