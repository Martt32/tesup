import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  ArrowLeftRight,
  CreditCard,
  Wallet,
  Upload,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { logout } from "../utils/auth";

const mainLinks = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/plans", label: "Plans", icon: Layers },
  { to: "/app/investments", label: "Investments", icon: TrendingUp },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/deposit", label: "Deposit", icon: CreditCard },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/withdraw", label: "Withdraw", icon: Upload },
];

const bottomLinks = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login");
    } else {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white/5 backdrop-blur-xl 
      border-r border-white/10 shadow-lg transition-all duration-300 
      ${collapsed ? "w-20" : "w-64"} flex flex-col justify-between`}
    >
      {/* ===== Top ===== */}
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between p-5">
          {!collapsed && (
            <span className="text-2xl font-bold text-purple-500">TesUp</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            <ChevronLeft
              className={`transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Main Nav */}
        <nav className="mt-6 space-y-2 px-3">
          {mainLinks.map(({ to, label, icon: Icon }) => (
            <SidebarLink
              key={to}
              to={to}
              label={label}
              Icon={Icon}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* ===== Bottom ===== */}
      <div className="space-y-2 px-3 mb-6">
        {bottomLinks.map(({ to, label, icon: Icon }) => (
          <SidebarLink
            key={to}
            to={to}
            label={label}
            Icon={Icon}
            collapsed={collapsed}
          />
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center cursor-pointer gap-3 px-3 py-3 rounded-xl 
          text-red-400 hover:bg-red-500/10 transition backdrop-blur-sm"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

/* ===== Reusable NavLink ===== */
function SidebarLink({ to, label, Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition
        ${
          isActive
            ? "bg-purple-600/25 text-white ring-1 ring-purple-500"
            : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
        } 
        ${collapsed && "justify-center"}`
      }
      title={collapsed ? label : undefined} // tooltip when collapsed
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
