import { LoaderCircle } from "lucide-react";
import styles from "./Loading.module.css";

export type LoadingVariant = "fullscreen" | "button";

type LoadingProps = {
  variant?: LoadingVariant;
  label?: string;
  className?: string;
};

const Loading = ({
  variant = "fullscreen",
  label = "Loading...",
  className,
}: LoadingProps) => {
  const classes = [
    styles.loading,
    styles[variant],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <LoaderCircle
        className={styles.spinner}
        size={variant === "fullscreen" ? 36 : 16}
        strokeWidth={2}
        aria-hidden="true"
      />

      {variant === "fullscreen" && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
};

export default Loading;