import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import styles from "./AuthLayout.module.css";
import { Footer } from "../components/layout/Footer";

export const AuthLayout = () => {
    return (
        <div className={styles.layout}>
            <Header />

            <div className={styles.content}>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};
