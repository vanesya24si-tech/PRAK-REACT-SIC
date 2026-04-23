import { FaThLarge, FaList, FaHeadphones } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive 
        ? "bg-pink-100 text-pink-600 shadow-sm" 
        : "text-gray-500 hover:bg-pink-50 hover:text-pink-500"
    }`;

  return (
    <div className="w-64 h-screen bg-[#F8F9FB] flex flex-col justify-between px-6 py-6 border-r border-gray-100">
      <div>
        <div className="mb-10 px-2">
          <h1 className="text-5xl font-bold text-gray-800">Sedap<span className="text-pink-500">.</span></h1>
          <p className="text-sm text-gray-400 mt-1">Modern Admin Dashboard</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" className={navClass}><FaThLarge /> Dashboard</NavLink>
          <NavLink to="/orders" className={navClass}><FaList /> Orders</NavLink>
          <NavLink to="/customers" className={navClass}><FaHeadphones /> Customers</NavLink>
        </nav>
      </div>

      <div className="bg-pink-500 rounded-2xl p-4 text-white shadow-lg shadow-pink-200">
        <p className="text-sm leading-tight mb-3">Organize your menus!</p>
        <button className="bg-white text-pink-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100">
          + Add Menus
        </button>
      </div>
    </div>
  );
}