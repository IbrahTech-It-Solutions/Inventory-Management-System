import { useEffect, useState } from "react";

const getInitialOnlineStatus = () => {
  // return typeof navigator === "undefined" ? true : navigator.onLine;
  return true
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(getInitialOnlineStatus);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
