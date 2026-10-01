import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Error.module.css";

type ErrorPageProps = {
  message?: string;
  onRetry?: () => void;
};

const Error = ({ message, onRetry }: ErrorPageProps) => {
  const errorMessage =
    message || "Something went wrong. Please try again.";

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <AlertTriangle size={34} />
        </div>

        <span className={styles.status}>Unexpected error</span>

        <h1>Something went wrong</h1>

        <p>{errorMessage}</p>

        <div className={styles.actions}>
          {onRetry && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={onRetry}
            >
              <RefreshCw size={18} />
              <span>Try again</span>
            </button>
          )}

          <Link to="/" className={styles.secondaryButton}>
            <Home size={18} />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Error;