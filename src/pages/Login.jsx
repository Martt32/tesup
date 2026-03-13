import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../utils/auth";
import { getAuthErrorMessage } from "../utils/authErrorHandler";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = async () => {
    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successfully!");
      setTimeout(() => {
        navigate("/app/dashboard");
      }, [1000]);
    } else {
      toast.error(getAuthErrorMessage(result.code));
      console.log(result.code);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("User logged in:", user);
  //     } else {
  //       console.log("User logged out");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <div className="min-h-screen bg-[#0b1020] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl">
        {/* Logo */}
        <div className="mb-6 flex space-x-2">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-lg" />
          <div className="text-2xl font-bold text-purple-500">TesUp</div>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-gray-400 mb-8">
          Sign in to continue with the User Panel
        </p>

        <form className="space-y-5">
          {/* Username / Email */}
          <div className="relative">
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              placeholder="Enter username or email"
              className="input-glow pr-10"
            />
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-glow pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="accent-purple-600" />
              Remember me
            </label>

            {/* <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              Forgot Password
            </a> */}
          </div>

          {/* Button */}
          <p
            onClick={handleLogin}
            type="submit"
            className="cursor-pointer text-center w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition font-semibold shadow-lg shadow-purple-600/20"
          >
            Login
          </p>
        </form>

        {/* Bottom Links */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              <span className="text-yellow-400 hover:underline cursor-pointer">
                Signup for free
              </span>
            </Link>
          </p>

          <p className="mt-4 text-xs text-gray-500">
            By clicking Login, you agree to our{" "}
            <span className="text-yellow-400 hover:underline cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-yellow-400 hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
