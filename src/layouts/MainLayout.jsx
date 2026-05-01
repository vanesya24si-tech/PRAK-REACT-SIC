import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="w-screen min-h-screen flex bg-[#F3F4F6] overflow-hidden">

      {/* Sidebar Fixed */}
      <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow-md">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 w-full min-h-screen">

        {/* Header Full Width */}
        <div className="w-full">
          <Header />
        </div>

        {/* Page Content */}
        <main className="w-full p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}