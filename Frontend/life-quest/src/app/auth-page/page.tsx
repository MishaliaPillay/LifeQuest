"use client";
import React, { useState } from "react";
import { Tabs } from "antd";
import { useEffect } from "react";
import LoginComponent from "../../components/login/login";
import SignupComponent from "../../components/signup/signup";
import styles from "./auth.module.css";
import { useAuthState } from "@/providers/auth-provider";

import { useRouter } from "next/navigation";
import { getRole } from "@/utils/decoder";
const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const { isSuccess, isError, isPending } = useAuthState();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    if (isPending) setLoading(true);

    if (isError) {
      console.log("Your authentication was unsuccessful!");
      setLoading(false);
    }

    if (isSuccess && authMode === "login") {
      const role = getRole(token);

      setTimeout(() => {
        if (role === "default") {
          router.push("/user-page");
        } else {
          router.push("/");
        }
      }, 2500);
    } else if (isSuccess && authMode === "signup") {
      setTimeout(() => {
        setActiveTab("login");
      }, 2500);
    }

    setLoading(false);
  }, [isPending, isError, isSuccess, router, authMode, setActiveTab]);

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
