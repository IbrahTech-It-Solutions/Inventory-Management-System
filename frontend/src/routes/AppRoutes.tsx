import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Settings from "../pages/settings/Settings";
import User from "../pages/user/User";
import { AuthLayout } from "../layouts/AuthLayout";
import ScrollToTop from "../components/common/ScrollToTop";
import NotFound from "../pages/system/NotFound/NotFound";
import Loading from "../pages/system/Loading/Loading";
import { useEffect, useState } from "react";
import Categories from "../pages/categories/Categories";
import Products from "../pages/products/Products";
import Stocks from "../pages/stocks/Stocks";
import Purchases from "../pages/purchases/Purchases";
import Orders from "../pages/orders/Orders";
import Transfers from "../pages/transfers/Transfers";
import Adjustments from "../pages/adjustments/Adjustments";
import Suppliers from "../pages/suppliers/Suppliers";
import Stats from "../pages/stats/Stats";
import UsersPermissions from "../pages/usersPermissions/UsersPermissions";
import Reports from "../pages/Reports/Reports";
import Warehouses from "../pages/warehouses/Warehouses";
import Activity from "../pages/activity/Activity";
import Notifications from "../pages/notifications/Notifications";

export const AppRoutes = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Load initial app data here if needed.
      // Example:
      // await checkApiHealth();

      setIsInitializing(false);
    };

    void initializeApp();
  }, []);

  if (isInitializing) {
    return <Loading label="Loading application..." />;
  }
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          element={
            <>
              <ScrollToTop />
              <DashboardLayout />
            </>
          }
        >
          <Route
            path="/dashboard"
            element={
              <>
                <ScrollToTop />
                <Dashboard />
              </>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/customers"
            element={
              <>
                <ScrollToTop />
                <User />
              </>
            }
          />
          <Route
            path="/categories"
            element={
              <>
                <ScrollToTop />
                <Categories />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <ScrollToTop />
                <Products />
              </>
            }
          />
          <Route
            path="/stocks"
            element={
              <>
                <ScrollToTop />
                <Stocks />
              </>
            }
          />
          <Route
            path="/warehouses"
            element={
              <>
                <ScrollToTop />
                <Warehouses />
              </>
            }
          />
          <Route
            path="/purchases"
            element={
              <>
                <ScrollToTop />
                <Purchases />
              </>
            }
          />

          <Route
            path="/purchases"
            element={
              <>
                <ScrollToTop />
                <Purchases />
              </>
            }
          />

          <Route
            path="/orders"
            element={
              <>
                <ScrollToTop />
                <Orders />
              </>
            }
          />

          <Route
            path="/transfers"
            element={
              <>
                <ScrollToTop />
                <Transfers />
              </>
            }
          />

          <Route
            path="/adjustments"
            element={
              <>
                <ScrollToTop />
                <Adjustments />
              </>
            }
          />

          <Route
            path="/suppliers"
            element={
              <>
                <ScrollToTop />
                <Suppliers />
              </>
            }
          />

          <Route
            path="/reports"
            element={
              <>
                <ScrollToTop />
                <Reports />
              </>
            }
          />

          <Route
            path="/stats"
            element={
              <>
                <ScrollToTop />
                <Stats />
              </>
            }
          />

          <Route
            path="/users-permissions"
            element={
              <>
                <ScrollToTop />
                <UsersPermissions />
              </>
            }
          />

          <Route
            path="/activity"
            element={
              <>
                <ScrollToTop />
                <Activity />
              </>
            }
          />

          <Route
            path="/notifications"
            element={
              <>
                <ScrollToTop />
                <Notifications />
              </>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
