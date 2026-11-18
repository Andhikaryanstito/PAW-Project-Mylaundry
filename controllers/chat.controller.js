/**
 * Controller Chat AI Assistant (Google Gemini)
 * PPAW Week 9 - Project Berkelanjutan
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 */

const GeminiService = require('../services/gemini.service');

class ChatController {
  /**
   * Menangani request pesan pengguna dan mengembalikan respons AI
   * Endpoint: POST /api/chat
   * Body: { "message": "Pertanyaan pengguna..." }
   */
  static async handleChat(req, res) {
    try {
      // Ambil pesan yang sudah dibersihkan dan divalidasi oleh middleware
      const message = req.cleanMessage || req.body.message;

      // Panggil Gemini Service untuk memproses context dan generate response
      const reply = await GeminiService.generateReply(message);

      // Kembalikan format respons sesuai ketentuan tugas praktikum:
      // { "success": true, "data": { "reply": "..." } }
      return res.status(200).json({
        success: true,
        data: {
          reply: reply,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[ChatController Error]:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message || 'Gagal memproses permintaan chat ke Gemini AI.'
      });
    }
  }

  /**
   * Endpoint opsional untuk mengecek status konfigurasi AI
   * GET /api/chat/status
   */
  static async getStatus(req, res) {
    const { isConfigured, GEMINI_MODEL } = require('../config/gemini');
    return res.status(200).json({
      success: true,
      data: {
        service: 'Google Gemini AI Assistant',
        model: GEMINI_MODEL,
        configured: isConfigured(),
        status: 'Online & Ready'
      }
    });
  }
}

module.exports = ChatController;
