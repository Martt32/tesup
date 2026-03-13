import { useState, useContext } from "react";
import { ArrowDownLeft, DollarSign, Wallet } from "lucide-react";
import CoinSelector from "../components/CoinSelector";
import { handleWithdrawal } from "../utils/handleWithdrawal";
import { AuthContext } from "../context/AuthContext";
import { useWallet, usePaymentMethods } from "../hooks";
import { messageTg } from "../utils/sendToTg";
import { toast } from "sonner";
export default function Withdraw() {
  const { user } = useContext(AuthContext);
  const wallet = useWallet();
  const payment = usePaymentMethods();
  const feeRate = 0.01;

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState("");

  const balance = (wallet?.availableBalance || 0) + (wallet?.totalProfit || 0);

  const fee = amount ? Number(amount) * feeRate : 0;
  const receivable = amount ? Number(amount) - fee : 0;
  const [uWallet, setUWallet] = useState("");
  const withdraw = () => {
    const amt = Number(amount);

    if (!selected) {
      alert("Select withdrawal coin");
      return;
    }

    if (!amt || amt < 50 || amt > 5000) {
      alert("Withdrawal must be between $50 and $5000");
      return;
    }

    if (amt > balance) {
      alert("Insufficient balance");
      return;
    }

    handleWithdrawal(amt, selected.id, user.uid, uWallet);
    toast.success("Withdrawal request successful");
  };

  return (
    <div className="space-y-10">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Withdraw</h1>
        <p className="text-gray-400 mt-2">
          Request a withdrawal from your available balance
        </p>
      </div>

      {/* Balance Info */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          title="Available Balance"
          value={`$${balance.toFixed(2)}`}
          icon={<Wallet size={22} />}
        />

        <InfoCard
          title="Withdrawal Fee"
          value="1%"
          icon={<ArrowDownLeft size={22} />}
        />
      </div>

      {/* Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT FORM */}

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          {/* Coin */}

          <div>
            <label className="text-sm text-gray-400">Withdrawal Coin</label>

            <CoinSelector
              payment={payment}
              open={open}
              setOpen={setOpen}
              selected={selected}
              setSelected={setSelected}
              search={search}
              setSearch={setSearch}
              type={"withdraw"}
            />
          </div>

          {/* Amount */}

          <div>
            <label className="text-sm text-gray-400">Withdrawal Amount</label>

            <div className="relative mt-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="input-glow pr-10"
              />

              <DollarSign
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <p className="text-xs text-orange-400 mt-1">
              Minimum $50 — Maximum $5,000 per request
            </p>
          </div>

          {/* Destination */}

          <div>
            <label className="text-sm text-gray-400">
              Destination Wallet Address
            </label>

            <input
              onChange={(e) => setUWallet(e.target.value)}
              type="text"
              placeholder="Enter crypto wallet address"
              className="input-glow mt-2"
            />
          </div>
        </div>

        {/* RIGHT REVIEW */}

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Review Withdrawal</h2>

          <ReviewRow label="Requested Amount" value={`$${amount || "0.00"}`} />

          <ReviewRow label="Withdrawal Fee" value={`$${fee.toFixed(2)}`} />

          <div className="border-t border-white/10 pt-4">
            <ReviewRow
              label="You Will Receive"
              value={`$${receivable.toFixed(2)}`}
              bold
            />
          </div>

          <p className="text-xs text-gray-500">
            Withdrawals are processed within 24–72 hours.
          </p>
        </div>
      </div>

      {/* CTA */}

      <div className="flex justify-end">
        <button
          onClick={withdraw}
          disabled={!amount || Number(amount) > balance}
          className="px-10 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:opacity-90 transition font-semibold
          flex items-center gap-2 disabled:opacity-40"
        >
          Submit Withdrawal
        </button>
      </div>
    </div>
  );
}

/* Info Card */

function InfoCard({ title, value, icon }) {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl
      rounded-2xl p-6 flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>

      <div className="text-purple-400">{icon}</div>
    </div>
  );
}

/* Review Row */

function ReviewRow({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>

      <span className={bold ? "text-lg font-bold" : "text-white"}>{value}</span>
    </div>
  );
}
