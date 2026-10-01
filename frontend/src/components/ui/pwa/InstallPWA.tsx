import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import styles from "./InstallPWA.module.css";
import Button from "../button/Button";
import Loading from "../../../pages/system/Loading/Loading";
import { usePWAInstallPrompt } from "../../../hooks/usePWAInstallPrompt";

const InstallPWA = () => {
  const { isInstallable, promptInstall } = usePWAInstallPrompt();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const standaloneMediaQuery = window.matchMedia(
      "(display-mode: standalone)",
    );

    const checkInstallation = () => {
      const navigatorWithStandalone = window.navigator as Navigator & {
        standalone?: boolean;
      };

      const installed =
        standaloneMediaQuery.matches ||
        Boolean(navigatorWithStandalone.standalone);

      setIsInstalled(installed);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    checkInstallation();

    window.addEventListener("appinstalled", handleAppInstalled);

    standaloneMediaQuery.addEventListener(
      "change",
      checkInstallation,
    );

    return () => {
      window.removeEventListener(
        "appinstalled",
        handleAppInstalled,
      );

      standaloneMediaQuery.removeEventListener(
        "change",
        checkInstallation,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!isInstallable || isInstalling) return;

    setIsInstalling(true);

    try {
      await promptInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return (
      <div className={styles.status}>
        <span className={styles.statusIcon} aria-hidden="true">
          <Check size={16} strokeWidth={2.2} />
        </span>

        <div className={styles.statusContent}>
          <span className={styles.statusTitle}>
            InventorySystem is installed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <Button
            type="button"
            variant="icon"
            disabled={!isInstallable || isInstalling}
            onClick={handleInstall}
            aria-label={
              isInstallable
                ? "Install InventorySystem"
                : "Installation unavailable"
            }
          >
            {isInstalling ? (
              <Loading variant="button" />
            ) : (
              <Download size={20} strokeWidth={1.9} />
            )}
          </Button>
        </div>

        <div className={styles.content}>


          <p>
            {isInstallable
              ? "Install the application for faster access from your device."
              : "The application is not currently available for installation."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;