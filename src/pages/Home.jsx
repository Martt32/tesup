import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Calculator from "../components/Calculator";
import Plans from "../components/Plans";
import HowItWorks from "../components/HowItWorks";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import PaymentGateways from "../components/PaymentGateways";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className=" from-[#0c0f2b] via-[#1a1235] to-[#0b1b2b] text-white min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Plans />
      {/* <Calculator /> */}
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <PaymentGateways />
      <Newsletter />
      <Footer />
    </div>
  );
}
