import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Plans() {
  const { plans } = useContext(AuthContext);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold mb-3">AI Execution Tiers</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Choose a capital allocation tier that determines how TesUp’s AI
            trading engine scales execution speed, trade frequency, and market
            coverage.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Core */}
          {plans.map((plan, index) => (
            <div
              className={
                plan.name === "Node"
                  ? "relative bg-gradient-to-b from-indigo-500/15 to-purple-600/10 border border-indigo-500/40 p-8 rounded-2xl backdrop-blur-xl shadow-lg shadow-indigo-500/20"
                  : `bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:border-indigo-500/40 transition`
              }
            >
              {plan.name === "Node" && (
                <div className="absolute -top-3 right-6 text-xs px-3 py-1 rounded-full bg-indigo-500 text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-medium mb-2 text-white">
                {plan.name}
              </h3>
              <p className="text-sm text-white/50 mb-6">
                For individuals starting with AI-driven investing
              </p>

              <div className="space-y-3 text-sm mb-5">
                <PlanRow
                  label="Investment"
                  value={`$${plan.minInvestment.toLocaleString()} - $${plan.maxInvestment.toLocaleString()}`}
                />
                <PlanRow
                  label="Capital Back"
                  value={plan.capitalBack ? "Yes" : "No"}
                  icon={
                    plan.capitalBack ? <Check size={16} /> : <X size={16} />
                  }
                />
                <PlanRow label="Return Rate" value={`${plan.returnRate}%`} />
                <PlanRow
                  label="Period"
                  value={`${plan.investPeriodDays} days`}
                />
                <PlanRow
                  label="Withdraw"
                  value={`${plan.withdrawTimeHours / 24} days`}
                />
                <PlanRow label="Return Type" value={plan.returnType} />
                <PlanRow
                  label="Cancel"
                  value={plan.cancellable ? "Yes" : "No"}
                  icon={
                    plan.cancellable ? <Check size={16} /> : <X size={16} />
                  }
                />
              </div>
              <Link to="/register">
                <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">
                  Start with {plan.name}
                </button>
              </Link>
            </div>
          ))}

          {/* Advanced */}
          {/* <div className="relative bg-gradient-to-b from-indigo-500/15 to-purple-600/10 border border-indigo-500/40 p-8 rounded-2xl backdrop-blur-xl shadow-lg shadow-indigo-500/20">
            <div className="absolute -top-3 right-6 text-xs px-3 py-1 rounded-full bg-indigo-500 text-white">
              Most Popular
            </div>

            <h3 className="text-xl font-medium mb-2 text-white">Advanced</h3>
            <p className="text-sm text-white/50 mb-6">
              Optimized AI execution for higher capital efficiency
            </p>

            <div className="space-y-3 text-sm text-white/80 mb-8">
              <p>
                <span className="text-white">Capital Range:</span> $10,000 –
                $50,000
              </p>
              <p>
                <span className="text-white">AI Execution:</span> High-frequency
                priority
              </p>
              <p>
                <span className="text-white">Market Coverage:</span>{" "}
                Multi-sector volatility
              </p>
              <p>
                <span className="text-white">Risk Profile:</span> Balanced
              </p>
            </div>

            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition">
              Upgrade to Advanced
            </button>
          </div> */}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/40 mt-10 max-w-3xl mx-auto text-center">
          TesUp does not guarantee fixed returns. All investments involve market
          risk. AI execution performance may vary based on market conditions and
          volatility.
        </p>
      </div>
    </section>
  );
}

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
