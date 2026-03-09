import { useState } from "react";
import { messageTg } from "../utils/sendToTg";
import { generateNewsletterEmail } from "../utils/emailTemplates";
export default function Newsletter() {
  const [email, setEmail] = useState();
  const title = "News Letter Form";

  const message = async (e) => {
    e.preventDefault();
    await fetch("https://us-central1-tesupai.cloudfunctions.net/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "News Letter Sign-up",
        html: generateNewsletterEmail({ email: email }),
      }),
    });
    await messageTg("🚀 Subscribed to News letter", email);
  };
  return (
    <section className="py-28 relative bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <h2 className="text-3xl font-semibold mb-4">Get AI Trading Insights</h2>
        <p className="text-white/60 mb-8">
          Subscribe to receive curated market insights, strategy updates, and
          highlights from TesUp’s AI trading engine, delivered weekly.
        </p>

        {/* Form */}
        <form className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Address"
            className="px-5 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 text-white outline-none focus:border-purple-400 transition"
          />
          <button
            onClick={message}
            className="px-8 py-3 rounded-lg bg-gradient-to-r cursor-pointer from-purple-500 to-indigo-500 hover:opacity-90 transition"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Subtle Glow / AI visual effect */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/10 blur-[120px] rounded-full"></div>
    </section>
  );
}
