import { useContext, useState } from "react";
import { Upload, DollarSign } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import CoinSelector from "../components/CoinSelector";
import { handleDeposit } from "../utils/handleDeposit";

export default function Deposit() {
  const { payment, user } = useContext(AuthContext);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState();
  const chargeRate = 0.005; // 0.5%

  const charge = amount ? amount * chargeRate : 0;
  const total = amount ? Number(amount) + charge : 0;
  const deposit = () => {
    handleDeposit(amount, selected.id, user.uid);
  };
  return (
    <div className="space-y-10">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold">Deposit</h1>
        <p className="text-gray-400 mt-2">Fund your account securely</p>
      </div>

      {/* ===== Layout ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= LEFT: FORM ================= */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          {/* Payment Method */}
          <div>
            <label className="text-sm text-gray-400">
              Select CryptoCurrency
            </label>
            <CoinSelector
              payment={payment}
              open={open}
              setOpen={setOpen}
              selected={selected}
              setSelected={setSelected}
              search={search}
              setSearch={setSearch}
            />
            <p className="text-xs text-orange-400 mt-1">Charge: 0.5%</p>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-gray-400">Enter Amount</label>
            <div className="relative mt-2">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-glow pr-10"
              />
              <DollarSign
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <p className="text-xs text-orange-400 mt-1">
              Minimum 50 USD & Maximum 100,000 USD
            </p>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="text-sm text-gray-400">Upload Receipt</label>

            <label
              className="mt-3 flex flex-col items-center justify-center 
              h-40 border border-dashed border-white/20 rounded-xl 
              cursor-pointer hover:border-purple-500 transition"
            >
              <Upload className="text-purple-400 mb-2" />
              <span className="text-sm text-gray-400">
                Click to upload receipt
              </span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* ================= RIGHT: REVIEW ================= */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Review Details</h2>

          <ReviewRow label="Amount" value={`$${amount || "0.00"}`} />
          <ReviewRow label="Charge" value={`$${charge.toFixed(2)}`} />

          <ReviewRow label="Payment Method" value="Cryptocurrency" />

          <ReviewRow label="Conversion Rate" value="1 USD = 1 USD" />

          <div className="border-t border-white/10 pt-4">
            <ReviewRow label="Total" value={`$${total.toFixed(2)}`} bold />
          </div>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className="flex justify-end">
        <button
          onClick={deposit}
          className="px-10 py-3 rounded-xl 
          bg-gradient-to-r from-orange-500 to-red-500 
          hover:opacity-90 transition font-semibold flex items-center gap-2"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

/* ================= REVIEW ROW ================= */

function ReviewRow({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`${bold ? "text-lg font-bold" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
