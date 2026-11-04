# Website Kasir MyLaundry untuk UMKM Laundry
> **Tugas Praktikum Pemrograman Aplikasi Web (PPAW) — Week 7**  
> **Integrasi Frontend (EJS), REST API, dan Middleware Logger dengan Arsitektur MVC**

**Identitas Mahasiswa:**
- **Nama:** Andhika Ryan Stito
- **NIM:** 20240140263
- **Kelas:** PPAW - TI503P
- **Nama Project:** `PAW-Project-MyLaundry`

---

## 📌 Ringkasan Implementasi Tugas Week 7

| Kriteria Tugas Week 7 | Status | Deskripsi Implementasi |
| :--- | :---: | :--- |
| **1. Halaman Frontend** | ✅ Selesai | Frontend dinamis menggunakan **EJS** dan **Tailwind CSS (CDN)**, menampilkan katalog produk/layanan dari backend, form kasir, dashboard antrean, kalkulator waktu selesai, dan modal nota WhatsApp. |
| **2. Endpoint `GET /api/status`** | ✅ Selesai | Mengembalikan response JSON status aplikasi, uptime server, memory usage, dan identitas toko UMKM. |
| **3. Endpoint `GET /api/produk`** | ✅ Selesai | Mengembalikan data produk dalam bentuk **Array JSON** (`ProductModel.getAll()`). |
| **4. Middleware Logger** | ✅ Selesai | Middleware pada `middlewares/logger.js` mencatat: `[Timestamp]`, `Method (GET/POST)`, `Path/Endpoint`, `HTTP Status Code`, dan durasi response pada terminal/console backend. |
| **5. Arsitektur MVC & Struktur Folder** | ✅ Selesai | Sesuai struktur wajib: `config/`, `models/`, `middlewares/`, `controllers/`, `routes/`, `views/`, `utils/`, `app.js`, `package.json`. |
| **6. Autentikasi Kasir (Login & Logout)** | ✅ Selesai | Halaman login kasir modern, proteksi route dengan middleware `requireAuth`, sesi berbasis cookie aman, dan tombol logout di navbar. |

---

## 🔑 Akun Uji Coba Login Kasir (Demo)

Sistem telah dilengkapi dengan data akun kasir untuk pengujian:

| Role / Nama Akun | Username / Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Kasir Utama (Sarah Anggraini)** | `sarah` atau `sarah@mylaundry.com` | `password` atau `123456` | Pemilik & Kasir MyLaundry (Sesuai PRD) |
| **Administrator Toko** | `admin` atau `admin@mylaundry.com` | `admin` atau `123456` | Hak akses penuh sistem |

*Tersedia juga tombol 1-Klik di halaman login untuk mengisi username & password secara otomatis.*

---

## 📂 Struktur Folder Wajib

```
Pertemuan7/PAW-Project-MyLaundry/
├── config/
│   └── appConfig.js          # Konfigurasi aplikasi, port, environment & identitas UMKM
├── models/
│   ├── productModel.js       # Model data produk/layanan laundry (array statis)
│   ├── orderModel.js         # Model data antrean cucian & kalkulasi statistik toko
│   └── customerModel.js      # Model data pelanggan langganan (autocomplete)
├── middlewares/
│   └── logger.js             # Middleware logger pencatat HTTP request & response
├── controllers/
│   ├── apiController.js      # Controller response REST API (/api/status & /api/produk)
│   └── pageController.js     # Controller render halaman frontend EJS
├── routes/
│   ├── apiRoutes.js          # Routing untuk endpoint REST API
│   └── webRoutes.js          # Routing untuk halaman web browser
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Head tag, CDN Tailwind CSS, font Plus Jakarta Sans
│   │   ├── navbar.ejs        # Navigation bar & status buka toko
│   │   ├── weatherBanner.ejs # Peringatan cuaca hujan lebat (PRD US-06)
│   │   ├── receiptModal.ejs  # Modal nota digital & tombol kirim ke WhatsApp (wa.me)
│   │   └── footer.ejs        # Footer identitas mahasiswa & mata kuliah
│   ├── index.ejs             # Halaman utama POS kasir & antrean cucian
│   └── apiDocs.ejs           # Halaman dokumentasi & interactive tester REST API
├── utils/
│   └── formatter.js          # Helper mata uang (Rp), tanggal lokal, kalkulator estimasi jam
├── app.js                    # Entry point inisialisasi Express, middleware, routing & server
├── package.json              # Dependensi express, ejs, dan scripts runner
└── README.md                 # Dokumentasi panduan instalasi & pengujian
```

---

## 🚀 Cara Menjalankan Project

1. Buka folder project di terminal:
   ```bash
   cd "Pertemuan7/PAW-Project-MyLaundry"
   ```

2. Jalankan development server:
   ```bash
   npm start
   # atau untuk mode auto-reload:
   npm run dev
   ```

3. Buka di browser:
   - **Frontend Kasir MyLaundry:** [http://localhost:3000](http://localhost:3000)
   - **REST API Status:** [http://localhost:3000/api/status](http://localhost:3000/api/status)
   - **REST API Produk:** [http://localhost:3000/api/produk](http://localhost:3000/api/produk)
   - **Interactive API Tester:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🔍 Contoh Output Log Terminal

Ketika browser atau Postman melakukan request ke server:
```
[2026-10-29 14:40:46] GET    /api/status               Status: 200 (4ms)
[2026-10-29 14:40:48] GET    /api/produk               Status: 200 (3ms)
[2026-10-29 14:40:50] GET    /                         Status: 200 (15ms)
```
