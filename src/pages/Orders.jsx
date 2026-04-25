import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { ordersData } from "../utils/data";

export default function Orders() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <PageHeader title="Orders" breadcrumb="Dashboard / Orders">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-pink-200"
        >
          + Add Orders
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {ordersData.map((o) => (
              <tr key={o.orderId} className="border-t hover:bg-pink-50/30">
                <td className="px-6 py-4">{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4">{o.status}</td>
                <td className="px-6 py-4">Rp {o.totalPrice}</td>
                <td className="px-6 py-4">{o.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Tambah Order</h2>

            <input placeholder="Customer Name" className="border p-2 w-full mb-2" />

            <select className="border p-2 w-full mb-2">
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input placeholder="Total Price" className="border p-2 w-full mb-2" />
            <input type="date" className="border p-2 w-full mb-2" />

            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-3 py-1 mt-2"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}