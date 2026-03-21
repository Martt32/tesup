import QRCode from "react-qr-code";

export default function WalletQR({ walletAddress, icon, nicon }) {
  return (
    <div className="relative inline-flex items-center justify-center bg-white p-4 rounded-xl">
      <QRCode value={walletAddress} size={180} level="H" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`${
            nicon ? "w-10 h-10" : "w-8 h-8"
          } rounded-full bg-white shadow-md flex items-center justify-center relative`}
        >
          {/* Coin icon */}
          <img
            src={icon}
            alt="coin"
            className={`w-6 h-6 object-contain absolute ${
              nicon && "-left-[-3px]"
            }`}
          />

          {/* Network icon */}
          {nicon && (
            <img
              src={nicon}
              alt="network"
              className="w-6 h-6 object-contain absolute -right-[-3px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
