import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });
  const { profile } = useAuth();

  // Quick Order states for Member
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const handleQuickOrder = (product) => {
    setSelectedProduct(product);
    setOrderQty(1);
    setShowOrderModal(true);
  };

  const getDiscountRate = (tier) => {
    switch (tier) {
      case "Platinum": return 0.20;
      case "Gold": return 0.15;
      case "Silver": return 0.10;
      default: return 0.05;
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || orderQty <= 0) return;

    setSubmittingOrder(true);
    try {
      const subtotal = selectedProduct.price * orderQty;
      const discountRate = getDiscountRate(profile?.tier);
      const discountAmount = subtotal * discountRate;
      const totalFinal = subtotal - discountAmount;

      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          member_id: profile.id,
          total_original: subtotal,
          discount_amount: discountAmount,
          total_final: totalFinal,
          status: "Pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order item
      const { error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: orderData.id,
          product_id: selectedProduct.id,
          quantity: orderQty,
          price_at_purchase: selectedProduct.price,
        });

      if (itemError) throw itemError;

      // 3. Update product stock in database
      await supabase
        .from("products")
        .update({ stock: selectedProduct.stock - orderQty })
        .eq("id", selectedProduct.id);

      // 4. Update member points in profiles
      const earnedPoints = Math.floor(totalFinal / 1000);
      await supabase
        .from("profiles")
        .update({ points: (profile.points || 0) + earnedPoints })
        .eq("id", profile.id);

      alert(`Pesanan berhasil dibuat! Anda mendapatkan +${earnedPoints} poin. Silakan cek menu Pesanan Saya.`);
      setShowOrderModal(false);
      await fetchProducts(); // Refresh stock
    } catch (err) {
      alert("Gagal membuat pesanan: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image_url: formData.image_url
        }]);
      if (insertError) throw insertError;
      setFormData({ name: '', description: '', price: '', stock: '', image_url: '' });
      setShowModal(false);
      await fetchProducts();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await fetchProducts();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <PageHeader title="Products" breadcrumb="Dashboard / Products">
        {profile?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg shadow-pink-200 transition-all"
          >
            + Add Product
          </button>
        )}
      </PageHeader>
      
      {/* TAMPILAN KATALOG CARD UNTUK MEMBER / CUSTOMER */}
      {profile?.role === 'Member' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              <div className="h-44 w-full bg-pink-50 relative overflow-hidden">
                <img 
                  src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">
                  Stok: {item.stock}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1.5">{item.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                    {item.description || "Menu makanan spesial dari Sedap Resto yang diolah dengan bahan premium."}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-400">Harga</span>
                    <span className="text-base font-black text-pink-600">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button 
                    disabled={item.stock <= 0}
                    onClick={() => handleQuickOrder(item)}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold py-2.5 rounded-xl transition duration-300 shadow-md shadow-pink-100"
                  >
                    {item.stock > 0 ? "🛒 Pesan Sekarang" : "Habis"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TAMPILAN TABEL CRUD UNTUK ADMIN */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  {profile?.role === 'Admin' && (
                    <th className="px-6 py-4 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <Link to={`/products/${item.id}`} className="text-emerald-400 hover:text-emerald-500">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.description ? item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.stock}</td>
                    {profile?.role === 'Admin' && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg shadow-pink-200 transition-all"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Checkout / Quick Order (Member) */}
      {showOrderModal && selectedProduct && (() => {
        const subtotal = selectedProduct.price * orderQty;
        const discountRate = getDiscountRate(profile?.tier);
        const discountAmount = subtotal * discountRate;
        const totalFinal = subtotal - discountAmount;
        const earnedPoints = Math.floor(totalFinal / 1000);

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🛒 Konfirmasi Pesanan</h2>
              
              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-pink-50">
                  <img 
                    src={selectedProduct.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">Stok Tersedia: {selectedProduct.stock}</p>
                  <p className="text-sm font-black text-pink-600 mt-2">
                    Rp {Number(selectedProduct.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Jumlah Porsi</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.stock}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.min(selectedProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                {/* Ringkasan Biaya */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal ({orderQty} Porsi)</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Diskon ({profile?.tier} - {(discountRate * 100).toFixed(0)}%)</span>
                    <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-800 border-t border-gray-200 pt-2">
                    <span>Total Bersih</span>
                    <span>Rp {totalFinal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="text-[10px] text-pink-500 font-semibold text-right mt-1">
                    Loyalty Points: +{earnedPoints} Poin
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-pink-200 transition"
                  >
                    {submittingOrder ? "Memproses..." : "Konfirmasi & Bayar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}