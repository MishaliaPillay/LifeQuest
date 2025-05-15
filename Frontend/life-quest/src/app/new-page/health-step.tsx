"use client";
import React, { useState } from "react";
import {
  Typography,
  Card,
  Form,
  Button,
  message,
  Steps,
  Input,
  Result,
  Layout,
  Row,
  Col,
  Badge,
  Avatar,
  Space,
} from "antd";
import { useUserState } from "@/providers/user-provider";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";

import { useRouter } from "next/navigation";
import {
  RocketOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Meals from "@/components/path-sign-up/health/meals-ai";
import MealPlanBuilder from "@/components/path-sign-up/health/meal-plan";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Custom styling for the theme
const theme = {
  colors: {
    primary: "#F23D5E",
    secondary: "#D9328E",
    tertiary: "#BF3FB7",
    accent1: "#F24141",
    accent2: "#FB765C",
    lightGray: "#f7f7f7",
    darkGray: "#333333",
    white: "#FFFFFF",
  },
  gradients: {
    main: "linear-gradient(90deg, #F23D5E 0%, #D9328E 50%, #BF3FB7 100%)",
    secondary: "linear-gradient(90deg, #F24141 0%, #FB765C 100%)",
  },
};

// Custom styles for components
const styles = {
  welcomeCard: {
    backgroundImage: theme.gradients.main,
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(242, 61, 94, 0.15)",
    color: theme.colors.white,
    padding: "24px",
    marginBottom: "32px",
    border: "none",
  },
  welcomeTitle: {
    color: theme.colors.white,
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  welcomeText: {
    color: theme.colors.white,
    fontSize: "16px",
    opacity: "0.9",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  stepCard: {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginTop: "32px",
    background: theme.colors.white,
  },
  button: {
    background: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: "6px",
    height: "40px",
    fontWeight: "500",
  },
  secondaryButton: {
    borderColor: theme.colors.darkGray,
    borderRadius: "6px",
    height: "40px",
    fontWeight: "500",
  },
  statsCard: {
    background: theme.colors.lightGray,
    borderRadius: "8px",
    padding: "16px",
    height: "100%",
    TextAlign: "center",
  },
  badge: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.white,
    fontSize: "14px",
    padding: "4px 12px",
    borderRadius: "16px",
  },
  steps: {
    colorPrimary: theme.colors.primary,
  },
};

interface HealthPathFormValues {
  name: string;
  description: string;
}

// Stats component to display on welcome page
const FitnessStats = () => (
  <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
    <Col xs={24} sm={8}>
      <Card style={styles.statsCard}>
        <FireOutlined
          style={{
            fontSize: "28px",
            color: theme.colors.accent1,
            marginBottom: "8px",
          }}
        />
        <Title level={4}>85%</Title>
        <Text type="secondary">Success Rate</Text>
      </Card>
    </Col>
    <Col xs={24} sm={8}>
      <Card style={styles.statsCard}>
        <TrophyOutlined
          style={{
            fontSize: "28px",
            color: theme.colors.secondary,
            marginBottom: "8px",
          }}
        />
        <Title level={4}>10+</Title>
        <Text type="secondary">Active Users</Text>
      </Card>
    </Col>
    <Col xs={24} sm={8}>
      <Card style={styles.statsCard}>
        <CheckCircleOutlined
          style={{
            fontSize: "28px",
            color: theme.colors.tertiary,
            marginBottom: "8px",
          }}
        />
        <Title level={4}>3+</Title>
        <Text type="secondary">Exercise Types</Text>
      </Card>
    </Col>
  </Row>
);

// Enhanced StepBasedHealthPlanner component
const StepBasedHealthPlanner: React.FC<{
  personId: string;
}> = ({ personId }) => {
  const { currentUser } = useUserState();

  const { createHealthPath } = useHealthPathActions();
  const [form] = Form.useForm<HealthPathFormValues>();
  const [healthPathId, setHealthPathId] = useState<string | null>(null);
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [meals, setMeals] = useState([]);

  const handleMealsGenerated = (generatedMeals) => {
    const formatted = generatedMeals.map((meal) => ({
      id: meal.id,
      name: `${meal.name} (Calories: ${meal.calories})`,
      description: meal.description || "",
      calories: meal.calories || 0,
      ingredientIds: meal.ingredientIds || [],
      ingredients: meal.ingredients || [],
      servingSize: meal.servingSize,
      protein: meal.protein,
      carbohydrates: meal.carbohydrates,
      fats: meal.fats,
    }));
    setMeals(formatted);
  };

  const goDashboard = () => {
    router.push("/health-path");
  };

  // Handle basic info form submission
  const handleBasicInfoSubmit = async (values: HealthPathFormValues) => {
    if (!personId) {
      message.error("Person ID is missing. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      const healthpath = {
        title: values.name,
        description: values.description,
        weightEntries: [],
        activityIds: [],
        personId: personId,
        mealPlans: [],
      };

      // Await the result and store the ID
      //change here
      const createdPath = await createHealthPath(healthpath);

      setHealthPathId(createdPath.id);

      message.success("Basic information saved!");
      setCurrent(1);
    } catch (error) {
      console.error("Error creating fitness path:", error);
      message.error("Failed to create fitness path.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMealPlanSubmit = () => {
    message.success("Exercise plan created!");
    setCurrent(3);
  };
  const steps = [
    {
      title: "Basic Info",
      icon: <UserOutlined />,
      content: (
        <Card style={styles.stepCard}>
          <Title level={4} style={{ marginBottom: "24px" }}>
            Tell us about your Health journey
          </Title>
          <Form form={form} layout="vertical" onFinish={handleBasicInfoSubmit}>
            <Form.Item
              name="name"
              label="Health Path Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a name for your health path",
                },
              ]}
            >
              <Input
                placeholder="e.g., Healthy Eating"
                size="large"
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please describe your health path",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Describe your nutrition goals and what you want to achieve"
                rows={4}
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px", textAlign: "right" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={styles.button}
                size="large"
                icon={<ArrowRightOutlined />}
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      title: "Personal Profile",
      icon: <UserOutlined />,
      content: (
        <Card style={styles.stepCard}>
          <Title level={4} style={{ marginBottom: "24px" }}>
            Build Your Fitness Profile
          </Title>
          <Meals onMealsGenerated={handleMealsGenerated} />
          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Button
              onClick={() => setCurrent(0)}
              style={{ ...styles.secondaryButton, marginRight: "12px" }}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (meals.length > 0) {
                  setCurrent(2);
                } else {
                  message.warning("Please generate activity types first");
                }
              }}
              disabled={meals.length === 0}
              style={styles.button}
              icon={<ArrowRightOutlined />}
            >
              Continue
            </Button>
          </div>
        </Card>
      ),
    },
    {
      title: "Exercise Plan",
      icon: <FireOutlined />,
      content: (
        <Card style={styles.stepCard}>
          <Title level={4} style={{ marginBottom: "24px" }}>
            Create Your Custom Workout Plan
          </Title>
          {/*exercise builder went here */}
          <MealPlanBuilder
            availableMeals={meals}
            onPlanSubmit={handleMealPlanSubmit}
            healthPathId={healthPathId}
          />

          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Button
              onClick={() => setCurrent(1)}
              style={{ ...styles.secondaryButton, marginRight: "12px" }}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
          </div>
        </Card>
      ),
    },
    {
      title: "Completed",
      icon: <CheckCircleOutlined />,
      content: (
        <Card style={styles.stepCard}>
          <Result
            status="success"
            title="Your Fitness Plan Has Been Created!"
            subTitle="You can now start following your personalized fitness journey."
            icon={
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: theme.gradients.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutlined
                  style={{
                    fontSize: "48px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            }
            extra={[
              <Button
                onClick={goDashboard}
                type="primary"
                key="dashboard"
                size="large"
                style={{
                  ...styles.button,
                  background: theme.gradients.main,
                  height: "48px",
                  fontSize: "16px",
                  padding: "0 32px",
                }}
              >
                Go to Dashboard
              </Button>,
            ]}
          />

          {/* Added follow-up suggestions */}
          <div style={{ marginTop: "48px" }}>
            <Title level={4}>What&apos;s Next?</Title>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col xs={24} md={8}>
                <Card hoverable style={{ height: "100%" }}>
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <Avatar
                      size={64}
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      1
                    </Avatar>
                    <Text strong>Track Your Progress</Text>
                    <Text type="secondary">
                      Log your workouts and measurements to see your improvement
                      over time
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable style={{ height: "100%" }}>
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <Avatar
                      size={64}
                      style={{ backgroundColor: theme.colors.secondary }}
                    >
                      2
                    </Avatar>
                    <Text strong>Earn XP</Text>
                    <Text type="secondary">
                      Level up and upgrade your avatar
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable style={{ height: "100%" }}>
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <Avatar
                      size={64}
                      style={{ backgroundColor: theme.colors.tertiary }}
                    >
                      3
                    </Avatar>
                    <Text strong>Challenge yourself</Text>
                    <Text type="secondary">
                      Check your stats to get better everyday
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <Content style={styles.container}>
      {/* Welcome Card with Gradient Background */}
      <Card style={styles.welcomeCard}>
        <Space align="center" style={{ marginBottom: "16px" }}>
          <RocketOutlined
            style={{ fontSize: "36px", color: theme.colors.white }}
          />
          <Badge
            count="Premium"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: theme.colors.white,
              fontWeight: "bold",
              fontSize: "12px",
            }}
          />
        </Space>
        <Title level={2} style={styles.welcomeTitle}>
          Welcome, {currentUser?.name || "Fitness Enthusiast"}!
        </Title>
        <Paragraph style={styles.welcomeText}>
          You&apos;re about to create a personalized health plan tailored
          specifically to your body&apos;s needs and dietary goals. Our
          AI-powered system will guide you through generating nutritious,
          goal-aligned meals that support your lifestyle and well-being
        </Paragraph>

        {current === 0 && <FitnessStats />}
      </Card>

      <Steps
        current={current}
        items={steps.map((item, index) => ({
          key: index,
          title: item.title,
          icon: item.icon,
        }))}
        progressDot
        style={{
          marginBottom: "32px",
          ...styles.steps,
        }}
      />

      <div>{steps[current].content}</div>
    </Content>
  );
};

export default StepBasedHealthPlanner;
