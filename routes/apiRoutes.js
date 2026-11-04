/**
 * Router Endpoint REST API
 * Tugas Praktikum PAW Week 7:
 * - GET /api/status
 * - GET /api/produk
 */

const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

// Wajib Tugas Week 7:
router.get('/status', ApiController.getStatus);
router.get('/produk', ApiController.getProduk);

// Endpoint tambahan untuk mendukung fungsionalitas PRD MyLaundry:
router.get('/antrean', ApiController.getAntrean);
router.post('/pesanan', ApiController.createOrder);
router.patch('/pesanan/:id/status', ApiController.updateStatus);
router.get('/pelanggan', ApiController.getPelanggan);

module.exports = router;
