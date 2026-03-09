import { useState } from "react";
import CryptoSpin from "./animations/CryptoSpin";

export default function Calculator() {
  const [amount, setAmount] = useState("");

  // Conservative projection range (example: 6% – 12% monthly)
  const minRate = 0.06;
  const maxRate = 0.12;

  const minProfit = amount ? (amount * minRate).toFixed(2) : "";
  const maxProfit = amount ? (amount * maxRate).toFixed(2) : "";

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
        {/* Calculator */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            AI Performance Projection
          </h2>
          <p className="text-white/60 mb-6 max-w-md">
            Estimate potential returns based on TesUp’s historical AI execution
            range. Results are projections, not guarantees.
          </p>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
            {/* Input */}
            <label className="text-sm text-white/60 mb-2 block">
              Initial Capital
            </label>
            <input
              type="number"
              placeholder="Enter amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 mb-4 outline-none focus:border-indigo-500"
            />

            {/* Output */}
            <label className="text-sm text-white/60 mb-2 block">
              Estimated Monthly AI Yield
            </label>
            <input
              type="text"
              value={minProfit ? `$${minProfit} – $${maxProfit}` : ""}
              placeholder="$0.00 – $0.00"
              disabled
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 mb-4 text-white/80"
            />

            {/* CTA */}
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
              Start Investing with AI
            </button>

            {/* Disclaimer */}
            <p className="text-xs text-white/40 mt-4 leading-relaxed">
              Projections are based on historical AI trading performance and
              market conditions. Actual results may vary due to volatility and
              market risk.
            </p>
          </div>
        </div>

        {/* Visual */}
        <div className="hidden md:flex items-center justify-center relative">
          <CryptoSpin width={280} height={280} />
          <div className="absolute w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
