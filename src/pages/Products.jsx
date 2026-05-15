import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <PageHeader title="Products" breadcrumb="Dashboard / Products">
        <button 
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg shadow-pink-200 transition-all"
        >
          + Add Product
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Brand</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <Link to={`/products/${item.id}`} className="text-emerald-400 hover:text-emerald-500">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Rp {item.price * 1000}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}