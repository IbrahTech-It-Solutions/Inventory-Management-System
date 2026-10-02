import { Outlet } from "react-router-dom";
import LocationDateTime from "../components/ui/date/LocationDateTime";
import Sidebar from "../components/layout/Sidebar";
import styles from "./DashboardLayout.module.css";
import ToastProvider from "../components/ui/pop/ToastProvider";

const DashboardLayout = () => {
  return (
    <ToastProvider>
      <div className={styles.layout}>
        <Sidebar />

        <main className={styles.main}>
          <div   data-scroll-container className={styles.container}>
            <Outlet />
          </div>
        </main>

        <LocationDateTime location="Accra" />
      </div>
    </ToastProvider>
  );
};

export default DashboardLayout;
