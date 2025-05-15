"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Spin,
  message,
  Layout,
  Button,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import { useUserState, useUserActions } from "@/providers/user-provider";
import { useAuthActions } from "@/providers/auth-provider";
import { getId } from "@/utils/decoder";
import withAuth from "../../hoc/withAuth";
import StepBasedFitnessPlanner from "./step";
import StepBasedHealthPlanner from "./health-step";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const theme = {
  colors: {
    primary: "#F23D5E",
    secondary: "#D9328E",
    tertiary: "#BF3FB7",
    accent1: "#F24141",
    accent2: "#FB765C",
  },
};

const styles = {
  loadingContainer: {
    display: "flex",
    FlexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)",
  },
  loadingContent: {
    marginTop: "16px",
    fontSize: "16px",
    color: "#333",
  },
  dashboardWrapper: {
    minHeight: "100vh",
    padding: "40px 24px",
    background: "linear-gradient(135deg, #fff 0%, #f0f2f5 100%)",
  },
  selectionContainer: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  spinnerColor: {
    color: theme.colors.primary,
  },
  planCard: {
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease",
  },
};

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const { getCurrentPerson } = useAuthActions();

  const [loading, setLoading] = useState(true);
  const [personId, setPersonId] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<"fitness" | "health" | null>(
    null
  );
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
      const userIdNum = parseInt(userId || "", 10);
      if (!userId || userId === "1" || isNaN(userIdNum)) {
        message.error("Invalid user ID.");
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
        <Spin size="large" style={styles.spinnerColor} />
        <div style={styles.loadingContent}>
          <span
            style={{
              background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading your journey...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Layout style={styles.dashboardWrapper}>
      <Content>
        {!selectedPlan ? (
          <div style={styles.selectionContainer}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Welcome back, {currentUser.name}!
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#555" }}>
              Choose a path to begin your next 10-day quest for personal growth.
              Each plan is uniquely tailored to help you build healthy habits
              and stay on track.
            </Paragraph>

            <Row gutter={[24, 24]} justify="center" style={{ marginTop: 32 }}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={styles.planCard}
                  onClick={() => setSelectedPlan("fitness")}
                >
                  <Title level={4}>🏋️ Fitness Plan</Title>
                  <Text>
                    Build strength, endurance, and mobility with a guided 10-day
                    workout challenge.
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Start Fitness Journey
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={styles.planCard}
                  onClick={() => setSelectedPlan("health")}
                >
                  <Title level={4}>🥗 Health Plan</Title>
                  <Text>
                    Improve your nutrition and wellness through smart meal
                    planning and tracking.
                  </Text>
                  <div style={{ marginTop: 16 }}>
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: theme.colors.secondary }}
                    >
                      Start Health Journey
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        ) : selectedPlan === "fitness" ? (
          <StepBasedFitnessPlanner personId={personId} />
        ) : (
          <StepBasedHealthPlanner personId={personId} />
        )}
      </Content>
    </Layout>
  );
};

export default withAuth(UserDashboard);
