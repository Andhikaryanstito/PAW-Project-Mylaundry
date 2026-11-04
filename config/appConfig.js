/**
 * Konfigurasi Utama Aplikasi MyLaundry POS
 * Tugas Praktikum PAW - Week 7
 * Penulis: Andhika Ryan Stito (20240140263)
 */

module.exports = {
  appName: 'Website Kasir MyLaundry untuk UMKM Laundry',
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  store: {
    name: 'MyLaundry',
    branch: 'Bantul, D.I. Yogyakarta',
    owner: 'Sarah Anggraini',
    role: 'Pemilik & Kasir Tunggal',
    phone: '081234567890',
    address: 'Jl. Ringroad Selatan, Kasihan, Bantul, Yogyakarta'
  }
};
