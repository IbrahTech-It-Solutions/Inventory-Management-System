import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useEffect } from "react";
import type { ToastMessage } from "./Toast.types";
import styles from "./Toast.module.css";

type ToastProps = {
  toast: ToastMessage;
  onClose: (id: string) => void;
};

const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    if (toast.duration === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onClose(toast.id);
    }, toast.duration ?? 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast.id, toast.duration, onClose]);

  const Icon =
    toast.type === "success"
      ? CheckCircle2
      : toast.type === "error"
        ? TriangleAlert
        : toast.type === "warning"
          ? TriangleAlert
          : Info;

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role={toast.type === "error" ? "alert" : "status"}
    >
      <div className={styles.icon}>
        <Icon size={20} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <strong>{toast.title}</strong>

        {toast.message && <p>{toast.message}</p>}
      </div>

      <button
        type="button"
        className={styles.close}
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <X size={17} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;