import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Wallet() {
  const { wallet } = useContext(AuthContext);
  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-gray-400 mt-2">
          Manage your balances and track wallet activity
        </p>
      </div>

      {/* ===== Balance Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard
          title="Main Balance"
          amount="$12,450.00"
          icon={<WalletIcon size={22} />}
        />

        <BalanceCard
          title="Total Profit"
          amount={`${wallet.totalProfit.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<ArrowUpRight size={22} />}
          positive
        />

        <BalanceCard
          title="Pending Withdrawals"
          amount="$500.00"
          icon={<ArrowDownLeft size={22} />}
        />
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="flex flex-wrap gap-4">
        <button
          className="px-6 py-3 rounded-xl 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:opacity-90 transition font-semibold"
        >
          Deposit Funds
        </button>

        <button
          className="px-6 py-3 rounded-xl 
          bg-white/10 border border-white/10 
          hover:bg-white/20 transition font-semibold"
        >
          Withdraw Funds
        </button>
      </div>

      {/* ===== Wallet Activity ===== */}
      <div
        className="bg-white/5 border border-white/10 backdrop-blur-xl 
        rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Recent Wallet Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-white/10 text-gray-300">
                <td className="px-6 py-5">Deposit</td>
                <td className="px-6 py-5 text-green-400">+$1,000.00</td>
                <td className="px-6 py-5">—</td>
                <td className="px-6 py-5">
                  <StatusBadge status="Completed" />
                </td>
              </tr>

              <tr className="border-t border-white/10 text-gray-300">
                <td className="px-6 py-5">Withdrawal</td>
                <td className="px-6 py-5 text-red-400">-$500.00</td>
                <td className="px-6 py-5">—</td>
                <td className="px-6 py-5">
                  <StatusBadge status="Pending" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= BALANCE CARD ================= */

function BalanceCard({ title, amount, icon, positive }) {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl 
      rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className={`${positive ? "text-green-400" : "text-purple-400"}`}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold mt-4">{amount}</p>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles =
    status === "Completed"
      ? "bg-green-500/20 text-green-400"
      : status === "Pending"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles}`}>{status}</span>
  );
}
