import type { ReactNode } from "react";
import NoConnection from "../../../pages/system/NoConnection/NoConnection";
import useOnlineStatus from "../../../hooks/useOnlineStatus";

type NetworkGuardProps = {
  children: ReactNode;
};

const NetworkGuard = ({ children }: NetworkGuardProps) => {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <NoConnection />;
  }

  return children;
};

export default NetworkGuard;