import { Clock3, RefreshCw } from "lucide-react";
import styles from "./Maintenance.module.css";

type MaintenanceProps = {
  message?: string;
  onRetry?: () => void;
};

const Maintenance = ({
  message = "The system is temporarily unavailable while we perform an update.",
  onRetry,
}: MaintenanceProps) => {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          <Clock3 size={34} />
        </div>

        <span className={styles.status}>System update</span>

        <h1>We'll be back shortly</h1>

        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className={styles.button}
            onClick={onRetry}
          >
            <RefreshCw size={18} />
            <span>Check again</span>
          </button>
        )}
      </div>
    </main>
  );
};

export default Maintenance;