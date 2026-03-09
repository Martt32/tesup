import countries from "world-countries";

export const countryList = countries.map((c) => {
  let dial = "";

  if (c.idd?.root) {
    const suffix = c.idd.suffixes?.[0] || "";
    dial = c.idd.root + suffix;
  }

  return {
    name: c.name.common,
    code: c.cca2,
    dial: dial || "+1", // safe fallback
  };
}).sort((a, b) => a.name.localeCompare(b.name));
