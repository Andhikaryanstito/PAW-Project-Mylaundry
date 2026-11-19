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
    name: 'MyLaundry POS & Dry Clean',
    branch: 'Cabang Bantul (Ringroad Selatan)',
    owner: 'Sarah Anggraini',
    role: 'Pemilik & Kasir Tunggal',
    phone: '0812-2707-7594',
    address: 'Jl. Ringroad Selatan No. 88, Sewon, Bantul, DIY',
    hours: 'Setiap Hari (08:00 - 21:00 WIB)'
  }
};
