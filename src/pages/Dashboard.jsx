import { Wallet, TrendingUp, DollarSign, ArrowDownUp } from "lucide-react";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Users } from "lucide-react";

export default function Dashboard() {
  const { profile, wallet, transactions, referrals } = useContext(AuthContext);
  const totalBalance =
    wallet?.totalProfit + wallet?.availableBalance + wallet?.totalInvested;

  console.log(transactions);
  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="p-1 flex items-center space-x-2">
            <div className="relative">
              <img
                className="rounded-full bg-gray-300 w-15 h-15 ring-2 ring-purple-500/40"
                src={
                  profile.avatar ||
                  "https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?q=80&w=580&auto=format&fit=crop"
                }
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-1 ring-white"></span>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-400 font-semibold">{profile.username}</p>
              <p className="text-gray-400 text-sm">{profile.role}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Your AI is optimizing your portfolio in real-time
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition shadow-sm">
            Deposit
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 transition shadow-lg">
            Invest Now
          </button>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<Wallet />}
          css={"total-balance"}
        />

        <StatCard
          title="Total Invested"
          value={`$${wallet?.totalInvested.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<ArrowDownUp />}
          css={"total-invested"}
        />

        <StatCard
          title="Total Profit"
          value={`$${wallet?.totalProfit.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<TrendingUp />}
          css={"total-profit"}
        />

        <StatCard
          title="Available Balance"
          value={`$${wallet?.availableBalance.toLocaleString("en-us", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<DollarSign />}
          css={"available-balance"}
        />
        <StatCard
          title="Total Referrals"
          value={referrals?.length || 0}
          icon={<Users />}
          css={"total-referrals"}
        />
      </div>

      {/* ================= TRANSACTIONS ================= */}
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
      {
        //referrals
      }
      {/* ================= REFERRALS ================= */}
      <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="text-left py-3">Username</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Joined</th>
                <th className="text-left py-3">Bonus Earned</th>
              </tr>
            </thead>

            <tbody>
              {referrals?.length > 0 ? (
                referrals.map((ref) => (
                  <tr
                    key={ref.id}
                    className="border-b border-white/5 hover:bg-purple-600/10 transition"
                  >
                    <td className="py-4">{ref.username || "—"}</td>
                    <td className="py-4 text-gray-300">{ref.email || "—"}</td>
                    <td className="py-4 text-gray-300">
                      {ref.joinedAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="py-4 text-green-400">
                      ${ref.bonusEarned?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-gray-400 text-center">
                    No referrals yet
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

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon, css }) {
  return (
    <div
      className={`glass-card ${css} border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.03] hover:shadow-purple-500/20 transition`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400 text-sm">{title}</div>
        <div className="text-purple-400">{icon}</div>
      </div>
      <div
        className={`text-2xl font-bold ${
          title === "Total Balance" ? "text-[#2563eb]" : ""
        } ${title === "Total Invested" ? "text-[#7c3aed]" : ""} ${
          title === "Total Profit" ? "text-[#10b981]" : ""
        } ${title === "Available Balance" ? "text-[#14b8a6]" : ""}`}
      >
        {title === "Total Referrals"
          ? value
          : value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
      </div>
    </div>
  );
}
