import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-20 bg-black/40 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-white">
        {/* Brand & Description */}
        <div>
          <h3 className="text-2xl font-bold text-purple-400 mb-4">TesUp</h3>
          <p className="text-white/60 leading-relaxed">
            Powered by advanced AI trading strategies, TesUp delivers automated,
            high-frequency micro-trading designed to maximize efficiency and
            manage risk, all without manual intervention.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white/80">
            Navigation
          </h4>
          <ul className="space-y-2 text-white/60">
            <Link to="/">
              <li className="hover:text-purple-400 cursor-pointer transition">
                Home
              </li>
            </Link>
            <Link to="/login">
              <li className="hover:text-purple-400 cursor-pointer transition">
                Login
              </li>
            </Link>
            <Link to="/register">
              <li className="hover:text-purple-400 cursor-pointer transition">
                Register
              </li>
            </Link>
            <Link to="/contact">
              <li className="hover:text-purple-400 cursor-pointer transition">
                Contact
              </li>
            </Link>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white/80">Legal</h4>
          <ul className="space-y-2 text-white/60">
            <li className="hover:text-purple-400 cursor-pointer transition">
              Privacy Policy
            </li>
            <li className="hover:text-purple-400 cursor-pointer transition">
              Terms & Conditions
            </li>
          </ul>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Copyright */}
      <p className="text-center text-white/40 mt-12 text-sm">
        &copy; {new Date().getFullYear()} TesUp. All rights reserved.
      </p>
    </footer>
  );
}
