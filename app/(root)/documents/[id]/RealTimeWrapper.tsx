"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RealTimeWrapperProps {
  children: React.ReactNode;
  roomId: string;
  userEmail: string;
  initialUserType: "editor" | "viewer";
}

const RealTimeWrapper = ({
  children,
  roomId,
  userEmail,
  initialUserType,
}: RealTimeWrapperProps) => {
  const router = useRouter();
  const [lastCheck, setLastCheck] = useState(Date.now());

  useEffect(() => {
    // Poll for permission changes every 3 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      // Only refresh if it's been more than 30 seconds to avoid excessive refreshes
      if (now - lastCheck > 30000) {
        router.refresh();
        setLastCheck(now);
      }
    }, 3000);

    // Listen for focus events to refresh when user comes back to tab
    const handleFocus = () => {
      router.refresh();
      setLastCheck(Date.now());
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router, lastCheck]);

  return <>{children}</>;
};

export default RealTimeWrapper;
