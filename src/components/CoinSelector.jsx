import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CoinSelector = ({
  selected,
  setSelected,
  search,
  setSearch,
  open,
  setOpen,
  type,
  payment = [],
}) => {
  const [copied, setCopied] = useState(false);

  const filtered = payment.filter((c) =>
    c?.id?.toLowerCase().includes(search.toLowerCase())
  );

  const copyWallet = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="relative">
      {/* SELECT BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="input-glow cursor-pointer flex justify-between items-center"
      >
        <span>{selected?.id || "Select Crypto"}</span>
        <span className="text-gray-400">▾</span>
      </div>

      {/* WALLET DISPLAY */}
      {type === "deposit" && selected && (
        <div className="input-glow mt-5 flex justify-between items-center">
          <span className="break-all text-sm">{selected.wallet}</span>

          <button
            onClick={() => copyWallet(selected.wallet)}
            className="ml-3 p-2 rounded-lg hover:bg-white/10 transition"
          >
            {copied ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>
      )}

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-[#261d3f] border border-white/10 rounded-xl p-2">
          <input
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glow mb-2"
          />

          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 p-2">No results</p>
          )}

          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelected(c);
                setOpen(false);
                setSearch("");
              }}
              className="px-3 py-2 rounded-lg hover:bg-purple-600/20 cursor-pointer flex items-center justify-between"
            >
              <span className="text-gray-200">{c.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
