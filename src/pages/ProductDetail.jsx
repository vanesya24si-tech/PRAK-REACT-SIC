import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
      <img
        src={product.image_url}
        alt={product.name}
        className="rounded-xl mb-4 w-64 h-40 object-cover mx-auto"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-1">Deskripsi: {product.description}</p>
      <p className="text-gray-600 mb-1">Stok: {product.stock}</p>
      <p className="text-gray-800 font-semibold text-lg">
        Harga: Rp {Number(product.price).toLocaleString('id-ID')}
      </p>
    </div>
  );
}