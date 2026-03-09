import { motion } from "framer-motion";
import { Brain, Cpu, TrendingUp, Sparkles } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cards = [
  {
    icon: Brain,
    title: "Who We Are",
    text: `TesUp is a private automated trading platform designed at the
    intersection of artificial intelligence and next-generation financial
    infrastructure. Our system focuses on capturing market inefficiencies
    surrounding transformative ecosystems like robotics, AI infrastructure,
    and advanced mobility.`,
  },
  {
    icon: Cpu,
    title: "Our Trading Intelligence",
    text: `At the core of TesUp is a proprietary AI engine capable of executing
    thousands of precision micro-trades every minute. By analyzing price
    action, liquidity flows, and short-term volatility, the system identifies
    opportunities faster than traditional trading strategies.`,
  },
  {
    icon: TrendingUp,
    title: "Why TesUp Is Different",
    text: `TesUp removes emotional decision-making and manual execution.
    Our adaptive algorithms continuously optimize trade logic in real time,
    dynamically adjusting exposure to maintain a disciplined, systematic
    approach to capital growth.`,
  },
  {
    icon: Sparkles,
    title: "Built for the Future",
    text: `TesUp is not simply a trading application — it is investment
    infrastructure. Designed to operate continuously and scale intelligently,
    TesUp represents a new category of AI-driven financial execution.`,
  },
];

export default function About() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">
            About <span className="text-purple-400">TesUp</span>
          </h1>

          <p className="text-white/60 max-w-3xl mx-auto text-lg">
            AI-driven trading infrastructure built for precision, discipline,
            and next-generation market execution.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10"
        >
          {cards.map((card, i) => {
            const Icon = card.icon;

            return (
              <motion.div key={i} variants={item} className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 hover:border-purple-400/40 transition duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                      <Icon size={22} className="text-purple-400" />
                    </div>

                    <h2 className="text-xl font-semibold">{card.title}</h2>
                  </div>

                  <p className="text-white/70 leading-relaxed">{card.text}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Animated Background Glow */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full"
      />
    </section>
  );
}
