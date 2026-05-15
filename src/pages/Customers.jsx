import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { customersData } from "../utils/data"; // Pastikan path benar

export default function Customers() {
  // State untuk modal form (opsional, tinggal panggil setShowModal(true))
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <PageHeader title="Customers" breadcrumb="Dashboard / Customers">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg shadow-pink-200 transition-all"
        >
          + Add Customer
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Customer ID</th>
                <th className="px-6 py-4 font-medium">Nama</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Loyalty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customersData.map((c) => (
                <tr key={c.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{c.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <Link to={`/customers/${c.id}`} className="text-emerald-400 hover:text-emerald-500">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${c.loyalty === 'Gold' ? 'bg-yellow-100 text-yellow-600' : 
                        c.loyalty === 'Silver' ? 'bg-gray-100 text-gray-600' : 
                        'bg-orange-100 text-orange-600'}`}>
                      {c.loyalty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}