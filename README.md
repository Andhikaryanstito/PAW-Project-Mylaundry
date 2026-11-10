# Website Kasir MyLaundry untuk UMKM Laundry
> **Tugas Praktikum Pemrograman Aplikasi Web (PPAW) — Week 8**  
> **Integrasi Database PostgreSQL dan Implementasi CRUD Lengkap dengan Arsitektur MVC**

**Identitas Mahasiswa:**
- **Nama:** Andhika Ryan Stito
- **NIM:** 20240140263
- **Kelas:** PPAW - TI503P (Kelas D - Individu)
- **Nama Project:** `PAW-Project-MyLaundry`
- **Repository GitHub:** [https://github.com/Andhikaryanstito/PAW-Project-Mylaundry](https://github.com/Andhikaryanstito/PAW-Project-Mylaundry)

---

## 📌 Ringkasan Implementasi Tugas Week 8

| Kriteria Tugas Week 8 | Status | Deskripsi Implementasi |
| :--- | :---: | :--- |
| **1. Integrasi Database** | ✅ Selesai | Terhubung ke **PostgreSQL 18** database `mylaundry` melalui connection pool `pg.Pool` pada `config/database.js`. Tabel utama `products` menyimpan katalog layanan laundry secara permanen. |
| **2. Endpoint CRUD (REST API)** | ✅ Selesai | Menyediakan seluruh endpoint CRUD terhubung langsung ke PostgreSQL:<br>• `GET /api/produk` (Read All)<br>• `GET /api/produk/:id` (Read Detail by ID)<br>• `POST /api/produk` (Create data baru)<br>• `PUT /api/produk/:id` (Update data berdasarkan ID)<br>• `DELETE /api/produk/:id` (Delete data berdasarkan ID)<br>• `GET /api/status` (Status server & status koneksi DB). |
| **3. Pengembangan Frontend** | ✅ Selesai | Frontend EJS menampilkan katalog layanan langsung dari PostgreSQL. Dilengkapi antarmuka CRUD lengkap: **Tombol Tambah Layanan** (+ Modal Create), **Tombol Edit** (+ Modal Update), dan **Tombol Hapus** (Delete konfirmasi). |
| **4. Pengujian Backend & Frontend** | ✅ Selesai | Seluruh operasi CRUD telah diuji dan berfungsi dua arah (Postman / Thunder Client / Browser dan Interactive API Console di web). |
| **5. Middleware Logger** | ✅ Selesai | Middleware pada `middlewares/logger.js` mencatat setiap request HTTP: `Timestamp`, `Method (GET, POST, PUT, DELETE)`, `Path/Endpoint`, `HTTP Status Code`, dan durasi response pada terminal/console backend. |
| **6. Arsitektur MVC & Keamanan** | ✅ Selesai | Mempertahankan arsitektur MVC. File sensitif `.env` dikunci di `.gitignore` dan hanya menyertakan template `.env.example` di repository publik. |

---

## 🚀 Daftar Endpoint REST API (CRUD Lengkap)

| Method | Endpoint | Deskripsi Operasi | Contoh Payload (JSON) / Response |
| :---: | :--- | :--- | :--- |
| **GET** | `/api/status` | Cek status server, uptime, dan status koneksi PostgreSQL | `{ "status": "success", "database": { "engine": "PostgreSQL", "status": "connected" } }` |
| **GET** | `/api/produk` | Mengambil seluruh katalog produk dari database (Array JSON) | `[ { "id": 1, "nama": "Cuci Reguler", "harga": 7000, "satuan": "kg" }, ... ]` |
| **GET** | `/api/produk/:id` | Mengambil detail 1 produk berdasarkan ID | Response: `{ "status": "success", "data": { "id": 1, ... } }` |
| **POST** | `/api/produk` | Menambahkan data produk baru ke database (Create) | Request: `{ "nama": "Cuci Karpet", "harga": 25000, "satuan": "meter", "estimasi_jam": 48 }` |
| **PUT** | `/api/produk/:id` | Memperbarui informasi produk berdasarkan ID (Update) | Request: `{ "harga": 8000, "durasi_label": "2 Hari" }` |
| **DELETE** | `/api/produk/:id` | Menghapus data produk secara permanen dari database | Response: `{ "status": "success", "message": "Produk berhasil dihapus" }` |

---

## 🔑 Akun Uji Coba Login Kasir (Demo)

Sistem telah dilengkapi dengan data akun kasir untuk pengujian:

| Role / Nama Akun | Username / Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Kasir Utama (Sarah Anggraini)** | `sarah` atau `sarah@mylaundry.com` | `password` atau `123456` | Pemilik & Kasir MyLaundry (Sesuai Persona PRD) |
| **Administrator Toko** | `admin` atau `admin@mylaundry.com` | `admin` atau `123456` | Hak akses penuh sistem & pengujian praktikum |

---

## 📂 Struktur Folder Proyek (MVC Architecture)

```
pertemuan8/PAW-Project-MyLaundry/
├── config/
│   ├── appConfig.js          # Konfigurasi aplikasi, port, environment & identitas UMKM
│   └── database.js           # Konfigurasi koneksi pool PostgreSQL (pg.Pool) & query helper
├── models/
│   ├── productModel.js       # Model data produk (CRUD SQL query langsung ke PostgreSQL)
│   ├── orderModel.js         # Model data antrean cucian & kalkulasi statistik toko
│   ├── customerModel.js      # Model data pelanggan langganan (autocomplete)
│   └── userModel.js          # Model autentikasi kasir & admin
├── middlewares/
│   ├── logger.js             # Middleware logger pencatat HTTP request & response (GET, POST, PUT, DELETE)
│   └── auth.js               # Middleware proteksi route login berbasis cookie
├── controllers/
│   ├── apiController.js      # Controller REST API CRUD (/api/status & /api/produk)
│   ├── pageController.js     # Controller render halaman frontend EJS dengan data PostgreSQL
│   └── authController.js     # Controller login & logout kasir
├── routes/
│   ├── apiRoutes.js          # Routing untuk endpoint REST API CRUD
│   └── webRoutes.js          # Routing untuk halaman web browser
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Head tag, CDN Tailwind CSS, font Plus Jakarta Sans
│   │   ├── navbar.ejs        # Navigation bar & status buka toko
│   │   ├── productModals.ejs # Modal dialog Tambah & Edit Layanan + client-side JS CRUD
│   │   ├── receiptModal.ejs  # Modal nota digital & tombol kirim ke WhatsApp (wa.me)
│   │   ├── weatherBanner.ejs # Peringatan cuaca hujan lebat
│   │   └── footer.ejs        # Footer identitas mahasiswa & mata kuliah
│   ├── index.ejs             # Halaman utama POS kasir & tabel CRUD database PostgreSQL
│   ├── login.ejs             # Halaman login kasir modern
│   └── apiDocs.ejs           # Halaman dokumentasi & interactive tester REST API
├── utils/
│   └── formatter.js          # Helper mata uang (Rp), tanggal lokal, kalkulator estimasi jam
├── .env.example              # Template variabel environment database (aman untuk GitHub)
├── app.js                    # Entry point inisialisasi Express, koneksi DB, middleware & router
├── database.sql              # Skrip pembuatan tabel PostgreSQL & seed data awal
├── package.json              # Dependensi express, ejs, pg, dotenv, dan script runner
└── README.md                 # Dokumentasi panduan instalasi & pengujian
```

---

## ⚙️ Cara Menjalankan & Menguji Proyek

### 1. Prasyarat Database
Pastikan server **PostgreSQL** aktif (port default: `5432`). Jika database belum dibuat, jalankan skrip `database.sql` pada pgAdmin 4 atau terminal psql:
```sql
CREATE DATABASE mylaundry;
```
Lalu jalankan isi file `database.sql`.

### 2. Konfigurasi Variabel Lingkungan (.env)
Buat file `.env` di root project (salin dari `.env.example`):
```ini
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=mylaundry
```

### 3. Instalasi Dependensi & Jalankan Server
```bash
# Masuk ke folder project
cd "d:\SEMESTER 5\PAW\pertemuan8\PAW-Project-MyLaundry"

# Instal dependensi (express, ejs, pg, dotenv)
npm install

# Jalankan server
npm start
# atau mode auto-reload:
npm run dev
```

### 4. Buka di Browser
- **Frontend Utama Kasir MyLaundry:** [http://localhost:3000](http://localhost:3000)
- **Interactive REST API Console:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Endpoint Status Aplikasi:** [http://localhost:3000/api/status](http://localhost:3000/api/status)
- **Endpoint Katalog Produk:** [http://localhost:3000/api/produk](http://localhost:3000/api/produk)

---

## 📝 Contoh Output Log Terminal (Middleware Logger)

Ketika aplikasi diakses dan operasi CRUD dijalankan:
```
==================================================================
🧺  SERVER MYLAUNDRY POS (WEEK 8 - DATABASE & CRUD) BERJALAN
==================================================================
🌐  Alamat Frontend  : http://localhost:3000
📡  Endpoint Status  : http://localhost:3000/api/status
📦  CRUD Produk API  : http://localhost:3000/api/produk
🧪  Interactive Docs : http://localhost:3000/api-docs
📝  Middleware Logger: AKTIF (GET, POST, PUT, DELETE, Path, Status)
------------------------------------------------------------------
[DATABASE] Berhasil terhubung ke PostgreSQL! DB: mylaundry
==================================================================

[2026-11-10 23:55:01] GET    /                         Status: 200 (18ms)
[2026-11-10 23:55:04] GET    /api/produk               Status: 200 (5ms)
[2026-11-10 23:55:10] POST   /api/produk               Status: 201 (12ms)
[2026-11-10 23:55:15] PUT    /api/produk/1             Status: 200 (9ms)
[2026-11-10 23:55:20] DELETE /api/produk/6             Status: 200 (7ms)
```
