/**
 * ====================================================================
 * ENTRY POINT APLIKASI WEB KASIR MYLAUNDRY (PPAW - WEEK 8)
 * ====================================================================
 * Integrasi Database PostgreSQL, REST API CRUD (/api/produk), 
 * dan Middleware Logger HTTP Request dengan Arsitektur MVC.
 * 
 * Penulis: Andhika Ryan Stito
 * NIM: 20240140263
 * Kelas: PAW TI503P - Kelas D (Individu)
 * ====================================================================
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

// 1. Import Konfigurasi, Database, Middleware, dan Routes
const appConfig = require('./config/appConfig');
const db = require('./config/database');
const requestLogger = require('./middlewares/logger');
const apiRoutes = require('./routes/apiRoutes');
const webRoutes = require('./routes/webRoutes');

// 2. Inisialisasi Express App
const app = express();
const PORT = appConfig.port;

// 3. Konfigurasi View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 4. Pasang Built-in Middleware Express (JSON & URL-Encoded body parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Pasang Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 6. Pasang Custom Middleware Logger (Wajib Tugas Week 7 & 8)
app.use(requestLogger);

// 7. Mendaftarkan Routing Aplikasi
// Endpoint REST API CRUD (/api/status, /api/produk, dll.)
app.use('/api', apiRoutes);

// Endpoint Halaman Web Frontend EJS (/, /api-docs)
app.use('/', webRoutes);

// 8. Error Handler 404 Not Found
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      message: `Endpoint API '${req.originalUrl}' tidak ditemukan.`
    });
  }
  res.status(404).send(`
    <div style="font-family:sans-serif; text-align:center; padding: 50px;">
      <h1 style="color:#e11d48;">404 - Halaman Tidak Ditemukan</h1>
      <p>Halaman yang Anda tuju tidak tersedia di server MyLaundry.</p>
      <a href="/" style="color:#2563eb; font-weight:bold;">← Kembali ke Halaman Utama</a>
    </div>
  `);
});

// 9. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Server]:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal pada server.',
    error: appConfig.env === 'development' ? err.message : undefined
  });
});

// 10. Menjalankan Server Express & Inisialisasi Koneksi Database
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log('==================================================================');
    console.log(`🧺  SERVER MYLAUNDRY POS (WEEK 8 - DATABASE & CRUD) BERJALAN`);
    console.log('==================================================================');
    console.log(`🌐  Alamat Frontend  : http://localhost:${PORT}`);
    console.log(`📡  Endpoint Status  : http://localhost:${PORT}/api/status`);
    console.log(`📦  CRUD Produk API  : http://localhost:${PORT}/api/produk`);
    console.log(`🧪  Interactive Docs : http://localhost:${PORT}/api-docs`);
    console.log(`📝  Middleware Logger: AKTIF (GET, POST, PUT, DELETE, Path, Status)`);
    console.log('------------------------------------------------------------------');
    await db.testConnection();
    console.log('==================================================================\n');
  });
}

module.exports = app;
