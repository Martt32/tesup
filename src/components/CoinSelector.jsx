import { useState, useEffect } from "react";

const CoinSelector = ({
  selected,
  setSelected,
  search,
  setSearch,
  open,
  setOpen,
  payment,
}) => {
  const filtered = payment.filter((c) =>
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative ">
      <div
        onClick={() => setOpen(!open)}
        className="input-glow cursor-pointer flex justify-between items-center"
      >
        <span>{selected?.id || "Select Crypto"}</span>
        <span className="text-gray-400">▾</span>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-100 max-h-64 overflow-y-auto bg-[#261d3f] border border-white/10 rounded-xl p-2">
          <input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glow mb-2"
          />
          {
            //filtered
          }
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelected(c);
                setOpen(false);
                setSearch("");
              }}
              className="px-3 py-2 rounded-lg hover:bg-purple-600/20 cursor-pointer"
            >
              <span className="text-gray-400 ml-2">{c.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
