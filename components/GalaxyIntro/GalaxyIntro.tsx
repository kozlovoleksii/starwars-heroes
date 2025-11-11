import styles from "./GalaxyIntro.module.css";
import Logo from "../../assets/logo-starwars.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GalaxyIntro = () => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsFlashing(true);
    setIsHidden(true);

    setTimeout(() => {
      navigate("/heroes");
    }, 500);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.glow}></div>

      <div className={`${styles.logoWrap} ${isHidden ? styles.hidden : ""}`}>
        <img
          src={Logo}
          alt="Star Wars Logo"
          className={styles.logo}
          onClick={handleClick}
        />
        <p className={styles.subtitle}>Click to begin your journey…</p>
      </div>

      {isFlashing && <div className={styles.flash}></div>}
    </section>
  );
};

export default GalaxyIntro;
