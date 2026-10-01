import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Settings from "../pages/settings/Settings";
import User from "../pages/user/User";
import { AuthLayout } from "../layouts/AuthLayout";
import NotFound from "../pages/system/NotFound/NotFound";
import Loading from "../pages/system/Loading/Loading";
import { useEffect, useState } from "react";
import Categories from "../pages/categories/Categories";
import Products from "../pages/products/Products";
import Stocks from "../pages/stocks/Stocks";
import Warehouses from "../pages/warehouses/Warehouses";

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
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user" element={<User />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/stocks" element={<Stocks/>} />
        <Route path="/warehouses" element={<Warehouses/>} />
        
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
