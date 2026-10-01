import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <SearchX size={34} />
        </div>

        <span className={styles.code}>404</span>

        <h1>Page not found</h1>

        <p>
          The page you are looking for does not exist or may have
          been moved.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={handleGoBack}
          >
            <ArrowLeft size={18} />
            <span>Go back</span>
          </button>

          <Link to="/" className={styles.button}>
            <Home size={18} />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;