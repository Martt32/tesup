import StripeLogo from "../assets/logos/stripe.webp";
import CoinbaseLogo from "../assets/logos/coinbase.webp";
import PaystackLogo from "../assets/logos/paystack.webp";
import FlutterwaveLogo from "../assets/logos/flutterwave.webp";
import BinanceLogo from "../assets/logos/binance.webp";
import CoinGateLogo from "../assets/logos/coingate.webp";
import PerfectMoneyLogo from "../assets/logos/perfectmoney.webp";

const gateways = [
  { name: "Stripe", logo: StripeLogo },
  { name: "Coinbase", logo: CoinbaseLogo },
  { name: "Paystack", logo: PaystackLogo },
  { name: "Flutterwave", logo: FlutterwaveLogo },
  { name: "Binance", logo: BinanceLogo },
  { name: "CoinGate", logo: CoinGateLogo },
  { name: "PerfectMoney", logo: PerfectMoneyLogo },
];

export default function PaymentGateways() {
  return (
    <section className="py-28 relative bg-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          Secure & Trusted Payment Gateways
        </h2>
        <p className="text-white/60 mb-10 max-w-2xl mx-auto">
          We partner with globally recognized payment providers to ensure
          seamless, fast, and secure deposits and withdrawals.
        </p>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {gateways.map((g, i) => (
            <div
              key={i}
              className="flex items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:shadow-lg hover:scale-105 transition"
            >
              <img src={g.logo} alt={g.name} className="h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
