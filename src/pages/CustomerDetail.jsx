import { useParams } from "react-router-dom";
import { customersData } from "../utils/data";

export default function CustomerDetail() {
  const { id } = useParams();
  const customer = customersData.find(c => c.id === id);

  if (!customer) {
    return <div className="p-4 text-red-600">Customer not found</div>;
  }

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
          <span className="font-medium text-gray-700">Phone</span>
          <span className="text-gray-600">{customer.phone}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Loyalty Level</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold 
            ${customer.loyalty === 'Gold' ? 'bg-yellow-100 text-yellow-600' : 
              customer.loyalty === 'Silver' ? 'bg-gray-100 text-gray-600' : 
              'bg-orange-100 text-orange-600'}`}>
            {customer.loyalty}
          </span>
        </div>
      </div>
    </div>
  );
}