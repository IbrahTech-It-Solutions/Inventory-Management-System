import { RefreshCw, WifiOff } from "lucide-react";
import styles from "./NoConnection.module.css";

type NoConnectionProps = {
  onRetry?: () => void;
};

const NoConnection = ({ onRetry }: NoConnectionProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <WifiOff size={34} strokeWidth={1.8} />
        </div>

        <span className={styles.status}>
          Connection unavailable
        </span>

        <h1>No connection</h1>

        <p>
          You're currently offline. Check your internet
          connection and try again.
        </p>

        <button
          type="button"
          className={styles.button}
          onClick={handleRetry}
        >
          <RefreshCw size={18} strokeWidth={1.8} />
          <span>Try again</span>
        </button>
      </div>
    </main>
  );
};

export default NoConnection;