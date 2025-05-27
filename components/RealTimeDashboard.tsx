"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RealTimeDashboardProps {
  children: React.ReactNode;
  userEmail: string;
}

const RealTimeDashboard = ({ children, userEmail }: RealTimeDashboardProps) => {
  const router = useRouter();

  useEffect(() => {
    // Listen for new document sharing events
    const handleDocumentShared = (event: CustomEvent) => {
      if (event.detail?.email === userEmail) {
        // Refresh the dashboard when a new document is shared with this user
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    };

    // Listen for permission updates that might affect document access
    const handlePermissionUpdate = (event: CustomEvent) => {
      if (event.detail?.email === userEmail) {
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    };

    // Listen for window focus to refresh dashboard (when user returns to tab)
    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener(
      "documentShared",
      handleDocumentShared as EventListener
    );
    window.addEventListener(
      "permissionUpdated",
      handlePermissionUpdate as EventListener
    );
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener(
        "documentShared",
        handleDocumentShared as EventListener
      );
      window.removeEventListener(
        "permissionUpdated",
        handlePermissionUpdate as EventListener
      );
      window.removeEventListener("focus", handleFocus);
    };
  }, [userEmail, router]);

  return <>{children}</>;
};

export default RealTimeDashboard;
