import { useContext, useState, useEffect } from "react";
import { Upload, DollarSign } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import CoinSelector from "../components/CoinSelector";
import { handleDeposit } from "../utils/handleDeposit";
import { usePaymentMethods } from "../hooks";
import WalletQR from "../components/WalletQR";
import { toast } from "sonner";
import Lottie from "lottie-react";
import deposit_anime from "../assets/deposit_anime.json"; // adjust path
import { useNavigate } from "react-router-dom";

export default function Deposit() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const payment = usePaymentMethods();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [amount, setAmount] = useState();
  const chargeRate = 0.001; // 0.1%

  const charge = amount ? amount * chargeRate : 0;
  const total = amount ? Number(amount) - charge : 0;
  const deposit = () => {
    if (!amount || !selected) return toast.error("Please complete the form");
    // setAmount();
    handleDeposit(amount * price?.price, selected.coin.id, user.uid);
    setSent(true);
    const timeout = setTimeout(() => {
      navigate("/app/dashboard");
    }, 3000);
    return () => clearTimeout(timeout);
  };

  const [prices, setPrices] = useState({});
  const [price, setPrice] = useState(null);

  // fetch once (or when payment changes)
  useEffect(() => {
    const getPrices = async () => {
      const ids = payment.map((c) => c.cid).join(",");

      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );

      const data = await res.json();
      console.log(data);
      setPrices(data); // store ALL prices
    };

    if (payment.length) {
      getPrices();
    }
  }, [payment]);
  useEffect(() => {
    if (!selected || !prices) return;
    const enriched = {
      ...selected,
      price: prices[selected.coin.cid]?.usd || 0,
    };
    console.log(enriched);

    setPrice(enriched);
  }, [selected, prices]);
  return (
    <div className="space-y-10">
      {sent && (
        <div className="fixed left-25 md:left-[45%] top-0 z-10 min-h-screen flex flex-col items-center justify-center ">
          <div className="w-70">
            <Lottie animationData={deposit_anime} loop={false} />
          </div>
        </div>
      )}
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold">Deposit</h1>
        <p className="text-gray-400 mt-2">Fund your account securely</p>
      </div>

      {/* ===== Layout ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= LEFT: FORM ================= */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-8">
          {/* STEP 1 */}
          <div>
            <h2 className="text-sm text-gray-400 mb-2">Step 1</h2>
            <label className="text-sm font-medium">
              Select Cryptocurrency & Network
            </label>

            <CoinSelector
              payment={payment}
              open={open}
              setOpen={setOpen}
              selected={selected}
              setSelected={setSelected}
              search={search}
              setSearch={setSearch}
              type={"deposit"}
            />
          </div>

          {/* STEP 2 */}
          {selected?.network && (
            <div className="space-y-4">
              <h2 className="text-sm text-gray-400">Step 2</h2>

              {/* QR + Wallet */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center gap-4">
                <WalletQR
                  walletAddress={selected.network.wallet}
                  icon={selected.coin.icon}
                  nicon={selected.network.icon}
                />

                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
                  <p className="text-sm break-all font-medium">
                    {selected.network.wallet}
                  </p>
                </div>
              </div>

              {/* NETWORK WARNING */}
              <div className="flex items-start gap-3 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-xl">
                ⚠️
                <div>
                  Send only <b>{selected.coin.id}</b> via{" "}
                  <b>{selected.network.id}</b>. Sending any other asset or
                  network will result in **permanent loss**.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          <div>
            <h2 className="text-sm text-gray-400 mb-2">Step 3</h2>
            <label className="text-sm font-medium">Enter Amount</label>

            <div className="relative mt-2">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-glow pr-10"
              />
              {selected?.coin?.icon ? (
                <img
                  className="w-8 h-8 rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                  src={selected.coin.icon}
                  alt=""
                />
              ) : (
                <DollarSign
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              )}
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Minimum: $10</span>
              <span>Fee: 0.1%</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: REVIEW ================= */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Deposit Summary</h2>

          {/* STATUS */}
          <div className="text-xs text-gray-400">
            Ensure you complete the transfer before confirming.
          </div>

          <ReviewRow label="Coin" value={selected?.coin?.id || "-"} />
          <ReviewRow label="Network" value={selected?.network?.id || "-"} />
          <ReviewRow
            label="Amount"
            value={`$${
              (amount * price?.price || 0).toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0.00"
            }`}
          />
          <ReviewRow
            label="Fee"
            value={`${charge.toFixed(2)} ${selected?.coin?.id || ""}`}
          />

          <ReviewRow
            label="Rate"
            value={`1 ${selected?.coin?.id || "BTC"} = ${
              price?.price || 0
            } USD`}
          />

          <div className="border-t text-green-500 border-white/10 pt-4">
            <ReviewRow
              label="You will receive"
              value={`${total.toFixed(2)} ${selected?.coin?.id || ""} ≈ $${(
                total * price?.price || 0
              ).toLocaleString("en-us", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              bold
            />
          </div>

          {/* CTA */}
          <button
            onClick={deposit}
            disabled={!selected?.network || !amount}
            className={`w-full py-3 rounded-xl font-semibold transition 
      ${
        !selected?.network || !amount
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-500 to-purple-800 hover:opacity-90"
      }`}
          >
            I Have Sent the Payment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REVIEW ROW ================= */

function ReviewRow({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`${bold ? " font-bold" : "text-white"}`}>{value}</span>
    </div>
  );
}
