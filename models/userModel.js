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
  },
  {
    id: 'USR-002',
    username: 'admin',
    email: 'admin@mylaundry.com',
    password: 'admin',
    altPassword: '123456',
    name: 'Administrator',
    role: 'Admin Toko',
    avatar: 'AD',
    branch: 'Pusat'
  }
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
}

module.exports = UserModel;
