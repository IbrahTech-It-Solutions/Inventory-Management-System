import ThemeUI  from "../../components/ui/ThemeUI";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <body className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>InventorySystem</span>

        <h1>Inventory Dashboard</h1>

        <p>
          Manage products, categories, suppliers, users, and inventory from one
          place.
        </p>
      </div>

      <ThemeUI />
    </body>
  );
};

export default Home;
