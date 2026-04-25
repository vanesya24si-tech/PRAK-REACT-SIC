// export const orders = Array.from({ length: 30 }, (_, i) => ({
//   orderId: `ORD-${String(i + 1).padStart(3, "0")}`,
//   customerName: `Customer ${i + 1}`,
//   status: ["Pending", "Completed", "Cancelled"][i % 3],
//   totalPrice: Math.floor(Math.random() * 1000000),
//   orderDate: `2026-04-${String((i % 30) + 1).padStart(2, "0")}`,
// }));