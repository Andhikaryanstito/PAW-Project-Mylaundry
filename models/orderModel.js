/**
 * Model Antrean & Pesanan Laundry (OrderModel)
 * Digunakan untuk manajemen antrean kasir dan status cucian toko
 */

const { formatDateTime, calculateReadyTime } = require('../utils/formatter');

// In-memory array data pesanan laundry sesuai PRD studi kasus Mbak Sarah
let orders = [
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
    status: 'Diproses', // Diproses | Siap Diambil | Menumpuk
    paymentStatus: 'Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-101',
    name: 'Siti Rahmawati',
    phone: '085712345678',
    packageCode: 'kilat',
    packageName: 'Cuci Kilat',
    weight: 4.0,
    price: 40000,
    notes: 'Gamis & jilbab lembut (pelembut ekstra)',
    readyTime: 'Hari Ini, 14:00 WIB',
    status: 'Diproses',
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-100',
    name: 'Ahmad Fauzi',
    phone: '082155443322',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 5.0,
    price: 35000,
    notes: 'Kaos & celana pendek santai',
    readyTime: 'Kemarin, 17:00 WIB',
    status: 'Siap Diambil',
    paymentStatus: 'Belum Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-099',
    name: 'Ibu Ratna Dewi',
    phone: '081388990011',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 6.5,
    price: 45500,
    notes: 'Sprei & selimut bulu lembut',
    readyTime: 'Kemarin, 12:00 WIB',
    status: 'Siap Diambil',
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS',
    createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-098',
    name: 'Mas Dimas (Kost Putra)',
    phone: '089698765432',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 7.2,
    price: 50400,
    notes: 'Pakaian futsal & celana jeans tebal',
    readyTime: '4 Hari Lalu (25 Okt)',
    status: 'Menumpuk', // > 3 hari belum diambil
    paymentStatus: 'Belum Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-097',
    name: 'Pak Bambang',
    phone: '081223344556',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 4.8,
    price: 33600,
    notes: 'Batik & kemeja kerja',
    readyTime: '5 Hari Lalu (24 Okt)',
    status: 'Menumpuk', // > 3 hari belum diambil
    paymentStatus: 'Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-096',
    name: 'Rina Kusuma',
    phone: '087711223344',
    packageCode: 'express',
    packageName: 'Cuci Ekspress',
    weight: 2.5,
    price: 37500,
    notes: 'Blazer dan rok plisket',
    readyTime: 'Hari Ini, 18:30 WIB',
    status: 'Diproses',
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-095',
    name: 'Yoga Pratama',
    phone: '085299887766',
    packageCode: 'kilat',
    packageName: 'Cuci Kilat',
    weight: 3.0,
    price: 30000,
    readyTime: 'Hari Ini, 15:00 WIB',
    status: 'Siap Diambil',
    paymentStatus: 'Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-094',
    name: 'Lestari Putri',
    phone: '081900112233',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 2.8,
    price: 19600,
    readyTime: 'Hari Ini, 13:00 WIB',
    status: 'Siap Diambil',
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  },
  {
    id: '#ORD-093',
    name: 'Dedi Setiawan',
    phone: '083812345678',
    packageCode: 'reguler',
    packageName: 'Cuci Reguler',
    weight: 3.2,
    price: 22400,
    readyTime: 'Besok, 10:00 WIB',
    status: 'Diproses',
    paymentStatus: 'Belum Lunas',
    paymentMethod: 'Tunai',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  }
];

class OrderModel {
  static getAll() {
    return orders;
  }

  static getById(id) {
    return orders.find(o => o.id === id) || null;
  }

  static getStats() {
    const totalOrder = orders.length;
    const diproses = orders.filter(o => o.status === 'Diproses');
    const siap = orders.filter(o => o.status === 'Siap Diambil');
    const menumpuk = orders.filter(o => o.status === 'Menumpuk');
    
    // Total beban kilogram yang sedang diproses
    const diprosesKg = diproses.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
    const totalKg = orders.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);

    return {
      totalOrder,
      diprosesCount: diproses.length,
      siapCount: siap.length,
      menumpukCount: menumpuk.length,
      diprosesKg: Math.round(diprosesKg * 10) / 10,
      totalKg: Math.round(totalKg * 10) / 10
    };
  }

  static create(orderData) {
    const nextNum = 100 + orders.length + 1;
    const newId = `#ORD-${nextNum}`;

    const newOrder = {
      id: newId,
      name: orderData.name || 'Pelanggan Toko',
      phone: orderData.phone || '081234567890',
      packageCode: orderData.packageCode || 'reguler',
      packageName: orderData.packageName || 'Cuci Komplit Reguler',
      weight: parseFloat(orderData.weight) || 3.0,
      price: parseInt(orderData.price, 10) || 21000,
      notes: orderData.notes || 'Pakaian harian campur',
      readyTime: orderData.readyTime || formatDateTime(new Date(Date.now() + 48 * 3600 * 1000)),
      status: 'Diproses',
      paymentStatus: orderData.paymentStatus || 'Lunas',
      paymentMethod: orderData.paymentMethod || 'Tunai',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    return newOrder;
  }

  static updateStatus(id, newStatus) {
    const order = orders.find(o => o.id === id);
    if (!order) return null;
    order.status = newStatus;
    return order;
  }
}

module.exports = OrderModel;
