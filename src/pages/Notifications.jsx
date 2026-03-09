import { useState, useEffect, useContext } from "react";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../db/firebase";
import { AuthContext } from "../context/AuthContext";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  // ── Fetch notifications ─────────────────────────
  useEffect(() => {
    if (!user?.uid) return;

    const notifRef = collection(db, "users", user.uid, "notifications");
    const q = query(notifRef, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setNotifications(data);
    });

    return () => unsub();
  }, [user?.uid]);

  // ── Filtered notifications ──────────────────────
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  // ── Mark all as read ───────────────────────────
  const markAllAsRead = async () => {
    const batch = notifications.filter((n) => !n.read);
    for (let notif of batch) {
      const notifRef = doc(db, "users", user.uid, "notifications", notif.id);
      await updateDoc(notifRef, { read: true });
    }
  };

  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-400 mt-2">
            Stay updated with account activity and system alerts
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition text-sm"
        >
          Mark All as Read
        </button>
      </div>

      {/* ===== Filters ===== */}
      <div className="flex flex-wrap gap-3">
        <FilterButton
          label="All"
          value="all"
          active={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label="Unread"
          value="unread"
          active={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label="Transactions"
          value="transaction"
          active={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label="System"
          value="system"
          active={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label="Alerts"
          value="alert"
          active={filter}
          setFilter={setFilter}
        />
      </div>

      {/* ===== Notifications List ===== */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ================= FILTER BUTTON ================= */
function FilterButton({ label, value, active, setFilter }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => setFilter(value)}
      className={`px-5 py-2 rounded-xl text-sm transition 
        ${
          isActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600"
            : "bg-white/10 border border-white/10 hover:bg-white/20"
        }`}
    >
      {label}
    </button>
  );
}

/* ================= NOTIFICATION CARD ================= */
function NotificationCard({ notification }) {
  const { type, title, message, timestamp, read } = notification;

  const icon =
    type === "transaction" ? (
      <CheckCircle className="text-green-400" size={20} />
    ) : type === "alert" ? (
      <AlertTriangle className="text-yellow-400" size={20} />
    ) : (
      <Info className="text-purple-400" size={20} />
    );

  const timeText = timestamp ? timestamp.toDate().toLocaleString() : "—";

  return (
    <div
      className={`bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 flex gap-4 items-start transition ${
        !read ? "ring-1 ring-purple-500/40" : ""
      }`}
    >
      <div className="mt-1">{icon}</div>

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold capitalize">{title}</h3>
          <span className="text-xs text-gray-500">{timeText}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">{message}</p>
      </div>
    </div>
  );
}

/* ================= EMPTY STATE ================= */
function EmptyState() {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 text-center text-gray-400">
      <Bell size={28} className="mx-auto mb-4 text-purple-400" />
      No notifications found.
    </div>
  );
}
