import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./Button.module.css";

type ButtonVariant =
  | "borderless"
  | "border"
  | "rounded"
  | "icon"
  | "menu";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children?: ReactNode;
};

const Button = ({
  variant = "border",
  icon,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const buttonClassName = [
    styles.button,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      className={buttonClassName}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}

      {children && (
        <span className={styles.label}>
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;