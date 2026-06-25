import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- DATA DUMMY ---
const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "Mei", revenue: 6000 },
  { name: "Jun", revenue: 7000 },
];

function Card({ icon, value, label, bg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4 border-l-4 border-pink-500">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg} text-white text-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Selesai": return "bg-pink-100 text-pink-600"; // Pink untuk selesai
    case "Proses": return "bg-purple-100 text-purple-600";
    case "Batal": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const statusMap = (status) => {
  switch (status) {
    case "Completed": return "Selesai";
    case "Pending": return "Proses";
    case "Cancelled": return "Batal";
    default: return status;
  }
};

const getTierColor = (tier) => {
  switch (tier) {
    case "Bronze": return "bg-orange-100 text-orange-600";
    case "Silver": return "bg-gray-200 text-gray-600";
    case "Gold": return "bg-yellow-100 text-yellow-600";
    case "Platinum": return "bg-purple-100 text-purple-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getTierDiscount = (tier) => {
  switch (tier) {
    case "Bronze": return 5;
    case "Silver": return 10;
    case "Gold": return 15;
    case "Platinum": return 20;
    default: return 0;
  }
};

const getTierGradient = (tier) => {
  switch (tier) {
    case "Bronze": return "from-amber-700 via-amber-600 to-amber-800 text-white";
    case "Silver": return "from-slate-400 via-slate-300 to-slate-500 text-slate-800";
    case "Gold": return "from-yellow-500 via-yellow-400 to-yellow-600 text-yellow-950";
    case "Platinum": return "from-indigo-900 via-purple-800 to-indigo-950 text-white";
    default: return "from-pink-500 via-pink-400 to-pink-600 text-white";
  }
};

const getNextTierInfo = (points) => {
  if (points < 500) {
    return { next: "Silver", req: 500, currentMin: 0, nextMin: 500 };
  } else if (points < 1500) {
    return { next: "Gold", req: 1500, currentMin: 500, nextMin: 1500 };
  } else if (points < 5000) {
    return { next: "Platinum", req: 5000, currentMin: 1500, nextMin: 5000 };
  } else {
    return { next: "Max Tier", req: 5000, currentMin: 5000, nextMin: 5000 };
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

export default function Dashboard() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      if (profile.role === "Admin") {
        await fetchAdminData();
      } else {
        await fetchMemberData();
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchAdminData = async () => {
    // Fetch aggregate stats in parallel
    const [totalRes, completedRes, cancelledRes, revenueRes, ordersRes] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Completed"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Cancelled"),
      supabase.from("orders").select("total_final").eq("status", "Completed"),
      supabase.from("orders").select("*, profiles(name)").order("created_at", { ascending: false }).limit(5),
    ]);

    const totalRevenue = revenueRes.data
      ? revenueRes.data.reduce((sum, order) => sum + Number(order.total_final), 0)
      : 0;

    setStats({
      totalOrders: totalRes.count || 0,
      completedOrders: completedRes.count || 0,
      cancelledOrders: cancelledRes.count || 0,
      totalRevenue,
    });

    if (ordersRes.data) {
      const mapped = ordersRes.data.map((order) => ({
        id: `#${order.id.slice(0, 8).toUpperCase()}`,
        name: order.profiles?.name || "Unknown",
        amount: formatCurrency(order.total_final),
        status: statusMap(order.status),
        date: formatDate(order.created_at),
      }));
      setRecentOrders(mapped);
    }
  };

  const fetchMemberData = async () => {
    // Fetch member's order stats in parallel
    const [totalRes, completedRes, cancelledRes, revenueRes, ordersRes] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("member_id", profile.id),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("member_id", profile.id).eq("status", "Completed"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("member_id", profile.id).eq("status", "Cancelled"),
      supabase.from("orders").select("total_final").eq("member_id", profile.id).eq("status", "Completed"),
      supabase.from("orders").select("*").eq("member_id", profile.id).order("created_at", { ascending: false }).limit(5),
    ]);

    const totalSpent = revenueRes.data
      ? revenueRes.data.reduce((sum, order) => sum + Number(order.total_final), 0)
      : 0;

    setStats({
      totalOrders: totalRes.count || 0,
      completedOrders: completedRes.count || 0,
      cancelledOrders: cancelledRes.count || 0,
      totalRevenue: totalSpent,
    });

    if (ordersRes.data) {
      const mapped = ordersRes.data.map((order) => ({
        id: `#${order.id.slice(0, 8).toUpperCase()}`,
        name: profile.name,
        amount: formatCurrency(order.total_final),
        status: statusMap(order.status),
        date: formatDate(order.created_at),
      }));
      setRecentOrders(mapped);
    }
  };

  const formatRevenue = (value) => {
    if (value >= 1_000_000_000) return `Rp.${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `Rp.${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `Rp.${(value / 1_000).toFixed(1)}K`;
    return formatCurrency(value);
  };

  if (authLoading || (loadingData && profile)) {
    return (
      <div className="px-6 py-5 overflow-y-auto h-[calc(100vh-80px)]">
        <PageHeader title="Dashboard" breadcrumb="Dashboard / Overview" buttonText="+ Add Widget" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-6 py-5 overflow-y-auto h-[calc(100vh-80px)]">
        <PageHeader title="Dashboard" breadcrumb="Dashboard / Overview" />
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-2xl p-6 shadow-sm border border-pink-100 mt-4">
          <p className="text-red-500 font-bold text-lg mb-2">Profil Tidak Ditemukan</p>
          <p className="text-gray-500 text-sm text-center max-w-md mb-6">
            Akun Anda berhasil masuk, namun data profil Anda tidak ditemukan di database. Akun ini kemungkinan terbuat saat trigger database Anda sedang error. Silakan Log Out dan daftar kembali dengan akun baru.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 px-5 rounded-xl transition duration-300 shadow-md shadow-pink-100 text-sm"
          >
            Log Out & Daftar Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 overflow-y-auto h-[calc(100vh-80px)]">
      <PageHeader title="Dashboard" breadcrumb="Dashboard / Overview" buttonText="+ Add Widget" />

      {/* MEMBER LOYALTY CARD & PRIVILEGES */}
      {profile?.role === "Member" && (() => {
        const points = profile.points || 0;
        const tierInfo = getNextTierInfo(points);
        let progressPercent = 100;
        if (tierInfo.next !== "Max Tier") {
          const range = tierInfo.nextMin - tierInfo.currentMin;
          const currentProgress = points - tierInfo.currentMin;
          progressPercent = Math.min(Math.max((currentProgress / range) * 100, 0), 100);
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            
            {/* Loyalty Digital Card (Left / Col-Span-1) */}
            <div className={`relative h-56 rounded-2xl shadow-xl flex flex-col justify-between p-6 overflow-hidden bg-gradient-to-br ${getTierGradient(profile.tier)} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
              {/* Card Hologram Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
              
              {/* Header Card */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] tracking-[0.2em] font-semibold opacity-80 uppercase">Sedap Loyalty Club</p>
                  <h3 className="text-lg font-bold tracking-wide mt-1">MEMBERSHIP CARD</h3>
                </div>
                <div className="w-12 h-8 rounded bg-yellow-400/80 border border-yellow-300 opacity-80 flex items-center justify-center overflow-hidden">
                  {/* Micro chip pattern lines */}
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1.5 opacity-30">
                    <div className="border border-black"></div>
                    <div className="border border-black"></div>
                    <div className="border border-black"></div>
                    <div className="border border-black"></div>
                    <div className="border border-black"></div>
                    <div className="border border-black"></div>
                  </div>
                </div>
              </div>

              {/* Name & Tier */}
              <div>
                <p className="text-xs opacity-75 uppercase">Card Holder</p>
                <h4 className="text-base font-bold tracking-wider truncate uppercase">{profile.name}</h4>
              </div>

              {/* Footer / Info */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] opacity-75 uppercase">Tier Status</p>
                  <p className="text-lg font-black tracking-widest uppercase">{profile.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-75 uppercase">Card Number</p>
                  <p className="font-mono text-xs tracking-widest">
                    **** **** **** {profile.id?.slice(0, 4).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Privileges & Progress (Right / Col-Span-2) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:col-span-2 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>👑</span> Tingkat Keanggotaan & Keuntungan
                  </h3>
                  <span className="text-xs text-pink-500 font-bold bg-pink-50 px-3 py-1 rounded-full">
                    Diskon Aktif: {getTierDiscount(profile.tier)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Selamat! Anda saat ini berada di tier <strong className="text-gray-800">{profile.tier}</strong>. 
                  Anda berhak mendapatkan potongan langsung sebesar <strong className="text-pink-600">{getTierDiscount(profile.tier)}%</strong> untuk setiap pesanan makanan di Sedap Resto.
                </p>
              </div>

              {/* Progress Bar to next tier */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-400">Akumulasi Poin: <strong className="text-pink-600 text-sm">{points}</strong> Poin</span>
                  {tierInfo.next !== "Max Tier" ? (
                    <span className="text-gray-500">
                      Butuh <strong className="text-gray-700">{tierInfo.req - points}</strong> poin lagi ke tier <strong className="text-pink-600">{tierInfo.next}</strong>
                    </span>
                  ) : (
                    <span className="text-green-500 font-bold">🎉 Tier Maksimum Tercapai!</span>
                  )}
                </div>
                {tierInfo.next !== "Max Tier" && (
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-1000 shadow-md"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      })()}

      {/* STATS CARDS dengan nuansa Pink */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
        {loadingData ? (
          <>
            <Card icon={<FaShoppingCart />} value="..." label={profile?.role === "Admin" ? "Total Orders" : "Total Pesanan Saya"} bg="bg-pink-400" />
            <Card icon={<FaTruck />} value="..." label={profile?.role === "Admin" ? "Total Delivered" : "Selesai"} bg="bg-pink-400" />
            <Card icon={<FaBan />} value="..." label={profile?.role === "Admin" ? "Total Canceled" : "Dibatalkan"} bg="bg-pink-400" />
            <Card icon={<FaDollarSign />} value="..." label={profile?.role === "Admin" ? "Total Revenue" : "Total Belanja"} bg="bg-pink-400" />
          </>
        ) : (
          <>
            <Card icon={<FaShoppingCart />} value={stats.totalOrders} label={profile?.role === "Admin" ? "Total Orders" : "Total Pesanan Saya"} bg="bg-pink-400" />
            <Card icon={<FaTruck />} value={stats.completedOrders} label={profile?.role === "Admin" ? "Total Delivered" : "Selesai"} bg="bg-pink-400" />
            <Card icon={<FaBan />} value={stats.cancelledOrders} label={profile?.role === "Admin" ? "Total Canceled" : "Dibatalkan"} bg="bg-pink-400" />
            <Card icon={<FaDollarSign />} value={formatRevenue(stats.totalRevenue)} label={profile?.role === "Admin" ? "Total Revenue" : "Total Belanja"} bg="bg-pink-400" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {/* GRAFIK PENDAPATAN (Hanya untuk Admin) */}
        {profile?.role === "Admin" && (
          <div className="bg-white rounded-2xl shadow-sm px-6 py-5 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grafik Pendapatan</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FCE7F3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                  <Tooltip cursor={{ fill: '#FDF2F8' }} />
                  <Bar dataKey="revenue" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TRANSAKSI TERAKHIR */}
        <div className={`bg-white rounded-2xl shadow-sm px-6 py-5 ${profile?.role === "Admin" ? "lg:col-span-1" : "lg:col-span-3"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {profile?.role === "Admin" ? "Transaksi Terakhir" : "Riwayat Pesanan Saya"}
            </h2>
            <button 
              onClick={() => navigate("/orders")}
              className="text-sm text-pink-500 font-medium hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {loadingData ? (
              <p className="text-gray-400 text-sm text-center py-4">Memuat transaksi...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Belum ada transaksi</p>
            ) : (
              recentOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{order.name}</p>
                    <p className="text-xs text-gray-400">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}