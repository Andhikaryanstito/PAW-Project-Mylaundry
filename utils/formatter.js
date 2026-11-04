/**
 * Helper Utility Functions
 * Format mata uang, tanggal, jam estimasi antrean, dan nomor WhatsApp
 */

/**
 * Format angka ke format mata uang Rupiah (contoh: Rp 24.500)
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Format tanggal ke format lokal Indonesia
 * @param {Date|string} dateInput
 * @returns {string}
 */
function formatDateTime(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return date.toLocaleDateString('id-ID', options) + ' WIB';
}

/**
 * Normalisasi nomor WhatsApp lokal ke format wa.me (diawali 62)
 * @param {string} phone
 * @returns {string}
 */
function formatPhoneWA(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Hitung estimasi jam selesai cucian berdasarkan paket, beban antrean toko, dan cuaca
 * @param {number} packageHours - Waktu standar paket dalam jam
 * @param {number} currentQueueKg - Total kilogram cucian yang sedang diproses
 * @param {boolean} isRaining - Apakah cuaca sedang hujan deras
 * @returns {object}
 */
function calculateReadyTime(packageHours = 48, currentQueueKg = 0, isRaining = false) {
  const now = new Date();
  
  // Buffer antrean: tiap 10 kg cucian aktif menambah 1 jam waktu proses
  const queueBufferHours = Math.floor(currentQueueKg / 10);
  
  // Buffer hujan lebat: +4 jam pengeringan (sesuai PRD US-06)
  const weatherBufferHours = isRaining ? 4 : 0;
  
  const totalHours = packageHours + queueBufferHours + weatherBufferHours;
  const readyDate = new Date(now.getTime() + (totalHours * 60 * 60 * 1000));
  
  return {
    totalHours,
    readyDate,
    formatted: formatDateTime(readyDate),
    queueBufferHours,
    weatherBufferHours
  };
}

module.exports = {
  formatCurrency,
  formatDateTime,
  formatPhoneWA,
  calculateReadyTime
};
