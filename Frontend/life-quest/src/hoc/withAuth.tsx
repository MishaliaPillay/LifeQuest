"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, getId } from "@/utils/decoder";
import { useAuthActions } from "@/providers/auth-provider";

interface LayoutProps {
  children?: React.ReactNode; // Children are optional to prevent errors
}

const withAuth = (WrappedLayout: React.ComponentType<LayoutProps>) => {
  const WithAuthWrapper: React.FC<LayoutProps> = ({ children, ...props }) => {
    const router = useRouter();
    const { getCurrentPerson } = useAuthActions();

    useEffect(() => {
      const checkAuthAndRoute = async () => {
        const token = sessionStorage.getItem("jwt");

        if (!token) {
          router.push("/auth-page");
          return;
        }

        try {
          // Get user ID from token
          const userId = getId(token);

          if (userId && userId !== "1") {
            const userIdNum = parseInt(userId, 10);

            if (!isNaN(userIdNum)) {
              try {
                // Get person data using the user ID
                const personData = await getCurrentPerson(userIdNum);

                if (personData && personData.id) {
                  // Check if pathId exists and is not empty
                  if (
                    !personData.pathId ||
                    personData.pathId === "0" ||
                    personData.pathId === ""
                  ) {
                    // User doesn't have a path, route to new-page
                    router.push("/new-page");
                  } else {
                    // User has a path, route to user-page
                    router.push("/fitness-path");
                  }
                  return;
                }
              } catch (error) {
                console.error("Error fetching person data:", error);
                // Fall back to role-based routing
              }
            }
          }

          // Fall back to role-based routing if any of the above fails
          const role = getRole(token);

          // Redirect based on role
          if (role === "default") {
            router.push("/fitness-path");
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          router.push("/"); //if decoding fails
        }
      };

      checkAuthAndRoute();
    }, []);

    return <WrappedLayout {...props}>{children}</WrappedLayout>;
  };

  return WithAuthWrapper;
};

export default withAuth;
