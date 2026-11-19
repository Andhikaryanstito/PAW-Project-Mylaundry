/**
 * Model Data User / Kasir
 * Pengelolaan autentikasi login kasir MyLaundry
 */

const users = [
  {
    id: 'USR-001',
    username: 'sarah',
    email: 'sarah@mylaundry.com',
    password: 'password', // Password fleksibel: bisa 'password' atau '123456'
    altPassword: '123456',
    name: 'Sarah Anggraini',
    role: 'Kasir & Pemilik Toko',
    avatar: 'SA',
    branch: 'Bantul, Yogyakarta'
  }
  // Catatan: Hanya 1 user sesuai PRD — persona tunggal Sarah Anggraini (Kasir & Pemilik Toko)
];

class UserModel {
  static getAll() {
    return users;
  }

  static findByUsernameOrEmail(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return users.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean) || null;
  }

  static authenticate(identifier, password) {
    const user = this.findByUsernameOrEmail(identifier);
    if (!user) return { success: false, message: 'Username atau email tidak terdaftar.' };

    const cleanPass = password ? password.trim() : '';
    if (cleanPass === user.password || cleanPass === user.altPassword) {
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          branch: user.branch
        }
      };
    }

    return { success: false, message: 'Kata sandi (password) yang Anda masukkan salah.' };
  }

  static updateProfile(identifier, data) {
    const user = this.findByUsernameOrEmail(identifier) || users[0];
    if (!user) return null;
    if (data.name) user.name = data.name.trim();
    if (data.email) user.email = data.email.trim();
    if (data.branch) user.branch = data.branch.trim();
    if (data.role) user.role = data.role.trim();
    if (data.name) {
      user.avatar = data.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }
    return user;
  }
}

module.exports = UserModel;
