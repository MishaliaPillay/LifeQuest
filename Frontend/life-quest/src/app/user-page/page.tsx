"use client"
import React, { useEffect, useState, useRef } from "react";
import { Typography, Card, Spin } from "antd";
import { useUserState } from "@/providers/user-provider";
import { useUserActions } from "@/providers/user-provider"; // Importing actions
import withAuth from "../../hoc/withAuth";
import styles from "./userDashboard.module.css";

const { Title, Paragraph } = Typography;

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useUserActions(); // Hook to access the actions
  const hasFetched = useRef(false); // Ref to track if data has been fetched

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    if (token && !currentUser && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      getCurrentUser(token).finally(() => {
        setLoading(false); // Set loading to false after the request completes
      });
    } else {
      setLoading(false); // Stop loading immediately if token doesn't exist or user is loaded
    }
  }, [currentUser, getCurrentUser]);

  if (loading || !currentUser?.name) {
    return (
      <Spin size="large">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>Loading your dashboard...</div>
        </div>
      </Spin>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Card className={styles.welcomeCard}>
        <Title level={2}>
          🚀 Welcome,{" "}
          <span className={styles.userName}>{currentUser.name}</span>
        </Title>
        <Paragraph>
          Ready to embark on your next LifeQuest? Explore goals, track progress,
          and stay motivated.
        </Paragraph>
      </Card>
    </div>
  );
};

export default withAuth(UserDashboard);
