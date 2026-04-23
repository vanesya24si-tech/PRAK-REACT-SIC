export const ordersData = Array.from({ length: 30 }, (_, i) => ({
  id: `#INV-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  status: ["Pending", "Completed", "Cancelled"][i % 3],
  total: `Rp ${(i + 1) * 50000}`,
  date: "2026-04-23"
}));

export const customersData = Array.from({ length: 30 }, (_, i) => ({
  id: `CUS-${2000 + i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `08123456${i}`,
  loyalty: ["Bronze", "Silver", "Gold"][i % 3]
}));