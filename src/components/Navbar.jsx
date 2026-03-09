import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0b0f2a]/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="TesUp logo"
            className="w-10 h-10 rounded-lg bg-white/10"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-tight text-white">
              TesUp
            </span>
            {/* <span className="text-xs text-white/50">AI Investment Engine</span> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#" className="hover:text-white transition">
            Overview
          </a>
          <a href="#" className="hover:text-white transition">
            Plans
          </a>
          <Link to="about">
            <p className="hover:text-white transition">About</p>
          </Link>
          <Link to="contact">
            <p className="hover:text-white transition">Support</p>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="px-5 py-2 rounded-full text-sm border border-white/20 text-white/80 hover:bg-white/10 transition">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
