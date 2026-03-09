import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex">

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet />
      </main>

    </div>
  );
}
