import styles from "./User.module.css";

 const User = () => {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Users</span>
          <h1>User Management</h1>
          <p>Manage users and access permissions.</p>
        </div>

        <button type="button" className={styles.button}>
          Add User
        </button>
      </div>

      <div className={styles.card}>
        <div>
          <strong>Theme integration</strong>
          <p>
            This page inherits the global background, surface, text, border,
            primary, header, and footer theme variables.
          </p>
        </div>
      </div>
    </section>
  );
};

export default User;
