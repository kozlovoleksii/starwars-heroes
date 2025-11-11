import { useNavigate, useParams } from "react-router-dom";
import HeroGraph from "../../components/HeroGraph/HeroGraph";
import styles from "./HeroPage.module.css";

const HeroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <main className={styles.wrapper}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <HeroGraph heroId={id} />
    </main>
  );
};

export default HeroPage;
