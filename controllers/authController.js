/**
 * Controller Autentikasi Kasir (Login & Logout)
 */

const UserModel = require('../models/userModel');
const appConfig = require('../config/appConfig');

class AuthController {
  /**
   * Menampilkan halaman login kasir
   */
  static getLoginPage(req, res) {
    const error = req.query.error || null;
    const message = req.query.message || null;

    res.render('login', {
      title: 'Masuk Kasir - MyLaundry POS',
      appConfig,
      error,
      message
    });
  }

  /**
   * Memproses data login kasir
   */
  static postLogin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('login', {
        title: 'Masuk Kasir - MyLaundry POS',
        appConfig,
        error: 'Harap isi username/email dan kata sandi.',
        message: null
      });
    }

    const authResult = UserModel.authenticate(username, password);

    if (!authResult.success) {
      return res.render('login', {
        title: 'Masuk Kasir - MyLaundry POS',
        appConfig,
        error: authResult.message,
        message: null
      });
    }

    // Set Cookie Session (berlaku 7 hari)
    const sessionData = encodeURIComponent(JSON.stringify(authResult.user));
    res.setHeader('Set-Cookie', `mylaundry_session=${sessionData}; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);

    return res.redirect('/');
  }

  /**
   * Memproses logout kasir
   */
  static logout(req, res) {
    // Hapus cookie dengan Max-Age=0
    res.setHeader('Set-Cookie', 'mylaundry_session=; Path=/; Max-Age=0; SameSite=Lax');
    return res.redirect('/login?message=logout_success');
  }
}

module.exports = AuthController;
