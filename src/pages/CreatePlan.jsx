import { useState, useContext } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../db/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
const CreatePlan = () => {
  const { user, profile } = useContext(AuthContext);
  const navigate = useNavigate();

  if (profile.role !== "admin") {
    toast.error("You do not have permission to visit this link");
    navigate("/app/dashboard");
  }

  const [name, setName] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [maxInvestment, setMaxInvestment] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [investPeriodDays, setInvestPeriodDays] = useState("");
  const [withdrawTimeHours, setWithdrawTimeHours] = useState("");
  const [capitalBack, setCapitalBack] = useState(false);
  const [cancellable, setCancellable] = useState(false);
  const [returnType, setReturnType] = useState("fixed");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "plans"), {
        name,
        minInvestment: Number(minInvestment),
        maxInvestment: Number(maxInvestment),
        returnRate: Number(returnRate),
        investPeriodDays: Number(investPeriodDays),
        withdrawTimeHours: Number(withdrawTimeHours),
        capitalBack,
        cancellable,
        returnType,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setName("");
      setMinInvestment("");
      setMaxInvestment("");
      setReturnRate("");
      setInvestPeriodDays("");
      setWithdrawTimeHours("");
      setCapitalBack(false);
      setCancellable(false);
      setReturnType("fixed");

      alert("Plan created successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to create plan.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-gray-400 mb-8">Create Investment Plan</h2>

      <form onSubmit={handleCreatePlan} className="w-200 space-y-5">
        <input
          className="input-glow"
          type="text"
          placeholder="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex justify-between space-x-4">
          <input
            className="input-glow"
            type="number"
            placeholder="Minimum Investment"
            value={minInvestment}
            onChange={(e) => setMinInvestment(e.target.value)}
            required
          />

          <input
            className="input-glow"
            type="number"
            placeholder="Maximum Investment"
            value={maxInvestment}
            onChange={(e) => setMaxInvestment(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between space-x-4">
          <input
            className="input-glow"
            type="number"
            placeholder="Return Rate (%)"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
            required
          />

          <select
            className="input-glow"
            value={returnType}
            onChange={(e) => setReturnType(e.target.value)}
          >
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
            <option value="compound">Compound</option>
          </select>
        </div>

        <input
          className="input-glow"
          type="number"
          placeholder="Investment Period (days)"
          value={investPeriodDays}
          onChange={(e) => setInvestPeriodDays(e.target.value)}
          required
        />

        <input
          className="input-glow"
          type="number"
          placeholder="Withdraw Time (hours)"
          value={withdrawTimeHours}
          onChange={(e) => setWithdrawTimeHours(e.target.value)}
          required
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-1 text-gray-400 cursor-pointer">
            <input
              className="input-glow accent-purple-600"
              type="checkbox"
              checked={capitalBack}
              onChange={(e) => setCapitalBack(e.target.checked)}
            />
            Capital Return
          </label>

          <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
            <input
              className="input-glow accent-purple-600"
              type="checkbox"
              checked={cancellable}
              onChange={(e) => setCancellable(e.target.checked)}
            />
            Cancellable
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold"
        >
          {loading ? "Creating..." : "Create Plan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
