import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";

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
  const [networkModal, setNetworkModal] = useState(false);

  const filtered = payment.filter((c) =>
    c?.id?.toLowerCase().includes(search.toLowerCase())
  );

  const copyWallet = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="mt-3">
      {/* COIN SELECT */}
      <div
        onClick={() => setOpen(true)}
        className="input-glow cursor-pointer flex items-center justify-between"
      >
        {selected?.coin?.icon && (
          <img
            className="w-6 h-6 rounded-full"
            src={selected.coin.icon}
            alt=""
          />
        )}

        <span>
          {selected?.coin
            ? `${selected.coin.id} ${
                selected?.network ? `(${selected.network.id})` : ""
              }`
            : "Select Crypto"}
        </span>

        <span className="text-gray-400">▾</span>
      </div>

      {/* WALLET DISPLAY */}
      {type === "deposit" && selected?.network && (
        <div className="input-glow mt-5 space-y-3">
          {/* NETWORK INFO */}
          <div className="flex justify-between text-sm text-gray-300">
            <span>Network</span>
            <span className="font-medium">{selected.network.id}</span>
          </div>

          {/* WALLET */}
          <div className="flex justify-between items-center">
            <span className="break-all text-sm">{selected.network.wallet}</span>

            <button
              onClick={() => copyWallet(selected.network.wallet)}
              className="ml-3 p-2 rounded-lg hover:bg-white/10"
            >
              {copied ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>

          {/* WARNING */}
          <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded-lg">
            <AlertTriangle size={14} />
            <span>
              Send only <b>{selected.coin.id}</b> via{" "}
              <b>{selected.network.id}</b>. Sending other assets may result in
              permanent loss.
            </span>
          </div>
        </div>
      )}

      {/* COIN MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-[#1c1531] rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Select Coin</h2>

            <input
              placeholder="Search coin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glow mb-3"
            />

            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelected({ coin: c, network: null });
                  setOpen(false);
                  setNetworkModal(true); // 👈 open network modal
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
              >
                <img src={c.icon} className="w-8 h-8 rounded-full" alt="" />
                <span className="font-medium">{c.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NETWORK MODAL (🔥 Binance style) */}
      {networkModal && selected?.coin && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-[#1c1531] rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-1">Select Network</h2>
            <p className="text-xs text-gray-400 mb-4">
              Choose the correct network carefully
            </p>

            <div className="space-y-3">
              {selected.coin.networks.map((n, i) => {
                const isRecommended = i === 0; // 👈 you can improve logic later

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelected((prev) => ({
                        ...prev,
                        network: n,
                      }));
                      setNetworkModal(false);
                    }}
                    className="p-4 rounded-xl border border-white/10 hover:border-purple-500 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{n.id}</span>

                      {isRecommended && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Optional extra info */}
                    <div className="text-xs text-gray-400 mt-1">
                      Fast • Low fees
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WARNING */}
            <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-400/10 p-3 rounded-lg mt-4">
              <AlertTriangle size={14} />
              <span>
                Ensure the selected network matches the withdrawal platform to
                avoid loss of funds.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
