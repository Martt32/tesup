import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
} from "lucide-react";
import { useWallet, useTransactions } from "../hooks";
import { Link } from "react-router-dom";

export default function Wallet() {
  const wallet = useWallet();
  const transactions = useTransactions();

  const formatMoney = (value) =>
    `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";
    return timestamp.toDate().toLocaleString();
  };

  const getAmountColor = (tx) => {
    if (tx.type === "deposit") return "text-green-400";
    if (tx.type === "withdraw" || tx.type === "withdrawal")
      return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Wallet</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Manage your balances and track wallet activity
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <BalanceCard
          title="Main Balance"
          amount={formatMoney(wallet?.availableBalance)}
          icon={<WalletIcon size={22} />}
        />

        <BalanceCard
          title="Total Profit"
          amount={formatMoney(wallet?.totalProfit)}
          icon={<ArrowUpRight size={22} />}
          positive
        />

        <BalanceCard
          title="Total Balance"
          amount={formatMoney(wallet?.totalInvested)}
          icon={<ArrowDownLeft size={22} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
        <Link to="/app/deposit" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-3 cursor-pointer rounded-xl 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            hover:opacity-90 transition font-semibold"
          >
            Deposit Funds
          </button>
        </Link>

        <Link to="/app/withdraw" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-3 cursor-pointer rounded-xl 
            bg-white/10 border border-white/10 
            hover:bg-white/20 transition font-semibold"
          >
            Withdraw Funds
          </button>
        </Link>
      </div>

      {/* Wallet Activity */}
      <div className="glass-card border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Recent Transactions
        </h2>

        {/* Mobile cards */}
        <div className="space-y-3 lg:hidden">
          {transactions?.length > 0 ? (
            transactions.map((tx, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="capitalize font-medium">{tx.type || "—"}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      tx.status === "success"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.status || "No Data"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-gray-300">{formatDate(tx.timestamp)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className={getAmountColor(tx)}>
                      {formatMoney(tx.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
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
                      {formatDate(tx.timestamp)}
                    </td>

                    <td className="py-4 capitalize">{tx.type || "—"}</td>

                    <td className={`py-4 ${getAmountColor(tx)}`}>
                      {formatMoney(tx.amount)}
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
                        {tx.status || "No Data"}
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
      rounded-2xl p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div
          className={`${
            positive ? "text-green-400" : "text-purple-400"
          } shrink-0`}
        >
          {icon}
        </div>
      </div>

      <p className="relative text-xl sm:text-2xl font-bold mt-4 break-words">
        {amount}
      </p>
    </div>
  );
}
