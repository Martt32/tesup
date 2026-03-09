export default function HowItWorks() {
  const steps = [
    {
      title: "Market Data Ingestion",
      desc: "TesUp continuously analyzes real-time price movements, liquidity flows, and volatility signals across multiple markets.",
    },
    {
      title: "AI Signal Intelligence",
      desc: "Our proprietary AI models identify short-term inefficiencies and statistically favorable micro-trading opportunities.",
    },
    {
      title: "High-Speed Trade Execution",
      desc: "The system executes thousands of precision micro-trades autonomously, capturing small but consistent profit margins.",
    },
    {
      title: "Risk & Capital Controls",
      desc: "Dynamic risk limits, position sizing, and exposure controls protect capital during volatile market conditions.",
    },
    {
      title: "Continuous Optimization",
      desc: "The AI engine constantly retrains and adapts based on market behavior, execution performance, and outcome data.",
    },
    {
      title: "Automated Profit Allocation",
      desc: "Generated returns are automatically reflected in user accounts without manual intervention or active management.",
    },
  ];

  return (
    <section className="py-28 relative bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4">
            How TesUp’s AI Trading Engine Works
          </h2>
          <p className="text-white/60 max-w-3xl mx-auto">
            TesUp operates a fully automated AI-driven trading infrastructure
            designed to execute and optimize high-frequency micro-trading
            strategies at scale.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-indigo-500/40 transition"
            >
              <div className="text-sm text-white/40 mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-medium mb-3 text-white">{s.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
