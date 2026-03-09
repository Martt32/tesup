import Lottie from "lottie-react";
import animationData from "../../assets/Cryptocurrency_rotation.json";

const CryptoSpin = ({
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
}) => {
  return (
    <div style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

export default CryptoSpin;
