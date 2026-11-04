/**
 * Middleware Autentikasi Kasir
 * Menangani proteksi halaman dashboard dan verifikasi status login/logout
 */

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    try {
      list[name] = decodeURIComponent(value);
    } catch {
      list[name] = value;
    }
  });
  return list;
}

/**
 * Middleware untuk memastikan kasir sudah login
 * Jika belum login, redirect ke halaman /login
 */
function requireAuth(req, res, next) {
  const cookies = parseCookies(req);
  if (cookies.mylaundry_session) {
    try {
      req.user = JSON.parse(cookies.mylaundry_session);
      res.locals.currentUser = req.user;
      return next();
    } catch (e) {
      // Cookie invalid
    }
  }
  return res.redirect('/login');
}

/**
 * Middleware jika kasir sudah login, jangan izinkan buka /login lagi (langsung ke dashboard)
 */
function guestOnly(req, res, next) {
  const cookies = parseCookies(req);
  if (cookies.mylaundry_session) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  parseCookies,
  requireAuth,
  guestOnly
};
