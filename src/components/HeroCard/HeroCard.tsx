import { Link } from "react-router-dom";
import type { ListHero } from "../../types/hero";
import styles from "./HeroCard.module.css";

type HeroCardProps = {
  hero: ListHero;
};

const HeroCard = ({ hero }: HeroCardProps) => {
  return (
    <Link to={`/hero/${hero.id}`} className={styles.link}>
      <div className={styles.card}>
        <p className={styles.name}>{hero.name}</p>
        <p className={styles.gender}>Gender: {hero.gender}</p>
      </div>
    </Link>
  );
};

export default HeroCard;
