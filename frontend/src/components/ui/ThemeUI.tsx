import PrimaryColor from "./PrimaryColor/PrimaryColor";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./ThemeUI.module.css";

const ThemeUI = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Theme System</span>

          <h2>Custom Theme UI</h2>

          <p>
            Use this page to verify light and dark theme tokens and
            customize the primary color used across the application.
          </p>
        </div>

        <div className={styles.controls}>
          <ThemeToggle />
          <PrimaryColor />
        </div>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.label}>Background</span>

          <div
            className={`${styles.preview} ${styles.backgroundPreview}`}
          >
            Page Background
          </div>

          <code>--color-background</code>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>Surface</span>

          <div
            className={`${styles.preview} ${styles.surfacePreview}`}
          >
            Surface
          </div>

          <code>--color-surface</code>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>Primary</span>

          <div
            className={`${styles.preview} ${styles.primaryPreview}`}
          >
            Primary
          </div>

          <code>--color-primary</code>
        </article>

        <article className={styles.card}>
          <span className={styles.label}>Border</span>

          <div
            className={`${styles.preview} ${styles.borderPreview}`}
          >
            Border
          </div>

          <code>--color-border</code>
        </article>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryButton}>
          Primary Button
        </button>

        <button type="button" className={styles.secondaryButton}>
          Secondary Button
        </button>
      </div>
    </section>
  );
};

export default ThemeUI;