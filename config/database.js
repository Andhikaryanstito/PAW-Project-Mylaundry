/**
 * Database Configuration & Connection Pool (PostgreSQL)
 * Tugas Praktikum PAW - Week 8 (Integrasi Database & CRUD)
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi Pool PostgreSQL dengan fallback nilai default
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'mylaundry',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Listener saat koneksi pool berhasil dibuat
pool.on('connect', () => {
  // Hanya log sekali saat initial connect jika diperlukan
});

pool.on('error', (err) => {
  console.error('[DB ERROR] Kesalahan tidak terduga pada PostgreSQL Client:', err.message);
});

/**
 * Helper function untuk mengeksekusi query SQL dengan parameterized query (aman dari SQL Injection)
 * @param {string} text - Query SQL
 * @param {Array} params - Parameter nilai
 * @returns {Promise<any>}
 */
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // Opsional debug query di development
  // console.log(`[SQL EXEC] ${duration}ms | rows: ${res.rowCount}`);
  return res;
};

/**
 * Fungsi untuk menguji koneksi database saat server pertama kali start
 */
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name');
    console.log(`[DATABASE] Berhasil terhubung ke PostgreSQL! DB: ${res.rows[0].db_name} | Waktu: ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    console.error(`[DATABASE ERROR] Gagal terhubung ke PostgreSQL: ${err.message}`);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
