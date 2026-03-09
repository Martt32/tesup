import { useState, useEffect } from "react";
import { countryList } from "../utils/countries";

const CountrySelector = ({
  selected,
  setSelected,
  search,
  setSearch,
  open,
  setOpen,
  setCountryName,
}) => {
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const found = countryList.find((c) => c.code === data.country_code);
        setSelected(found || countryList.find((c) => c.code === "US"));
        setCountryName(selected.name);
      })
      .catch(() => {
        setSelected(countryList.find((c) => c.code === "US"));
      });
  }, []);

  const filtered = countryList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-20">
      <div
        onClick={() => setOpen(!open)}
        className="input-glow cursor-pointer flex justify-between items-center"
      >
        <span>{selected?.code || "Select Country"}</span>
        <span className="text-gray-400">▾</span>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-100 max-h-64 overflow-y-auto bg-[#111827] border border-white/10 rounded-xl p-2">
          <input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glow mb-2"
          />

          {filtered.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setSelected(c);
                setOpen(false);
                setSearch("");
              }}
              className="px-3 py-2 rounded-lg hover:bg-purple-600/20 cursor-pointer"
            >
              {c.name}
              <span className="text-gray-400 ml-2">{c.dial}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
