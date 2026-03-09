import { Zap, ShieldCheck, Layers, Cpu } from "lucide-react";

export default function WhyChoose() {
  const items = [
    {
      icon: <Zap size={28} />,
      title: "Machine-Speed Execution",
      desc: "TesUp’s AI executes thousands of micro-trades per minute, capturing opportunities no human trader can react to in time.",
    },
    {
      icon: <Cpu size={28} />,
      title: "Emotion-Free Decisions",
      desc: "Every trade is driven by data and probability models not fear, greed, or market hype.",
    },
    {
      icon: <Layers size={28} />,
      title: "Scalable Profit Capture",
      desc: "Small inefficiencies are aggregated at scale, creating consistent performance through disciplined execution.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Built-In Risk Controls",
      desc: "Dynamic position sizing, exposure limits, and automated safeguards protect capital during volatility.",
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4">
            Why Investors Choose TesUp
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            TesUp is built around disciplined AI execution, removing emotion,
            delay, and inconsistency from the investment process.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {items.map((i, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/40 transition"
            >
              <div className="flex justify-center mb-5 text-indigo-400">
                {i.icon}
              </div>
              <h3 className="text-lg font-medium mb-3 text-center">
                {i.title}
              </h3>
              <p className="text-sm text-white/70 text-center leading-relaxed">
                {i.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
