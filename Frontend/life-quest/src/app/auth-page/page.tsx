"use client";
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import LoginComponent from "../../components/login/login";
import SignupComponent from "../../components/signup/signup";
import styles from "./auth.module.css";
import { useAuthState, useAuthActions } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { getRole, getId } from "@/utils/decoder";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const { isSuccess, isError, isPending } = useAuthState();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const { getCurrentPerson } = useAuthActions();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    if (isPending) setLoading(true);

    if (isError) {
      setLoading(false);
    }

    if (isSuccess && authMode === "login") {
      handleSuccessfulLogin(token);
    } else if (isSuccess && authMode === "signup") {
      setTimeout(() => {
        setActiveTab("login");
      }, 2500);
    }

    setLoading(false);
  }, [isPending, isError, isSuccess, router, authMode, setActiveTab]);

  const handleSuccessfulLogin = async (token: string | null) => {
    if (!token) return;

    try {
      // Get user ID from token
      const userId = getId(token);

      if (userId && userId !== "1") {
        const userIdNum = parseInt(userId, 10);

        if (!isNaN(userIdNum)) {
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
          } else {
            console.error("Person data not found");
            // Default fallback route
            router.push("/fitness-path");
          }
        } else {
          console.error("Invalid user ID format");
          router.push("/fitness-path"); // Default fallback
        }
      } else {
        const role = getRole(token);
        // Fallback to original routing logic
        if (role === "default") {
          router.push("/fitness-path");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error during login routing:", error);
      // Fallback to original routing logic
      const role = getRole(token);
      if (role === "default") {
        router.push("/auth-page");
      } else {
        router.push("/");
      }
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <div className={styles.logoCircle} />
          Life Quest
        </div>

        <div className={styles.welcomeText}>
          <h1>Welcome Page</h1>
          <p>Sign in to continue access to your account and all our features</p>
        </div>
        {/* Loading indicator */}
        {loading && <div className={styles.loading}>Loading...</div>}
        {/* Background circles */}
        <div
          className={styles.circle}
          style={{
            width: "150px",
            height: "150px",
            top: "15%",
            left: "10%",
            background: "#ff9171",
          }}
        />
        <div
          className={styles.circle}
          style={{
            width: "100px",
            height: "100px",
            top: "50%",
            left: "25%",
            background: "#a742ff",
          }}
        />
        <div
          className={styles.circle}
          style={{
            width: "200px",
            height: "200px",
            bottom: "10%",
            right: "15%",
            background: "#ff6b98",
          }}
        />
        <div
          className={styles.circle}
          style={{
            width: "70px",
            height: "70px",
            top: "30%",
            right: "20%",
            background: "#ff9171",
          }}
        />
      </div>

      <div className={styles.rightSide}>
        <Tabs
          className={styles.tabs}
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          items={[
            {
              label: "Login",
              key: "login",
              children: <LoginComponent />,
            },
            {
              label: "Sign Up",
              key: "signup",
              children: (
                <SignupComponent
                  onBeforeSubmit={() => setAuthMode("signup")}
                  onSignupSuccess={() => setActiveTab("login")}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AuthPage;
