"use client";
import React, { useState } from "react";
import { Tabs } from "antd";
import LoginComponent from "../../components/login/login";
import SignupComponent from "../../components/signup/signup";
import styles from "./auth.module.css";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");

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
            { label: "Login", key: "login", children: <LoginComponent /> },
            { label: "Sign Up", key: "signup", children: <SignupComponent /> },
          ]}
        />
      </div>
    </div>
  );
};

export default AuthPage;
