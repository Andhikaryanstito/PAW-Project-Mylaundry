/**
 * Routing Endpoint AI Assistant (Google Gemini)
 * PPAW Week 9 - Project Berkelanjutan
 * Penulis: Andhika Ryan Stito (20240140263) - Kelas D
 * 
 * Endpoints:
 * - POST /api/chat        -> Mengirim pesan pengguna ke AI dan menerima respons
 * - GET  /api/chat/status -> Mengecek status layanan AI
 */

const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');
const validateChatInput = require('../middlewares/validateChatInput');

// Endpoint utama AI Assistant (Wajib Tugas Week 9)
router.post('/chat', validateChatInput, ChatController.handleChat);

// Endpoint status layanan AI
router.get('/chat/status', ChatController.getStatus);

module.exports = router;
