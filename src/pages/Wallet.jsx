import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useWallet, useTransactions } from "../hooks";
import { Link } from "react-router-dom";
export default function Wallet() {
  const wallet = useWallet();
  const transactions = useTransactions();
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
          amount={`$${wallet?.availableBalance.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<WalletIcon size={22} />}
        />

        <BalanceCard
          title="Total Profit"
          amount={`$${wallet?.totalProfit.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<ArrowUpRight size={22} />}
          positive
        />

        <BalanceCard
          title="Total Balance"
          amount={`$${wallet?.totalInvested.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<ArrowDownLeft size={22} />}
        />
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="flex flex-wrap gap-4">
        <Link to={"/app/deposit"}>
          <button
            className="px-6 py-3 cursor-pointer rounded-xl 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:opacity-90 transition font-semibold"
          >
            Deposit Funds
          </button>
        </Link>
        <Link to={"/app/withdraw"}>
          <button
            className="px-6 py-3 cursor-pointer rounded-xl 
          bg-white/10 border border-white/10 
          hover:bg-white/20 transition font-semibold"
          >
            Withdraw Funds
          </button>
        </Link>
      </div>

      {/* ===== Wallet Activity ===== */}
      <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.length > 0 ? (
                transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-purple-600/10 transition"
                  >
                    <td className="py-4 text-gray-300">
                      {tx.timestamp.toDate().toLocaleString()}
                    </td>
                    <td className="py-4">{tx.type}</td>
                    <td
                      className={`py-4 rounded-full text-xs ${
                        tx.type === "deposit"
                          ? " text-green-400"
                          : tx.status === "withdraw"
                          ? " text-yellow-400"
                          : " text-red-400"
                      }`}
                    >
                      $
                      {tx.amount.toLocaleString("en-us", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          tx.status === "success"
                            ? "bg-green-500/20 text-green-400"
                            : tx.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-white/5">
                  <td className="py-4 text-gray-300">—</td>
                  <td className="py-4">—</td>
                  <td className="py-4">$0.00</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-gray-400 text-xs">
                      No Data
                    </span>
                  </td>
                </tr>
              )}
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
