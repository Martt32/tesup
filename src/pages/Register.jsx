import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "../utils/auth";
import { toast } from "sonner";
import { getAuthErrorMessage } from "../utils/authErrorHandler";
import Loader from "../components/Loader";
import { LoadingContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { messageTg } from "../utils/sendToTg";

export default function Register() {
  const title = "New Registration";
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await signup(email, password);

    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      messageTg(title, email);
      navigate("/complete-profile"); // 👈 redirect here
    } else {
      toast.error(getAuthErrorMessage(result.code));
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-[#0b1020] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl">
          <div className="mb-6 flex space-x-2">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-lg" />
            <div className="text-2xl font-bold text-purple-500">TesUp</div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-400 mb-8">Register to continue with TesUp</p>

          <div className="space-y-5">
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-glow"
              placeholder="Email Address"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glow pr-12"
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Strength Meter */}
            {password && (
              <div className="mt-2">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-500 ${
                      strength === 1
                        ? "w-1/4 bg-red-500"
                        : strength === 2
                        ? "w-2/4 bg-yellow-500"
                        : strength === 3
                        ? "w-3/4 bg-blue-500"
                        : strength === 4
                        ? "w-full bg-green-500"
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}

            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-glow"
              placeholder="Confirm Password"
            />

            <button
              onClick={handleSignup}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
