"use client";
import React, { useEffect, useState, useRef } from "react";
import { Spin, message, Layout } from "antd";
import { useUserState, useUserActions } from "@/providers/user-provider";
import { useAuthActions } from "@/providers/auth-provider";
import { getId } from "@/utils/decoder";
import withAuth from "../../hoc/withAuth";
import StepBasedFitnessPlanner from "./step";

const { Content } = Layout;

// Define the theme using your provided color palette
const theme = {
  colors: {
    primary: "#F23D5E",
    secondary: "#D9328E",
    tertiary: "#BF3FB7",
    accent1: "#F24141",
    accent2: "#FB765C"
  }
};

// Custom styles for the dashboard
const styles = {
  loadingContainer: {
    display: "flex",
    FlexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)"
  },
  loadingContent: {
    marginTop: "16px",
    fontSize: "16px",
    color: "#333"
  },
  dashboardWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)"
  },
  spinnerColor: {
    color: theme.colors.primary
  }
};

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const { getCurrentPerson } = useAuthActions();

  const [loading, setLoading] = useState(true);
  const [personId, setPersonId] = useState<string>("");
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUserAndPerson = async () => {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        message.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        await getCurrentUser(token);
      } catch (error) {
        console.error("Error fetching current user:", error);
        message.error("Failed to load user data.");
        setLoading(false);
        return;
      }

      const userId = getId(token);
      if (!userId || userId === "1") {
        message.error("Invalid user ID.");
        setLoading(false);
        return;
      }

      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        message.error("Invalid user ID format.");
        setLoading(false);
        return;
      }

      try {
        const personData = await getCurrentPerson(userIdNum);
        if (personData?.id) {
          setPersonId(personData.id);
        } else {
          message.warning("Person ID not found.");
        }
      } catch (error) {
        console.error("Error fetching person data:", error);
        message.error("Failed to fetch person data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPerson();
  }, [getCurrentUser, getCurrentPerson]);

  if (loading || !currentUser?.name) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" style={{ ...styles.spinnerColor }} />
        <div style={styles.loadingContent}>
          <span style={{ background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Loading your fitness journey...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Layout style={styles.dashboardWrapper}>
      <Content>
        <StepBasedFitnessPlanner personId={personId} />
      </Content>
    </Layout>
  );
};

export default withAuth(UserDashboard);