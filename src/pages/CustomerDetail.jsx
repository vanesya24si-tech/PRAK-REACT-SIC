import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-600';
      case 'Gold': return 'bg-yellow-100 text-yellow-600';
      case 'Silver': return 'bg-gray-100 text-gray-600';
      case 'Bronze': return 'bg-orange-100 text-orange-600';
      default: return 'bg-orange-100 text-orange-600';
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!customer) return <div className="p-4 text-red-600">Customer not found</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl text-pink-600 font-bold">
            {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{customer.name}</h2>
        <p className="text-gray-600 mb-1">ID: {customer.id}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Email</span>
          <span className="text-gray-600">{customer.email}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Role</span>
          <span className="text-gray-600">{customer.role}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Points</span>
          <span className="text-gray-600">{customer.points}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Loyalty Level</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierBadge(customer.tier)}`}>
            {customer.tier}
          </span>
        </div>
      </div>
    </div>
  );
}