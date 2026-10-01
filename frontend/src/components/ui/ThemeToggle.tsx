import { Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.css";
import { useTheme } from "../../theme/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === "light" ? <Moon /> : <Sun />}
      </span>

      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
};
