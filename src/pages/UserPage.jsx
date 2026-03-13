import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {
        <p
          onClick={() => setCollapsed(false)}
          className="fixed cursor-poiner md:hidden p-4 bg-white/5 rounded-[5px]"
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
