/**
 * Router Halaman Web (Frontend EJS)
 * Menghubungkan URL browser ke Controller View dan Autentikasi
 */

const express = require('express');
const router = express.Router();
const PageController = require('../controllers/pageController');
const AuthController = require('../controllers/authController');
const { requireAuth, guestOnly } = require('../middlewares/auth');

// Halaman Login & Logout Kasir
router.get('/login', guestOnly, AuthController.getLoginPage);
router.post('/login', AuthController.postLogin);
router.get('/logout', AuthController.logout);

// Halaman utama kasir MyLaundry (Diproteksi: harus login terlebih dahulu)
router.get('/', requireAuth, PageController.getHomePage);

// Halaman pengujian REST API & Middleware Logger
router.get('/api-docs', PageController.getApiDocsPage);

module.exports = router;
