import Lottie from "lottie-react";
import animationData from "../../assets/Trading_Hero_animation.json";

const CryptoHero = ({
  width = 200,
  height = 200,
}) => {
  return (
    <div style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={false}     // 🔥 important
        autoplay={true}  // plays automatically on mount
      />
    </div>
  );
};

export default CryptoHero;
