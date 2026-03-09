import { useEffect, useState, useContext } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Investments() {
  const { investments } = useContext(AuthContext);

  const activeInvestments = investments?.filter(
    (inv) => inv.status === "active"
  );

  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold">My Investments</h1>
        <p className="text-gray-400 mt-2">Track your active investment plans</p>
      </div>

      {/* ===== Content ===== */}
      {activeInvestments?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {activeInvestments.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function InvestmentCard({ investment }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = investment.endsAt.toDate();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft("Completed");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      setTimeLeft(`${days}d ${hours}h left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [investment.endsAt]);

  const formatDate = (date) => date?.toDate().toLocaleDateString();

  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl 
        rounded-2xl p-6 hover:scale-[1.02] transition relative overflow-hidden"
    >
      {/* Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-60 pointer-events-none" />

      {/* Amount */}
      <h2 className="text-2xl font-semibold mb-2">
        ${investment.amount.toLocaleString()}
      </h2>

      {/* Status */}
      <StatusBadge status={investment.status} />

      {/* Details */}
      <div className="mt-6 space-y-3 text-sm text-gray-300">
        <Row label="Created">{formatDate(investment.createdAt)}</Row>

        <Row label="Ends">{formatDate(investment.endsAt)}</Row>

        <Row label="Time Left">
          <span className="text-purple-400">{timeLeft}</span>
        </Row>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-purple-600/20 text-purple-400",
    completed: "bg-green-600/20 text-green-400",
    cancelled: "bg-red-600/20 text-red-400",
  };

  const icons = {
    active: <Clock size={14} />,
    completed: <CheckCircle size={14} />,
    cancelled: <XCircle size={14} />,
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="text-white">{children}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl 
        rounded-2xl p-10 text-center"
    >
      <p className="text-gray-400 mb-2">No active investments</p>
      <p className="text-sm text-gray-500">
        When you invest in a plan, it will appear here.
      </p>
    </div>
  );
}
