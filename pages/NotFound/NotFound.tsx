import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <h1>🪐 Oops! We’ve entered an unknown galaxy...</h1>
      <button className={styles.btnBack} onClick={() => navigate("/heroes")}>
        ← Back to heroes
      </button>
    </div>
  );
}
