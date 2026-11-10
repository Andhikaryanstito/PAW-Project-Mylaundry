-- ========================================================
-- DATABASE: mylaundry
-- Tugas Praktikum PAW Week 8 - Integrasi Database PostgreSQL & CRUD
-- Mahasiswa: Andhika Ryan Stito (20240140263) - Kelas D
-- ========================================================

-- 1. Hapus tabel jika sudah pernah ada (biar bersih)
DROP TABLE IF EXISTS products CASCADE;

-- 2. Buat tabel utama `products` (Layanan Laundry)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) DEFAULT 'Kiloan',
    harga INTEGER NOT NULL,
    satuan VARCHAR(20) DEFAULT 'kg',
    estimasi_jam INTEGER NOT NULL,
    durasi_label VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    badge VARCHAR(50),
    is_populer BOOLEAN DEFAULT FALSE,
    icon VARCHAR(10) DEFAULT '🧺',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Masukkan Data Awal (Seed Data) sesuai paket resmi MyLaundry
INSERT INTO products (kode, nama, kategori, harga, satuan, estimasi_jam, durasi_label, deskripsi, badge, is_populer, icon)
VALUES 
(
    'reguler', 
    'Cuci Reguler', 
    'Kiloan', 
    7000, 
    'kg', 
    48, 
    '2 - 3 Hari', 
    'Cuci bersih higienis, pengeringan maksimal, dan setrika uap rapi bergaransi.', 
    'Paling Hemat', 
    TRUE, 
    '🧺'
),
(
    'kilat', 
    'Cuci Kilat', 
    'Kiloan', 
    10000, 
    'kg', 
    24, 
    '1 Hari (24 Jam)', 
    'Proses cuci dan pengeringan cepat wangi tahan lama, cocok untuk kebutuhan mendesak.', 
    '1 Hari Selesai', 
    FALSE, 
    '⚡'
),
(
    'express', 
    'Cuci Ekspress', 
    'Kiloan', 
    15000, 
    'kg', 
    6, 
    '6 Jam', 
    'Prioritas utama antrean mesin. Pakaian langsung dicuci, dikeringkan & disetrika instan.', 
    'Prioritas Kilat', 
    FALSE, 
    '🚀'
),
(
    'bedcover', 
    'Bed Cover & Selimut', 
    'Satuan', 
    25000, 
    'pcs', 
    72, 
    '3 Hari', 
    'Pencucian khusus bahan tebal dengan deterjen pelembut serat kain.', 
    'Khusus Satuan', 
    FALSE, 
    '🛏️'
),
(
    'sepatu', 
    'Cuci Sepatu & Tas', 
    'Satuan', 
    30000, 
    'pasang', 
    48, 
    '2 Hari', 
    'Deep clean treatment sepatu dan tas dengan cleaner premium anti pudar.', 
    'Treatment Khusus', 
    FALSE, 
    '👟'
);

-- 4. Verifikasi seluruh data yang baru dimasukkan
SELECT * FROM products ORDER BY id ASC;
