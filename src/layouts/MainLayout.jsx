import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "Admin";

  return (
    <div className="w-screen min-h-screen flex bg-[#F3F4F6] overflow-hidden">

      {/* Sidebar Fixed - Hanya tampil jika user adalah Admin */}
      {isAdmin && (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow-md">
          <Sidebar />
        </aside>
      )}

      {/* Main Content - Margin disesuaikan dengan keberadaan sidebar */}
      <div className={`${isAdmin ? "ml-64" : "ml-0"} flex-1 w-full min-h-screen flex flex-col`}>

        {/* Header Full Width */}
        <div className="w-full">
          <Header />
        </div>

        {/* Page Content */}
        <main className="w-full p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}