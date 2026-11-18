/**
 * Middleware Validasi Input Chat AI Assistant
 * PPAW Week 9 - Prompt Engineering & Backend Guardrails
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

// Daftar pola prompt injection yang sering digunakan untuk membobol instruksi sistem
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /abaikan\s+(semua\s+)?(instruksi|perintah|aturan)\s+(sebelumnya|di\s+atas)/i,
  /forget\s+(your\s+)?(system\s+)?prompt/i,
  /lupakan\s+(semua\s+)?(aturan|instruksi|peran)/i,
  /you\s+are\s+now\s+a\s+(developer|programmer|hacker|dan|unrestricted)/i,
  /kamu\s+sekarang\s+adalah\s+(programmer|hacker|bot\s+bebas|ai\s+tanpa\s+batasan)/i,
  /bypass\s+guardrail/i,
  /system\s+override/i,
  /roleplay\s+as\s+an\s+unrestricted/i
];

/**
 * Middleware untuk memvalidasi body pesan chat pengguna
 */
function validateChatInput(req, res, next) {
  const { message } = req.body;

  // 1. Validasi keberadaan & tipe data input
  if (message === undefined || message === null) {
    return res.status(400).json({
      success: false,
      message: 'Field "message" wajib disertakan dalam request body.'
    });
  }

  if (typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Format "message" harus berupa teks (string).'
    });
  }

  const trimmedMessage = message.trim();

  // 2. Validasi pesan kosong
  if (trimmedMessage.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Pesan pertanyaan tidak boleh kosong atau hanya berupa spasi.'
    });
  }

  // 3. Validasi batas panjang pesan (Guardrail Panjang Pesan: 2 - 500 karakter)
  if (trimmedMessage.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Pesan terlalu pendek. Masukkan pertanyaan minimal 2 karakter.'
    });
  }

  if (trimmedMessage.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Pesan terlalu panjang. Maksimal 500 karakter per pertanyaan untuk efisiensi context AI.'
    });
  }

  // 4. Deteksi potensi Prompt Injection di tingkat Backend (Backend Guardrail)
  const isInjectionDetected = INJECTION_PATTERNS.some(pattern => pattern.test(trimmedMessage));
  if (isInjectionDetected) {
    return res.status(400).json({
      success: false,
      message: 'Permintaan ditolak oleh sistem keamanan (Guardrail): Terdeteksi upaya manipulasi instruksi sistem (Prompt Injection). Silakan tanyakan hal terkait layanan MyLaundry.',
      data: {
        reply: 'Maaf, saya tidak dapat memproses permintaan yang mencoba mengubah aturan atau peran sistem saya. Saya adalah asisten resmi MyLaundry dan hanya dapat membantu menjawab pertanyaan seputar paket layanan, harga, status antrean cucian, dan operasional toko kami.'
      }
    });
  }

  // Sanitasi sederhana: simpan pesan yang sudah dibersihkan ke req.cleanMessage
  req.cleanMessage = trimmedMessage;
  next();
}

module.exports = validateChatInput;
