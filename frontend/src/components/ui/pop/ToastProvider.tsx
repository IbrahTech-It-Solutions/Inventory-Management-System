import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Toast from "./Toast";
import type {
  CreateToastInput,
  ToastMessage,
} from "./Toast.types";
import styles from "./Toast.module.css";

type ToastContextValue = {
  showToast: (toast: CreateToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

export const ToastContext =
  createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    (toast: CreateToastInput) => {
      const id = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          ...toast,
          id,
        },
      ]);

      return id;
    },
    [],
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      removeToast,
      clearToasts,
    }),
    [showToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;