import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

// Menambahkan { title } sebagai props
export default function Header({ title }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = profile?.role === "Admin";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-sm font-semibold transition-colors pb-1 ${
      isActive 
        ? "text-pink-600 border-b-2 border-pink-500" 
        : "text-gray-600 hover:text-pink-500"
    }`;
  };

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-100">
      
      {/* Judul/Logo */}
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isAdmin ? (title || "Dashboard") : "🌸 Sedap Resto"}
        </h2>

        {/* Navigasi khusus Member (karena tidak ada sidebar) */}
        {!isAdmin && profile && (
          <nav className="flex items-center gap-6 border-l pl-6">
            <Link to="/" className={getLinkClass("/")}>
              Dashboard
            </Link>
            <Link to="/products" className={getLinkClass("/products")}>
              Katalog
            </Link>
            <Link to="/orders" className={getLinkClass("/orders")}>
              Pesanan Saya
            </Link>
          </nav>
        )}
      </div>

      {/* Search - Hanya untuk Admin */}
      {isAdmin && (
        <div className="relative w-[420px]">
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm transition-all"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative bg-pink-50 p-2.5 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors">
          <FaBell className="text-pink-600" />
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            50
          </span>
        </div>

        {/* Chart */}
        <div className="bg-gray-50 p-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <FcAreaChart className="text-lg" />
        </div>

        {/* Settings */}
        <div className="bg-gray-50 p-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <SlSettings className="text-gray-600" />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 ml-2 border-l pl-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Hello,</p>
            <p className="text-sm font-bold text-gray-800">{profile?.name || "User"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-100">
            <span className="text-pink-600 font-bold text-sm">
              {profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
            </span>
          </div>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-red-600 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt />
          </div>
        </div>
      </div>
    </div>
  );
}