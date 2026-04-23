import PageHeader from "../components/PageHeader";
import { ordersData } from "../utils/data";

export default function Orders() {
  return (
    <div className="p-8">
      <PageHeader title="Orders" breadcrumb="Dashboard / Orders">
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-pink-200">
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
            </tr>
          </thead>
          <tbody>
            {ordersData.map((o) => (
              <tr key={o.id} className="border-t hover:bg-pink-50/30">
                <td className="px-6 py-4">{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4">{o.status}</td>
                <td className="px-6 py-4">{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}