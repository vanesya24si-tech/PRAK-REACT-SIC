export const ordersData = Array.from({ length: 30 }, (_, i) => ({
  id: `#INV-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  status: ["Pending", "Completed", "Cancelled"][i % 3],
  total: `Rp ${(i + 1) * 50000}`,
  date: "2026-04-23"
}));

const customerNames = [
  "Alya Putri",
  "Bima Santoso",
  "Citra Dewi",
  "Dwi Prasetyo",
  "Eka Rahmawati",
  "Fajar Ramadhan",
  "Gita Kusuma",
  "Hendra Fauzi",
  "Intan Maharani",
  "Johan Nugroho",
  "Kirana Sari",
  "Lutfi Adriansyah",
  "Maya Kurnia",
  "Naufal Pratama",
  "Okti Nuraini",
  "Putri Aulia",
  "Rafiq Hidayat",
  "Sinta Amalia",
  "Teddy Saputra",
  "Umi Safitri",
  "Vicky Andika",
  "Wulan Meilani",
  "Xavier Hartono",
  "Yudha Wahyudi",
  "Zahra Fatimah",
  "Angga Prakoso",
  "Bella Kusuma",
  "Chandra Wijaya",
  "Diana Lestari",
  "Evan Maulana"
];

export const customersData = customerNames.map((name, index) => ({
  id: `CUS-${2000 + index}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  phone: `0812${Math.floor(10000000 + index * 123456)}`,
  loyalty: ["Bronze", "Silver", "Gold"][index % 3]
}));