/**
 * Controller API Endpoint
 * Tugas Praktikum PAW Week 8:
 * - Integrasi Database PostgreSQL & Operasi CRUD Lengkap:
 *   1. GET    /api/status      -> Status aplikasi & koneksi database
 *   2. GET    /api/produk      -> Tampil semua produk dari DB (Array JSON)
 *   3. GET    /api/produk/:id  -> Detail 1 produk berdasarkan ID dari DB
 *   4. POST   /api/produk      -> Tambah produk baru ke DB
 *   5. PUT    /api/produk/:id  -> Perbarui data produk di DB
 *   6. DELETE /api/produk/:id  -> Hapus data produk dari DB
 */

const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const CustomerModel = require('../models/customerModel');
const UserModel = require('../models/userModel');
const appConfig = require('../config/appConfig');
const db = require('../config/database');

class ApiController {
  /**
   * Endpoint: GET /api/status
   * Mengirimkan status server, aplikasi, dan koneksi database dalam format JSON
   */
  static async getStatus(req, res) {
    const uptimeSeconds = process.uptime();
    const formattedUptime = `${Math.floor(uptimeSeconds / 60)} menit ${Math.floor(uptimeSeconds % 60)} detik`;

    let dbStatus = 'connected';
    try {
      await db.query('SELECT 1');
    } catch (err) {
      dbStatus = `disconnected (${err.message})`;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Server MyLaundry POS berjalan normal dan terhubung ke Database.',
      app: appConfig.appName,
      version: '2.0.0 (Week 8 - Database & CRUD)',
      environment: appConfig.env,
      timestamp: new Date().toISOString(),
      uptime: formattedUptime,
      database: {
        engine: 'PostgreSQL',
        status: dbStatus,
        databaseName: process.env.DB_NAME || 'mylaundry'
      },
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      },
      store: {
        name: appConfig.store.name,
        branch: appConfig.store.branch,
        owner: appConfig.store.owner
      }
    });
  }

  /**
   * Endpoint: GET /api/produk
   * Mengambil dan menampilkan seluruh data produk dari database PostgreSQL
   */
  static async getProduk(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).json(products);
    } catch (err) {
      console.error('[API ERROR] Gagal mengambil data produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data produk dari database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: GET /api/produk/:id
   * Mengambil detail satu data produk berdasarkan ID dari database
   */
  static async getProdukById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan di database.`
        });
      }

      return res.status(200).json({
        status: 'success',
        data: product
      });
    } catch (err) {
      console.error('[API ERROR] Gagal mengambil detail produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server saat mengambil detail produk.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: POST /api/produk
   * Menambahkan data produk baru ke dalam database PostgreSQL (CREATE)
   */
  static async createProduk(req, res) {
    try {
      const { nama, harga, kategori, satuan, estimasi_jam, durasi_label, deskripsi, badge, icon, kode } = req.body;

      if (!nama || typeof nama !== 'string' || nama.trim().length < 2) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama layanan wajib diisi minimal 2 karakter.'
        });
      }

      const numHarga = parseInt(harga, 10);
      if (isNaN(numHarga) || numHarga <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Harga layanan harus berupa angka positif lebih dari 0 (contoh: 8000).'
        });
      }

      const numEstimasi = parseInt(estimasi_jam || 24, 10);
      if (isNaN(numEstimasi) || numEstimasi <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Estimasi durasi pengerjaan harus berupa angka jam positif (contoh: 24).'
        });
      }

      const newProduct = await ProductModel.create({
        nama: nama.trim(),
        harga: numHarga,
        kategori: kategori || 'Kiloan',
        satuan: satuan ? satuan.trim() : 'kg',
        estimasi_jam: numEstimasi,
        durasi_label: durasi_label ? durasi_label.trim() : `${numEstimasi} Jam`,
        deskripsi: deskripsi ? deskripsi.trim() : '',
        badge: badge ? badge.trim() : '',
        icon: icon || '🧺',
        kode: kode || undefined
      });

      return res.status(201).json({
        status: 'success',
        message: 'Produk berhasil ditambahkan ke database PostgreSQL.',
        data: newProduct
      });
    } catch (err) {
      console.error('[API ERROR] Gagal menambahkan produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan data produk ke database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: PUT /api/produk/:id
   * Memperbarui data produk berdasarkan ID di database (UPDATE)
   */
  static async updateProduk(req, res) {
    try {
      const { id } = req.params;
      const { nama, harga, kategori, satuan, estimasi_jam, durasi_label, deskripsi, badge, icon } = req.body;

      if (nama !== undefined && (typeof nama !== 'string' || nama.trim().length < 2)) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama layanan wajib diisi minimal 2 karakter.'
        });
      }

      if (harga !== undefined) {
        const parsedHarga = parseInt(harga, 10);
        if (isNaN(parsedHarga) || parsedHarga <= 0) {
          return res.status(400).json({
            status: 'error',
            message: 'Harga layanan harus berupa angka positif lebih dari 0.'
          });
        }
      }

      if (estimasi_jam !== undefined) {
        const parsedEstimasi = parseInt(estimasi_jam, 10);
        if (isNaN(parsedEstimasi) || parsedEstimasi <= 0) {
          return res.status(400).json({
            status: 'error',
            message: 'Estimasi durasi pengerjaan harus berupa angka jam positif.'
          });
        }
      }

      const existing = await ProductModel.getById(id);
      if (!existing) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan, tidak dapat diperbarui.`
        });
      }

      const numHarga = harga !== undefined ? parseInt(harga, 10) : existing.harga;
      const numEstimasi = estimasi_jam !== undefined ? parseInt(estimasi_jam, 10) : existing.estimasi_jam;

      const updated = await ProductModel.update(id, {
        nama: nama ? nama.trim() : existing.nama,
        harga: numHarga,
        kategori: kategori || existing.kategori,
        satuan: satuan ? satuan.trim() : existing.satuan,
        estimasi_jam: numEstimasi,
        durasi_label: durasi_label ? durasi_label.trim() : existing.durasi_label,
        deskripsi: deskripsi !== undefined ? deskripsi.trim() : existing.deskripsi,
        badge: badge !== undefined ? badge.trim() : existing.badge,
        icon: icon || existing.icon
      });

      return res.status(200).json({
        status: 'success',
        message: `Data produk ID ${id} berhasil diperbarui di database.`,
        data: updated
      });
    } catch (err) {
      console.error('[API ERROR] Gagal memperbarui produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui data produk di database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint: DELETE /api/produk/:id
   * Menghapus data produk berdasarkan ID dari database (DELETE)
   */
  static async deleteProduk(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProductModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: `Produk dengan ID ${id} tidak ditemukan atau sudah dihapus sebelumnya.`
        });
      }

      return res.status(200).json({
        status: 'success',
        message: `Produk '${deleted.nama}' (ID ${id}) berhasil dihapus dari database.`,
        data: deleted
      });
    } catch (err) {
      console.error('[API ERROR] Gagal menghapus produk:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus produk dari database.',
        error: err.message
      });
    }
  }

  /**
   * Endpoint Tambahan: GET /api/antrean
   * Mengambil data seluruh antrean cucian dan ringkasan statistik toko
   */
  static getAntrean(req, res) {
    const orders = OrderModel.getAll();
    const stats = OrderModel.getStats();

    return res.status(200).json({
      status: 'success',
      stats: stats,
      total: orders.length,
      data: orders
    });
  }

  /**
   * Endpoint Tambahan: POST /api/pesanan
   * Menyimpan transaksi kasir baru
   */
  static async createOrder(req, res) {
    try {
      const { packageCode, weight, notes, paymentStatus, paymentMethod, readyTime } = req.body;
      const rawName = String(req.body.name || req.body.customerName || req.body.nama || '').trim();
      const rawPhone = String(req.body.phone || req.body.wa || req.body.telepon || req.body.no_hp || '').trim();

      if (!rawName || rawName.length < 2) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama pelanggan wajib diisi (minimal 2 karakter).'
        });
      }

      // Validasi ketat nomor telepon: hanya digit, 10-15 digit
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({
          status: 'error',
          message: 'Nomor WhatsApp tidak valid. Masukkan 10-15 digit angka (contoh: 081234567890).'
        });
      }

      // Normalisasi format Indonesia
      const formattedPhone = cleanPhone.startsWith('62') 
        ? '0' + cleanPhone.slice(2) 
        : (cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone);

      // Validasi berat pakaian
      const numWeight = parseFloat(weight);
      if (isNaN(numWeight) || numWeight <= 0 || numWeight > 200) {
        return res.status(400).json({
          status: 'error',
          message: 'Berat cucian harus berupa angka positif antara 0.1 - 200 Kg.'
        });
      }

      const product = (await ProductModel.getByCode(packageCode || 'reguler')) || (await ProductModel.getAll())[0];
      const totalPrice = Math.round(numWeight * (product ? product.harga : 7000));

      const newOrder = await OrderModel.create({
        name: rawName,
        phone: formattedPhone,
        packageCode: product ? product.kode : 'reguler',
        packageName: product ? product.nama : 'Cuci Reguler',
        weight: numWeight,
        price: totalPrice,
        notes: notes ? notes.trim() : 'Pakaian harian campur',
        paymentStatus: paymentStatus || 'Lunas',
        paymentMethod: paymentMethod || 'Tunai',
        readyTime: readyTime || '-'
      });

      // Otomatis daftarkan ke database pelanggan jika belum tercatat
      let newCustomer = null;
      try {
        const existingCust = CustomerModel.search(formattedPhone);
        if (!existingCust || existingCust.length === 0) {
          newCustomer = await CustomerModel.create({
            name: rawName,
            phone: formattedPhone,
            note: notes ? notes.trim() : 'Pelanggan baru dari Kasir POS'
          });
        }
      } catch (custErr) {
        console.warn('[ApiController] Gagal auto-sync pelanggan:', custErr.message);
      }

      return res.status(201).json({
        status: 'success',
        message: 'Transaksi kasir berhasil disimpan.',
        data: newOrder,
        customer: newCustomer
      });
    } catch (err) {
      console.error('Error create order:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * Endpoint Tambahan: PATCH /api/pesanan/:id/status
   */
  static async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status baru wajib disertakan.'
      });
    }

    const updated = await OrderModel.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: `Pesanan dengan ID ${id} tidak ditemukan.`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Status pesanan ${id} berhasil diubah menjadi ${status}.`,
      data: updated
    });
  }

  /**
   * Endpoint Tambahan: PATCH /api/pesanan/:id/pembayaran
   * Mengubah status pembayaran (Lunas / Belum Lunas) dan metode bayar (Tunai / QRIS)
   */
  static async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          status: 'error',
          message: 'Status pembayaran wajib diisi (contoh: Lunas / Belum Lunas).'
        });
      }

      const updated = await OrderModel.updatePaymentStatus(id, paymentStatus, paymentMethod || 'Tunai');
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: `Pesanan dengan ID ${id} tidak ditemukan.`
        });
      }

      return res.status(200).json({
        status: 'success',
        message: `Status pembayaran pesanan ${id} berhasil diubah menjadi ${paymentStatus} (${updated.paymentMethod}).`,
        data: updated
      });
    } catch (err) {
      console.error('Error update payment status:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  /**
   * Endpoint Tambahan: GET /api/pelanggan
   */
  static async getPelanggan(req, res) {
    const { q } = req.query;
    if (q) {
      return res.status(200).json(CustomerModel.search(q));
    }
    const custs = await CustomerModel.getAllFromDb();
    return res.status(200).json(custs);
  }

  // POST /api/pelanggan
  static async createPelanggan(req, res) {
    try {
      const { note, address } = req.body;
      const rawName = String(req.body.name || req.body.nama || '').trim();
      const rawPhone = String(req.body.phone || req.body.telepon || req.body.no_hp || req.body.wa || '').trim();

      if (!rawName || rawName.length < 2) {
        return res.status(400).json({ status: 'error', message: 'Nama pelanggan wajib diisi (minimal 2 karakter).' });
      }

      const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({ status: 'error', message: 'Nomor WhatsApp tidak valid. Masukkan 10-15 digit angka (contoh: 081234567890).' });
      }

      const formattedPhone = cleanPhone.startsWith('62') 
        ? '0' + cleanPhone.slice(2) 
        : (cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone);

      const newCust = await CustomerModel.create({
        name: rawName,
        phone: formattedPhone,
        note: (note || address || '-').trim()
      });
      return res.status(201).json({ status: 'success', message: 'Pelanggan berhasil ditambahkan.', data: newCust });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }

  // PUT /api/pelanggan/:id
  static async updatePelanggan(req, res) {
    const { id } = req.params;
    const { note, address } = req.body;
    const rawName = String(req.body.name || req.body.nama || '').trim();
    const rawPhone = String(req.body.phone || req.body.telepon || req.body.no_hp || req.body.wa || '').trim();

    if (!rawName || rawName.length < 2) {
      return res.status(400).json({ status: 'error', message: 'Nama pelanggan wajib diisi (minimal 2 karakter).' });
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
      return res.status(400).json({ status: 'error', message: 'Nomor WhatsApp tidak valid. Masukkan 10-15 digit angka (contoh: 081234567890).' });
    }

    const formattedPhone = cleanPhone.startsWith('62') 
      ? '0' + cleanPhone.slice(2) 
      : (cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone);

    const updated = await CustomerModel.update(id, {
      name: rawName,
      phone: formattedPhone,
      note: (note || address || '-').trim()
    });
    if (!updated) return res.status(404).json({ status: 'error', message: 'Pelanggan tidak ditemukan.' });
    return res.status(200).json({ status: 'success', message: 'Data pelanggan berhasil diperbarui.', data: updated });
  }

  // DELETE /api/pelanggan/:id
  static async deletePelanggan(req, res) {
    const { id } = req.params;
    await CustomerModel.delete(id);
    return res.status(200).json({ status: 'success', message: `Pelanggan ${id} berhasil dihapus.` });
  }

  // PUT /api/pengaturan/profil
  static updateProfilKasir(req, res) {
    const { name, email, branch } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ status: 'error', message: 'Nama wajib diisi minimal 2 karakter.' });
    }
    const updated = UserModel.updateProfile('sarah', {
      name: name.trim(),
      email: email ? email.trim() : undefined,
      branch: branch ? branch.trim() : undefined
    });
    if (!updated) return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });

    // Update session cookie
    const sessionData = encodeURIComponent(JSON.stringify(updated));
    res.setHeader('Set-Cookie', `mylaundry_session=${sessionData}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);

    return res.status(200).json({ status: 'success', message: 'Profil kasir berhasil diperbarui.', data: updated });
  }

  // PUT /api/pengaturan/toko
  static updateProfilToko(req, res) {
    const { name, branch, address, hours, phone } = req.body;
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9\-+]/g, '');
      if (cleanPhone.length < 8) {
        return res.status(400).json({ status: 'error', message: 'Nomor telepon toko minimal 8 digit.' });
      }
      appConfig.store.phone = cleanPhone;
    }
    if (name) appConfig.store.name = name.trim();
    if (branch) appConfig.store.branch = branch.trim();
    if (address) appConfig.store.address = address.trim();
    if (hours) appConfig.store.hours = hours.trim();

    return res.status(200).json({ status: 'success', message: 'Profil toko berhasil diperbarui.', data: appConfig.store });
  }
}

module.exports = ApiController;
