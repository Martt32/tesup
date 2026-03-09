import { ArrowRight } from "lucide-react";
import src from "../assets/samp_video.mp4";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            AI-Driven Micro-Trading
          </span>
          <br />
          for Consistent Capital Growth
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-3xl mx-auto text-lg text-white/70">
          TesUp’s proprietary AI trading engine autonomously executes thousands
          of high-precision micro-trades every minute, intelligently capturing
          short-term market opportunities across volatile sectors.
        </p>

        {/* Trust line */}
        <p className="mt-3 text-sm text-white/50">
          Fully automated • Data-driven • No trading experience required
        </p>

        {/* CTA */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-indigo-500/25">
            Start Investing
            <ArrowRight size={18} />
          </button>

          <button className="px-8 py-4 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition">
            How It Works
          </button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[180px] rounded-full" />

      {/* Video / Visual Proof */}
      <div className="relative mt-24 max-w-5xl mx-auto px-6">
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
