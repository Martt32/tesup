import { useEffect, useRef, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../db/firebase";
import { motion } from "framer-motion";
import { Mail, RefreshCcw } from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "../assets/Success.json"; // adjust path
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const [timer, setTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();

  const sendVerification = httpsCallable(functions, "sendEmailVerification");
  const verifyCode = httpsCallable(functions, "verifyEmailCode");

  const sentRef = useRef(false);

  useEffect(() => {
    const sendCode = async () => {
      if (sentRef.current) return;
      sentRef.current = true;

      try {
        setLoading(true);
        await sendVerification();
        setMessage("Verification code sent to your email");
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    sendCode();
  }, []);
  // countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
      setResendCooldown((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!verified) return;

    const timeout = setTimeout(() => {
      navigate("/app/dashboard");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [verified, navigate]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    const newCode = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    inputs.current[Math.min(pasted.length, 5)].focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setMessage("Enter the full code");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await verifyCode({ code: fullCode });

      setVerified(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await sendVerification();

      setResendCooldown(60);
      setTimer(300);
      setCode(["", "", "", "", "", ""]);

      setMessage("New code sent!");
      inputs.current[0].focus();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (verified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
        <div className="w-64">
          <Lottie animationData={successAnimation} loop={false} />
        </div>

        <h2 className="text-2xl font-semibold mt-6">Email Verified 🎉</h2>
        <p className="text-neutral-400 mt-2">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Mail className="mx-auto mb-4 text-purple-400" size={40} />
          <h2 className="text-2xl font-semibold">Verify your email</h2>
          <p className="text-sm text-neutral-400 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Code inputs */}
        <div className="flex justify-between mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-xl bg-neutral-800 border border-neutral-700 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 transition rounded-lg py-3 font-medium"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Timer */}
        <p className="text-center text-sm text-neutral-400 mt-4">
          Code expires in {formatTime(timer)}
        </p>

        {/* Resend */}
        <div className="text-center mt-6">
          {resendCooldown > 0 ? (
            <p className="text-sm text-neutral-500">
              Resend available in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="flex items-center justify-center gap-2 mx-auto text-purple-400 hover:text-purple-300 text-sm"
            >
              <RefreshCcw size={16} />
              Resend Code
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-6 text-neutral-300">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
