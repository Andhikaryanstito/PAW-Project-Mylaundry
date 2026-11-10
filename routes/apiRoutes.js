/**
 * Router Endpoint REST API
 * Tugas Praktikum PAW Week 8:
 * Integrasi Database PostgreSQL & Endpoint CRUD:
 * - GET    /api/status      -> Cek status aplikasi & database
 * - GET    /api/produk      -> Read seluruh data produk dari DB
 * - GET    /api/produk/:id  -> Read detail satu produk dari DB
 * - POST   /api/produk      -> Create produk baru ke DB
 * - PUT    /api/produk/:id  -> Update produk di DB
 * - DELETE /api/produk/:id  -> Delete produk dari DB
 */

const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

// ========================================================
// 1. ENDPOINT WAJIB TUGAS WEEK 8 (CRUD PRODUK DATABASE)
// ========================================================
router.get('/status', ApiController.getStatus);
router.get('/produk', ApiController.getProduk);
router.get('/produk/:id', ApiController.getProdukById);
router.post('/produk', ApiController.createProduk);
router.put('/produk/:id', ApiController.updateProduk);
router.delete('/produk/:id', ApiController.deleteProduk);

// ========================================================
// 2. ENDPOINT PENDUKUNG TRANSAKSI POS KASIR MYLAUNDRY
// ========================================================
router.get('/antrean', ApiController.getAntrean);
router.post('/pesanan', ApiController.createOrder);
router.patch('/pesanan/:id/status', ApiController.updateStatus);
router.get('/pelanggan', ApiController.getPelanggan);

module.exports = router;
