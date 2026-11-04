/**
 * Controller API Endpoint
 * Tugas Praktikum PAW Week 7:
 * - GET /api/status -> status aplikasi / server dalam format JSON
 * - GET /api/produk -> data produk dalam bentuk array JSON
 */

const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const appConfig = require('../config/appConfig');

class ApiController {
  /**
   * Endpoint: GET /api/status
   * Mengirimkan status server dan aplikasi dalam format JSON
   */
  static getStatus(req, res) {
    const uptimeSeconds = process.uptime();
    const formattedUptime = `${Math.floor(uptimeSeconds / 60)} menit ${Math.floor(uptimeSeconds % 60)} detik`;

    return res.status(200).json({
      status: 'success',
      message: 'Server MyLaundry POS berjalan normal dan siap menerima transaksi.',
      app: appConfig.appName,
      version: appConfig.version,
      environment: appConfig.env,
      timestamp: new Date().toISOString(),
      uptime: formattedUptime,
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
   * Mengirimkan data produk / paket cucian dalam format array JSON
   */
  static getProduk(req, res) {
    const products = ProductModel.getAll();
    // Mengembalikan langsung array JSON sesuai ketentuan Tugas Week 7
    return res.status(200).json(products);
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
   * Menyimpan transaksi kasir baru ke data model
   */
  static createOrder(req, res) {
    const { name, phone, packageCode, weight, notes, paymentStatus, paymentMethod, readyTime } = req.body;

    if (!name || !phone || !weight) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama pelanggan, nomor WhatsApp, dan berat pakaian wajib diisi.'
      });
    }

    const product = ProductModel.getByCode(packageCode || 'reguler') || ProductModel.getAll()[0];
    const numWeight = parseFloat(weight) || 1;
    const totalPrice = Math.round(numWeight * product.harga);

    const newOrder = OrderModel.create({
      name,
      phone,
      packageCode: product.kode,
      packageName: product.nama,
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
  }

  /**
   * Endpoint Tambahan: PATCH /api/pesanan/:id/status
   * Mengubah status pengerjaan cucian (Diproses -> Siap Diambil -> Selesai)
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
   * Autocomplete pencarian nama pelanggan lama (PRD US-02)
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
