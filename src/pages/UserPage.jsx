import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import ProtectedRoute from "../router/ProtectedRoutes";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex">
      <ProtectedRoute>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </ProtectedRoute>
      {
        <p
          onClick={() => setCollapsed(!collapsed)}
          className="fixed right-0 cursor-poiner md:hidden p-4 bg-white/5 rounded-[5px] z-10"
        >
          <Menu size={24} />
        </p>
      }
      <main
        className={`userPages flex-1 transition-all duration-300 p-6 ${
          collapsed ? "md:ml-20" : "md:ml-20"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
