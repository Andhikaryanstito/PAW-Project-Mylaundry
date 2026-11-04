/**
 * Middleware Logger HTTP Request
 * Tugas Praktikum PAW - Week 7
 * 
 * Persyaratan:
 * 1. Catat metode HTTP (GET, POST, dll.)
 * 2. Catat path atau endpoint yang diakses
 * 3. Catat status response HTTP (200, 404, dll.)
 * 4. Catat waktu request atau timestamp
 * 5. Log muncul pada terminal / console backend
 */

function requestLogger(req, res, next) {
  const startTime = Date.now();
  const requestDate = new Date();
  
  // Format timestamp: YYYY-MM-DD HH:mm:ss
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${requestDate.getFullYear()}-${pad(requestDate.getMonth() + 1)}-${pad(requestDate.getDate())} ` +
                    `${pad(requestDate.getHours())}:${pad(requestDate.getMinutes())}:${pad(requestDate.getSeconds())}`;

  const method = req.method;
  const url = req.originalUrl || req.url;

  // Catat saat response selesai dikirim (finish event) untuk mendapatkan HTTP status code
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Kode warna ANSI untuk console terminal agar mudah dibaca dosen / asisten praktikum
    let statusColor = '\x1b[32m'; // Hijau untuk 2xx
    if (statusCode >= 500) {
      statusColor = '\x1b[31m'; // Merah untuk 5xx
    } else if (statusCode >= 400) {
      statusColor = '\x1b[33m'; // Kuning untuk 4xx
    } else if (statusCode >= 300) {
      statusColor = '\x1b[36m'; // Cyan untuk 3xx
    }
    const resetColor = '\x1b[0m';
    const boldColor = '\x1b[1m';

    // Format output console log sesuai spesifikasi Tugas Praktikum 7:
    // [TIMESTAMP] METHOD PATH -> STATUS DURATION
    console.log(
      `[${boldColor}${timestamp}${resetColor}] ` +
      `\x1b[35m${method.padEnd(6)}\x1b[0m ` +
      `\x1b[37m${url.padEnd(25)}\x1b[0m ` +
      `Status: ${statusColor}${statusCode}${resetColor} ` +
      `(${duration}ms)`
    );
  });

  next();
}

module.exports = requestLogger;
