/**
 * Konfigurasi Integrasi Google Gemini API
 * PPAW Week 9 - Project Berkelanjutan
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

require('dotenv').config();

// Model default Google Gemini aktif: gemini-3.5-flash-lite
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const isConfigured = () => {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 10);
};

if (isConfigured()) {
  console.log(`[Gemini Config] Google Gemini API Key terdeteksi. Model aktif: ${GEMINI_MODEL}`);
} else {
  console.warn('[Gemini Config] CATATAN: GEMINI_API_KEY belum disetel di .env.');
}

module.exports = {
  GEMINI_MODEL,
  GEMINI_API_KEY,
  isConfigured
};
