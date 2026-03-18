import QRCode from "react-qr-code";

export default function WalletQR({ walletAddress, icon }) {
  return (
    <div className="relative inline-flex items-center justify-center bg-white p-4 rounded-xl">
      <QRCode value={walletAddress} size={180} level="H" />

      <div className="absolute bg-white rounded-full shadow-sm">
        <img src={icon} alt="coin icon" className="w-8 h-8 object-contain" />
      </div>
    </div>
  );
}
