import { Check, Wallet, X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { handleInvest } from "../utils/invest";
import { toast } from "sonner";

export default function Plans() {
  const [selectedPlanId, setSelectedPlanId] = useState();
  const { plans } = useContext(AuthContext);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  return (
    <>
      {selectedPlan && (
        <Invest plan={selectedPlan} onClose={() => setSelectedPlanId(null)} />
      )}
      <div className="space-y-10">
        {/* ===== Header ===== */}
        <div>
          <h1 className="text-3xl font-bold">Investment Plans</h1>
          <p className="text-gray-400 mt-2">
            Choose a plan that fits your investment goals
          </p>
        </div>
        {/* ===== Plans Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <PlanCard
              key={idx}
              plan={plan}
              setSelectedPlan={setSelectedPlanId}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/* ================= CARD ================= */

function PlanCard({ plan, setSelectedPlan }) {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl 
      rounded-2xl p-6 hover:scale-[1.02] transition relative overflow-hidden"
    >
      {/* Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-60 pointer-events-none" />

      {/* Title */}
      <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
      <p className="text-purple-400 text-sm mb-6">{plan.roi}</p>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <PlanRow
          label="Investment"
          value={`$${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`}
        />
        <PlanRow
          label="Capital Back"
          value={plan.capitalBack ? "Yes" : "No"}
          icon={plan.capitalBack ? <Check size={16} /> : <X size={16} />}
        />
        <PlanRow label="Return Rate" value={`${plan.returnRate}%`} />
        <PlanRow label="Period" value={`${plan.investPeriodDays} days`} />
        <PlanRow
          label="Withdraw"
          value={`${plan.withdrawTimeHours / 24} days`}
        />
        <PlanRow label="Return Type" value={plan.returnType} />
        <PlanRow
          label="Cancel"
          value={plan.cancellable ? "Yes" : "No"}
          icon={plan.cancellable ? <Check size={16} /> : <X size={16} />}
        />
      </div>

      {/* CTA */}
      <button
        className="mt-8 w-full py-3 rounded-xl 
        bg-gradient-to-r from-purple-600 to-indigo-600 
        hover:opacity-90 cursor-pointer transition font-semibold"
        onClick={() => setSelectedPlan(plan.id)}
      >
        Invest Now
      </button>

      {/* Footnote */}
      <p className="mt-4 text-xs text-gray-500">* Some dates may be holidays</p>
    </div>
  );
}

/* ================= ROW ================= */

function PlanRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between text-gray-300">
      <span>{label}</span>
      <span className="flex items-center gap-2 text-white">
        {icon && <span className="text-purple-400">{icon}</span>}
        {value}
      </span>
    </div>
  );
}

function Invest({ plan, onClose }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { wallet } = useContext(AuthContext);
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const invest = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount) {
      return toast.error("Please enter an amount");
    }

    if (numericAmount < plan.minInvestment) {
      return toast.error(
        `Minimum investment is $${plan.minInvestment.toLocaleString()}`
      );
    }

    if (numericAmount > plan.maxInvestment) {
      return toast.error(
        `Maximum investment is $${plan.maxInvestment.toLocaleString()}`
      );
    }
    if (numericAmount > wallet.availableBalance) {
      return toast.error(`insufficient Funds`);
    }

    try {
      setLoading(true);
      const res = await handleInvest(numericAmount, plan.id);

      if (res.success) {
        toast.success("Investment successful 🎉");
        onClose();
      } else {
        toast.error(res.message || "Investment failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0f0f0f] border border-white/10 
        rounded-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
        <p className="text-purple-400 text-sm mb-6">{plan.roi}</p>

        {/* Plan Details */}
        <div className="space-y-3 text-sm mb-6">
          <PlanRow
            label="Investment"
            value={`$${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`}
          />
          <PlanRow label="Return Rate" value={`${plan.returnRate}%`} />
          <PlanRow label="Period" value={`${plan.investPeriodDays} days`} />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            Enter Investment Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={plan.minInvestment}
            max={plan.maxInvestment}
            placeholder={`$${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
            focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
          />
        </div>

        {/* CTA */}
        <button
          onClick={invest}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:opacity-90 transition font-semibold 
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm Investment"}
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Funds will be locked for {plan.investPeriodDays} days
        </p>
      </div>
    </div>
  );
}
