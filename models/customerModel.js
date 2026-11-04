/**
 * Model Data Pelanggan Langganan
 * Sesuai PRD US-02: Fitur saran otomatis nama & nomor WhatsApp
 */

const customers = [
  { id: 'CUST-01', name: 'Budi Santoso', phone: '081234567890', note: 'Langganan kemeja kantor' },
  { id: 'CUST-02', name: 'Siti Rahmawati', phone: '085712345678', note: 'Gamis & jilbab lembut' },
  { id: 'CUST-03', name: 'Mas Dimas (Kost Putra)', phone: '089698765432', note: 'Pakaian futsal & celana jeans' },
  { id: 'CUST-04', name: 'Ibu Ratna Dewi', phone: '081388990011', note: 'Sprei king size & selimut tebal' },
  { id: 'CUST-05', name: 'Ahmad Fauzi', phone: '082155443322', note: 'Kaos oblong & jaket hoodie' },
  { id: 'CUST-06', name: 'Pak Bambang', phone: '081223344556', note: 'Kemeja batik & dinas' },
  { id: 'CUST-07', name: 'Rina Kusuma', phone: '087711223344', note: 'Blazer & rok plisket' }
];

class CustomerModel {
  static getAll() {
    return customers;
  }

  static search(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }
}

module.exports = CustomerModel;
