import { BrowserRouter } from "react-router-dom";
import NetworkGuard from "./components/common/NetworkGuard/NetworkGuard";
import Maintenance from "./pages/system/Maintenance/Maintenance";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeProvider } from "./theme/ThemeProvider";

const App = () => {
  const isMaintenanceMode = false;

  return (
    <ThemeProvider>
      {isMaintenanceMode ? (
        <Maintenance />
      ) : (
        <BrowserRouter>
          <NetworkGuard>
            <AppRoutes />
          </NetworkGuard>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;