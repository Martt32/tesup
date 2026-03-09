export default function Stats() {
  const stats = [
    {
      label: "Active Accounts",
      value: "50k",
    },
    {
      label: "AI Trades Executed",
      value: "2.4M+",
    },
    {
      label: "Markets Monitored",
      value: "30+",
    },
    {
      label: "System Uptime",
      value: "99.9%",
    },
  ];

  return (
    <section className="py-28 relative bg-white/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-10 text-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <h3 className="text-4xl font-semibold text-indigo-400 mb-2">
                {s.value}
              </h3>
              <p className="text-sm text-white/60 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Subtle trust note */}
        <p className="text-xs text-white/40 text-center mt-10 max-w-3xl mx-auto">
          Metrics reflect platform activity and AI system performance over
          recent operational periods. Figures update periodically.
        </p>
      </div>
    </section>
  );
}
