
import styles from "./Dashboard.module.css";

const Dashboard = () => {
   
    return (
        <section className={styles.page}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>InventorySystem</span>
                <h1>Inventory Dashboard</h1>
                <p>
                    Manage products, categories, suppliers, users, and inventory
                    from one place.
                </p>
              
            </div>
        </section>
    );
};
export default Dashboard;
