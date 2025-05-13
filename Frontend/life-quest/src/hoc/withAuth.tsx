"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, getId } from "@/utils/decoder";
import { useAuthActions } from "@/providers/auth-provider";
import { usePathsActions } from "../providers/paths";

interface LayoutProps {
  children?: React.ReactNode;
}

export const useAuthRouting = () => {
  const router = useRouter();
  const { getCurrentPerson } = useAuthActions();
  const { getPath } = usePathsActions();

  const routeUserAfterAuth = async (token: string | null) => {
    if (!token) {
      router.push("/auth-page");
      return;
    }

    try {
      const userId = getId(token);
      if (userId && userId !== "1") {
        const userIdNum = parseInt(userId, 10);
        if (!isNaN(userIdNum)) {
          const personData = await getCurrentPerson(userIdNum);
          const pathId = personData?.pathId;

          if (!pathId || pathId === "0" || pathId === "") {
            router.push("/new-page");
            return;
          }

          try {
            const pathData = await getPath(pathId);
            switch (pathData?.pathType?.toLowerCase()) {
              case "fitnesspath":
                router.push("/fitness-path");
                break;
              case "healthpath":
                router.push("/health-path");
                break;
              default:
                router.push("/new-page");
            }
            return;
          } catch (err) {
            console.error("Error fetching path details:", err);
            router.push("/error-page");
            return;
          }
        }
      }

      const role = getRole(token);
      if (role === "default") {
        router.push("/new-page");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error decoding token or routing:", error);
      router.push("/");
    }
  };

  return { routeUserAfterAuth };
};

const withAuth = (WrappedLayout: React.ComponentType<LayoutProps>) => {
  const WithAuthWrapper: React.FC<LayoutProps> = ({ children, ...props }) => {
    const { routeUserAfterAuth } = useAuthRouting();

    useEffect(() => {
      const token = sessionStorage.getItem("jwt");
      routeUserAfterAuth(token);
    }, []);

    return <WrappedLayout {...props}>{children}</WrappedLayout>;
  };

  return WithAuthWrapper;
};

export default withAuth;
