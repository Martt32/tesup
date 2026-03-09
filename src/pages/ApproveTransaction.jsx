import { useState, useContext } from "react";
import { Check, ArrowDownCircle, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  increment,
} from "firebase/firestore";

import { db } from "../db/firebase";
import { AuthContext } from "../context/AuthContext";
import { createNotification } from "../utils/createNotifications";

export default function AdminRequests() {
  const { requests } = useContext(AuthContext);
  const [filter, setFilter] = useState("all");

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    if (filter === "deposit") return r.type === "deposit";
    if (filter === "withdrawal") return r.type === "withdrawal";
    return r.status === filter;
  });

  const approveRequest = async (request) => {
    if (request.status === "approved") {
      toast.error("Already approved");
      return;
    }

    const batch = writeBatch(db);

    const isWithdrawal = request.type === "withdrawal";

    const requestRef = doc(
      db,
      isWithdrawal ? "withdrawals" : "deposits",
      request.id
    );

    // 1️⃣ Update request
    batch.update(requestRef, {
      status: "approved",
      approved: true,
      approvedAt: serverTimestamp(),
    });

    const walletRef = doc(db, "users", request.user, "wallet", "main");

    // 2️⃣ Wallet update
    if (isWithdrawal) {
      batch.update(walletRef, {
        availableBalance: increment(-request.amount),
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.update(walletRef, {
        availableBalance: increment(request.amount),
        updatedAt: serverTimestamp(),
      });
    }

    // 3️⃣ Find matching transaction
    const txQuery = query(
      collection(db, "users", request.user, "transactions"),
      where(isWithdrawal ? "withdrawalId" : "depositId", "==", request.id)
    );

    const txSnap = await getDocs(txQuery);

    if (!txSnap.empty) {
      txSnap.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          status: "success",
        });
      });
    }
    createNotification(request.user, {
      type: "transaction",
      title: request.type,
      message: `Your ${request.type} of $${request.amount} is successful`,
    });
    await batch.commit();
  };

  return (
    <div className="space-y-10 p-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Transaction Requests
        </h1>
        <p className="text-gray-400 mt-1.5">
          Approve user deposits and withdrawals
        </p>
      </div>

      <FilterTabs filter={filter} setFilter={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              approveRequest={approveRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTabs({ filter, setFilter }) {
  const tabs = ["all", "deposit", "withdrawal", "pending", "approved"];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-4 py-2 rounded-xl capitalize text-sm font-medium transition-all
            ${
              filter === tab
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function RequestCard({ request, approveRequest }) {
  const [loading, setLoading] = useState(false);

  const formatDate = (value) => {
    if (!value) return "—";
    if (value?.toDate) return value.toDate().toLocaleString();
    return new Date(value).toLocaleString();
  };

  const approve = async () => {
    try {
      setLoading(true);
      await approveRequest(request);
      toast.success("Request approved");
    } catch (err) {
      console.error("Approve error:", err.code, err.message);
      toast.error("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 
      hover:border-purple-500/30 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden group"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/5 
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {request.type === "withdrawal" ? (
            <>
              <ArrowDownCircle className="text-red-400" size={16} />
              <span>Withdrawal</span>
            </>
          ) : (
            <>
              <ArrowDownCircle className="text-green-400" size={16} />
              <span>Deposit</span>
            </>
          )}
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Amount */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          ${request.amount.toLocaleString()}
        </h2>
        <p className="text-purple-400 text-sm mt-0.5">{request.coin}</p>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-sm pb-5 border-b border-white/10">
        <Row label="User">{request.userData?.username ?? "—"}</Row>
        <Row label="Time">{formatDate(request.timestamp)}</Row>
      </div>

      {/* Approve button */}
      {request.status === "pending" && (
        <button
          onClick={approve}
          disabled={loading}
          className="mt-5 w-full py-2.5 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:opacity-90 active:scale-[0.98] transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span
                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white 
                rounded-full animate-spin"
              />
              Processing...
            </>
          ) : (
            <>
              <Check size={15} />
              Approve
            </>
          )}
        </button>
      )}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className="text-white font-medium">{children}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: {
      style: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      icon: <Clock size={11} />,
    },
    approved: {
      style: "bg-green-500/10 text-green-400 border border-green-500/20",
      icon: <CheckCircle2 size={11} />,
    },
  };

  const { style, icon } = config[status] ?? config.pending;

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs capitalize font-medium ${style}`}
    >
      {icon}
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <ArrowDownCircle className="text-gray-500" size={22} />
      </div>
      <p className="text-gray-300 font-medium mb-1">No requests found</p>
      <p className="text-sm text-gray-500">
        Deposits and withdrawals will appear here.
      </p>
    </div>
  );
}
