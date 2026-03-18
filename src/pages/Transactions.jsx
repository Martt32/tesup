import { useState, useEffect, useContext } from "react";
import { Search, Calendar } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../db/firebase";

export default function Transactions() {
  const { user } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const fetchTransactions = async () => {
      try {
        const txCollection = collection(db, "users", user.uid, "transactions");
        const q = query(txCollection, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [user?.uid]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.type?.toLowerCase().includes(search.toLowerCase()) ||
      tx.depositId?.toLowerCase().includes(search.toLowerCase()) ||
      tx.id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.coin?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "all"
        ? true
        : tx.type?.toLowerCase() === typeFilter.toLowerCase();

    const matchesDate = dateFilter
      ? tx.timestamp &&
        tx.timestamp.toDate().toISOString().slice(0, 10) === dateFilter
      : true;

    return matchesSearch && matchesType && matchesDate;
  });

  const formatAmount = (amount) => `$${Number(amount || 0).toFixed(2)}`;

  const formatStatus = (status) => {
    const statusMap = {
      pending: "bg-yellow-500/10 text-yellow-400",
      approved: "bg-green-500/10 text-green-400",
      success: "bg-green-500/10 text-green-400",
      failed: "bg-red-500/10 text-red-400",
    };
    return statusMap[status] || "bg-white/10 text-gray-300";
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
          View and manage your transaction history
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative w-full sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              placeholder="Search by type, ID, or gateway..."
              className="input-glow w-full pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative w-full">
            <input
              type="date"
              className="input-glow w-full pr-10"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <select
            className="input-glow w-full"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdraw</option>
            <option value="investment">Investment</option>
          </select>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center text-gray-300">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm font-medium capitalize">
                    {tx.type || "—"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${formatStatus(
                    tx.status
                  )}`}
                >
                  {tx.status || "pending"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="text-gray-300 break-all">
                    {tx.depositId || tx.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-gray-300 capitalize">{tx.type || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-white">{formatAmount(tx.amount)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Charge</p>
                  <p className="text-white">
                    {formatAmount(
                      tx.type === "withdrawal"
                        ? Number(tx.amount || 0) * 0.01
                        : 0
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Gateway</p>
                  <p className="text-gray-300">{tx.coin || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-gray-300">{formatDate(tx.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="text-left px-6 py-4">Description</th>
                <th className="text-left px-6 py-4">Transaction ID</th>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Charge</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Gateway</th>
                <th className="text-left px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr className="border-t border-white/10 text-gray-300">
                  <td className="px-6 py-5" colSpan={8}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-white/10 text-gray-300"
                  >
                    <td className="px-6 py-5 capitalize">{tx.type || "—"}</td>
                    <td className="px-6 py-5 break-all max-w-[220px]">
                      {tx.depositId || tx.id}
                    </td>
                    <td className="px-6 py-5 capitalize">{tx.type || "—"}</td>
                    <td className="px-6 py-5">{formatAmount(tx.amount)}</td>
                    <td className="px-6 py-5">
                      {formatAmount(
                        tx.type === "withdrawal"
                          ? Number(tx.amount || 0) * 0.01
                          : 0
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${formatStatus(
                          tx.status
                        )}`}
                      >
                        {tx.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-5">{tx.coin || "—"}</td>
                    <td className="px-6 py-5">{formatDate(tx.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
