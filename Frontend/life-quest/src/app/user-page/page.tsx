"use client";

import React, { useEffect, useState } from "react";
import { Typography, Card, Spin } from "antd";
import { useUserState } from "@/providers/user-provider";
import withAuth from "../../hoc/withAuth";
import styles from "./userDashboard.module.css"; // You can create this CSS module

const { Title, Paragraph } = Typography;

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.name) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading || !currentUser?.name) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="Loading your dashboard..." size="large" />
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Card bordered={false} className={styles.welcomeCard}>
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
