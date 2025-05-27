"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RealTimePermissionsProps {
  children: React.ReactNode;
  userEmail: string;
}

const RealTimePermissions = ({
  children,
  userEmail,
}: RealTimePermissionsProps) => {
  const router = useRouter();

  useEffect(() => {
    // Listen for permission changes via custom events
    const handlePermissionUpdate = (event: CustomEvent) => {
      if (event.detail?.email === userEmail) {
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    };

    // Listen for storage events (potential permission changes)
    const handleStorageChange = () => {
      setTimeout(() => {
        router.refresh();
      }, 2000);
    };

    window.addEventListener(
      "permissionUpdated",
      handlePermissionUpdate as EventListener
    );
    window.addEventListener("storage", handleStorageChange);

    // Also refresh when the window regains focus (user comes back to tab)
    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener(
        "permissionUpdated",
        handlePermissionUpdate as EventListener
      );
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userEmail, router]);

  return <>{children}</>;
};

export default RealTimePermissions;
