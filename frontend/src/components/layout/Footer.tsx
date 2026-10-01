import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <strong>InventorySystem</strong>
          <p>Inventory management made simple.</p>
        </div>

        <span>© 2026 InventorySystem</span>
      </div>
    </footer>
  );
};