/**
 * Database Migration & Seeder Script
 * Membuat tabel `customers` dan `orders` di PostgreSQL `mylaundry`
 * Penulis: Andhika Ryan Stito (20240140263)
 */

const db = require('../config/database');

async function migrateAndSeed() {
  console.log('[MIGRATION] Memulai migrasi tabel PostgreSQL...');

  try {
    // 1. Buat tabel customers
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabel `customers` siap di PostgreSQL.');

    // 2. Buat tabel orders
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        package_code VARCHAR(50),
        package_name VARCHAR(100) NOT NULL,
        weight NUMERIC(6,2) NOT NULL,
        price INTEGER NOT NULL,
        notes TEXT,
        ready_time VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Diproses',
        payment_status VARCHAR(50) DEFAULT 'Lunas',
        payment_method VARCHAR(50) DEFAULT 'Tunai',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabel `orders` siap di PostgreSQL.');

    // 3. Cek & isi data default customers jika kosong
    const custCount = await db.query('SELECT COUNT(*) FROM customers');
    if (parseInt(custCount.rows[0].count, 10) === 0) {
      console.log('🌱 Melakukan seeding data pelanggan ke tabel `customers`...');
      const defaultCustomers = [
        ['CUST-01', 'Budi Santoso', '081234567890', 'Langganan kemeja kantor'],
        ['CUST-02', 'Siti Rahmawati', '085712345678', 'Gamis & jilbab lembut'],
        ['CUST-03', 'Mas Dimas (Kost Putra)', '089698765432', 'Pakaian futsal & celana jeans'],
        ['CUST-04', 'Ibu Ratna Dewi', '081388990011', 'Sprei king size & selimut tebal'],
        ['CUST-05', 'Ahmad Fauzi', '082155443322', 'Kaos oblong & jaket hoodie'],
        ['CUST-06', 'Pak Bambang', '081223344556', 'Kemeja batik & dinas'],
        ['CUST-07', 'Rina Kusuma', '087711223344', 'Blazer & rok plisket']
      ];

      for (const [id, name, phone, note] of defaultCustomers) {
        await db.query(
          'INSERT INTO customers (id, name, phone, note) VALUES ($1, $2, $3, $4)',
          [id, name, phone, note]
        );
      }
      console.log(`✅ Berhasil memasukkan ${defaultCustomers.length} pelanggan ke database PostgreSQL.`);
    }

    // 4. Cek & isi data default orders jika kosong
    const ordCount = await db.query('SELECT COUNT(*) FROM orders');
    if (parseInt(ordCount.rows[0].count, 10) === 0) {
      console.log('🌱 Melakukan seeding 10 data antrean ke tabel `orders`...');
      const defaultOrders = [
        ['#ORD-102', 'Budi Santoso', '081234567890', 'reguler', 'Cuci Reguler', 3.5, 24500, 'Kemeja kantor & celana katun', 'Hari Ini, 16:00 WIB', 'Diproses', 'Lunas', 'Tunai'],
        ['#ORD-101', 'Siti Rahmawati', '085712345678', 'kilat', 'Cuci Kilat', 4.0, 40000, 'Gamis & jilbab lembut (pelembut ekstra)', 'Hari Ini, 14:00 WIB', 'Diproses', 'Lunas', 'QRIS'],
        ['#ORD-100', 'Ahmad Fauzi', '082155443322', 'reguler', 'Cuci Reguler', 5.0, 35000, 'Kaos & celana pendek santai', 'Kemarin, 17:00 WIB', 'Siap Diambil', 'Belum Lunas', 'Tunai'],
        ['#ORD-099', 'Ibu Ratna Dewi', '081388990011', 'reguler', 'Cuci Reguler', 6.5, 45500, 'Sprei king size & selimut tebal', 'Kemarin, 12:00 WIB', 'Siap Diambil', 'Lunas', 'QRIS'],
        ['#ORD-098', 'Mas Dimas (Kost Putra)', '089698765432', 'reguler', 'Cuci Reguler', 7.2, 50400, 'Pakaian futsal & celana jeans tebal', '4 Hari Lalu (25 Okt)', 'Menumpuk', 'Belum Lunas', 'Tunai'],
        ['#ORD-097', 'Pak Bambang', '081223344556', 'reguler', 'Cuci Reguler', 4.8, 33600, 'Batik & kemeja kerja', '5 Hari Lalu (24 Okt)', 'Menumpuk', 'Lunas', 'Tunai'],
        ['#ORD-096', 'Rina Kusuma', '087711223344', 'express', 'Cuci Ekspress', 2.5, 37500, 'Blazer dan rok plisket', 'Hari Ini, 18:30 WIB', 'Diproses', 'Lunas', 'QRIS'],
        ['#ORD-095', 'Yoga Pratama', '085299887766', 'kilat', 'Cuci Kilat', 3.0, 30000, 'Pakaian kasual', 'Hari Ini, 15:00 WIB', 'Siap Diambil', 'Lunas', 'Tunai'],
        ['#ORD-094', 'Lestari Putri', '081900112233', 'reguler', 'Cuci Reguler', 2.8, 19600, 'Pakaian harian', 'Hari Ini, 13:00 WIB', 'Siap Diambil', 'Lunas', 'QRIS'],
        ['#ORD-093', 'Dedi Setiawan', '083812345678', 'reguler', 'Cuci Reguler', 3.2, 22400, 'Kaos & kemeja', 'Besok, 10:00 WIB', 'Diproses', 'Belum Lunas', 'Tunai']
      ];

      for (const ord of defaultOrders) {
        await db.query(`
          INSERT INTO orders (
            id, name, phone, package_code, package_name, weight, price, notes, ready_time, status, payment_status, payment_method
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, ord);
      }
      console.log(`✅ Berhasil memasukkan ${defaultOrders.length} antrean pesanan ke database PostgreSQL.`);
    }

    // Tampilkan rangkuman tabel saat ini
    const tables = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('\n=============================================');
    console.log('  STATUS DATABASE POSTGRESQL mylaundry:');
    console.log('=============================================');
    for (const t of tables.rows) {
      const c = await db.query(`SELECT COUNT(*) FROM "${t.table_name}"`);
      console.log(` 🐘 Tabel "${t.table_name}": ${c.rows[0].count} data tersimpan`);
    }
    console.log('=============================================\n');

  } catch (err) {
    console.error('❌ Gagal migrasi database:', err.message);
  } finally {
    process.exit(0);
  }
}

migrateAndSeed();
