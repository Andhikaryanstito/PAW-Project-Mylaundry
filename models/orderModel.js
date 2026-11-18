/**
 * Model Antrean & Pesanan Laundry (OrderModel - PostgreSQL Connected)
 * Mengelola antrean kasir dan status cucian toko langsung ke tabel `orders` di PostgreSQL
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

const db = require('../config/database');
const { formatDateTime } = require('../utils/formatter');

// In-memory cache yang otomatis disinkronkan dari database PostgreSQL
let cachedOrders = [
  {
    id: '#ORD-102',
    name: 'Budi Santoso',
    phone: '081234567890',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 3.5,
    price: 24500,
    notes: 'Kemeja kantor & celana katun',
    readyTime: 'Hari Ini, 16:00 WIB',
    status: 'Diproses',
    paymentStatus: 'Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date().toISOString()
  }
];

// Helper mapping kolom database (snake_case) ke format model (camelCase)
function mapDbRow(r) {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    packageCode: r.package_code || 'reguler',
    packageName: r.package_name || 'Cuci Reguler',
    weight: parseFloat(r.weight) || 0,
    price: parseInt(r.price, 10) || 0,
    notes: r.notes || '-',
    readyTime: r.ready_time || 'Hari Ini',
    status: r.status || 'Diproses',
    paymentStatus: r.payment_status || 'Lunas',
    paymentMethod: r.payment_method || 'Tunai',
    createdAt: r.created_at || new Date().toISOString()
  };
}

// Inisialisasi sinkronisasi dari database PostgreSQL saat file dimuat
(async () => {
  try {
    const res = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    if (res.rows && res.rows.length > 0) {
      cachedOrders = res.rows.map(mapDbRow);
    }
  } catch (err) {
    // Gunakan fallback jika tabel belum siap
  }
})();

class OrderModel {
  /**
   * Mengambil seluruh pesanan dari PostgreSQL
   */
  static async getAllFromDb() {
    try {
      const res = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
      if (res.rows && res.rows.length > 0) {
        cachedOrders = res.rows.map(mapDbRow);
        return cachedOrders;
      }
    } catch (err) {
      console.warn('[OrderModel] Menggunakan cache:', err.message);
    }
    return cachedOrders;
  }

  /**
   * Mengambil seluruh pesanan (sinkron cepat / kompatibel)
   */
  static getAll() {
    return cachedOrders;
  }

  static getById(id) {
    return cachedOrders.find(o => o.id === id || o.id.toLowerCase() === (id || '').toLowerCase()) || null;
  }

  static getStats() {
    const totalOrder = cachedOrders.length;
    const diproses = cachedOrders.filter(o => o.status === 'Diproses');
    const siap = cachedOrders.filter(o => o.status === 'Siap Diambil');
    const menumpuk = cachedOrders.filter(o => o.status === 'Menumpuk');
    
    const diprosesKg = diproses.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
    const totalKg = cachedOrders.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);

    return {
      totalOrder,
      diprosesCount: diproses.length,
      siapCount: siap.length,
      menumpukCount: menumpuk.length,
      diprosesKg: Math.round(diprosesKg * 10) / 10,
      totalKg: Math.round(totalKg * 10) / 10
    };
  }

  /**
   * Menyimpan transaksi pesanan baru ke Database PostgreSQL (INSERT INTO orders)
   */
  static async create(orderData) {
    const nextNum = 100 + cachedOrders.length + 1;
    const newId = `#ORD-${nextNum}`;

    const newOrder = {
      id: newId,
      name: orderData.name || 'Pelanggan Toko',
      phone: orderData.phone || '081234567890',
      packageCode: orderData.packageCode || 'reguler',
      packageName: orderData.packageName || 'Cuci Reguler',
      weight: parseFloat(orderData.weight) || 3.0,
      price: parseInt(orderData.price, 10) || 21000,
      notes: orderData.notes || 'Pakaian harian campur',
      readyTime: orderData.readyTime || formatDateTime(new Date(Date.now() + 48 * 3600 * 1000)),
      status: 'Diproses',
      paymentStatus: orderData.paymentStatus || 'Lunas',
      paymentMethod: orderData.paymentMethod || 'Tunai',
      createdAt: new Date().toISOString()
    };

    // 1. Simpan permanen ke PostgreSQL
    try {
      await db.query(`
        INSERT INTO orders (
          id, name, phone, package_code, package_name, weight, price, notes, ready_time, status, payment_status, payment_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        newOrder.id,
        newOrder.name,
        newOrder.phone,
        newOrder.packageCode,
        newOrder.packageName,
        newOrder.weight,
        newOrder.price,
        newOrder.notes,
        newOrder.readyTime,
        newOrder.status,
        newOrder.paymentStatus,
        newOrder.paymentMethod
      ]);
      console.log(`[OrderModel] ✅ Berhasil menyimpan transaksi ${newOrder.id} ke PostgreSQL!`);
    } catch (dbErr) {
      console.warn('[OrderModel] Gagal simpan ke DB, fallback memory:', dbErr.message);
    }

    // 2. Tambah ke cache aktif
    cachedOrders.unshift(newOrder);
    return newOrder;
  }

  /**
   * Mengubah status pengerjaan cucian di PostgreSQL (UPDATE orders SET status = ...)
   */
  static async updateStatus(id, newStatus) {
    const order = cachedOrders.find(o => o.id === id || o.id.toLowerCase() === (id || '').toLowerCase());
    if (!order) return null;

    order.status = newStatus;

    try {
      await db.query('UPDATE orders SET status = $1 WHERE id = $2', [newStatus, order.id]);
      console.log(`[OrderModel] ✅ Status order ${order.id} berhasil diperbarui di PostgreSQL menjadi "${newStatus}"!`);
    } catch (err) {
      console.warn('[OrderModel] Gagal update status di DB:', err.message);
    }

    return order;
  }
}

module.exports = OrderModel;
