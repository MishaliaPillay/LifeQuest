"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Skeleton,
  Col,
  Row,
  Typography,
  message,
  Spin,
  Progress,
  Badge,
  Tag,
  Statistic,
  Tabs,
  App,
  Modal,
  Button,
} from "antd";
import {
  FireOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  StarFilled,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getId } from "../../utils/decoder";
import { useAuthActions } from "@/providers/auth-provider";
import { useMealPlanActions } from "@/providers/health-path-provider/meal-plan";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";
import {
  useStepsActions,
  useStepsState,
} from "@/providers/fitnesspath/step-provider";

import { IAuth } from "@/providers/auth-provider/context";
import AvatarAnlysiss from "@/components/avatar/avatar-scan";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const workoutCategories = {
  strength: "💪",
  cardio: "🏃‍♂️",
  flexibility: "🧘‍♀️",
  recovery: "🔄",
  hiit: "⚡",
};

export default function FitnessDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [person, setPerson] = useState<IAuth>(null); // ideally, type this properly if you have the model
  const [mealPlan, setMealPlan] = useState([]);
  const { getMealPlanDaysByPlanId } = useMealPlanActions();
  const { getCurrentPerson } = useAuthActions();

  const { getHealthPath, getHealthPaths } = useHealthPathActions();
  const { getSteps } = useStepsActions();
  const { steps } = useStepsState();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("jwt");

        if (!token) {
          message.error("JWT not found");
          return;
        }

        const id = getId(token);
        const person = await getCurrentPerson(parseInt(id));
        if (person?.xp !== undefined) {
          setPerson(person);
        }

        console.log("eron", person.avatar);

        if (!person?.id) {
          message.warning("Person not found for this user.");
          return;
        }

        // Fetch workout plan data
        await fetchMealPlan();

        // Fetch steps data
        await fetchStepsData(person.id);
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        message.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Fetch workout plan data
  // Add new function
  const fetchMealPlan = async (): Promise<void> => {
    try {
      setLoadingWorkouts(true);

      const token = sessionStorage.getItem("jwt");
      if (!token) {
        message.error("JWT not found");
        setLoadingWorkouts(false);
        return;
      }

      const id = getId(token);
      const person = await getCurrentPerson(parseInt(id));
      if (!person?.id) {
        message.warning("Person not found.");
        setLoadingWorkouts(false);
        return;
      }

      const healthPathData = await getHealthPath(person.id);
      if (!healthPathData?.id) {
        message.warning("Health path not found.");
        setLoadingWorkouts(false);
        return;
      }

      const fullPath = await getHealthPaths(healthPathData.id);
      // Using the health path data directly instead of storing in state

      const mealPlanId = fullPath.mealPlans?.[0]?.id;
      if (!mealPlanId) {
        message.warning("No meal plan found.");
        setLoadingWorkouts(false);
        return;
      }

      // Using mealPlanId directly instead of storing in state
      const mealsResponse = await getMealPlanDaysByPlanId(mealPlanId);
      const mealDays = mealsResponse?.result ?? [];

      const enrichedPlan = mealDays.map((day) => {
        let difficulty = "easy";
        if (day.score > 40) difficulty = "medium";
        if (day.score > 50) difficulty = "hard";
        if (day.score > 60) difficulty = "intense";

        const estimatedTime = Math.round(day.score / 10);

        return {
          ...day,
          difficulty,
          estimatedTime,
        };
      });

      setMealPlan(enrichedPlan);
      message.success("Meal plan loaded successfully");
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      message.error("Failed to load meal plan data");
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // Fetch steps data
  const fetchStepsData = async (id) => {
    try {
      setLoadingSteps(true);
      await getSteps(id);
      message.success("Steps data loaded successfully");
    } catch (error) {
      console.error("Error fetching steps data:", error);
      message.error("Failed to load steps data");
    } finally {
      setLoadingSteps(false);
    }
  };

  // Calculate steps statistics
  const stepsStats = useMemo(() => {
    if (!steps.length)
      return {
        weeklyAverage: 0,
        todaySteps: 0,
        totalSteps: 0,
        caloriesBurned: 0,
        weeklyProgress: 0,
        bestDay: { date: "", count: 0 },
      };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const last7DaysSteps = steps.filter((step) => {
      const stepDate = new Date(step.date);
      return stepDate >= oneWeekAgo && stepDate <= today;
    });

    const weeklyAverage =
      last7DaysSteps.length > 0
        ? Math.round(
            last7DaysSteps.reduce((sum, step) => sum + step.steps, 0) /
              last7DaysSteps.length
          )
        : 0;

    const todayEntry = steps.find(
      (step) => new Date(step.date).toISOString().split("T")[0] === todayStr
    );

    const totalSteps = steps.reduce((sum, step) => sum + step.steps, 0);
    const caloriesBurned = Math.round(totalSteps * 0.04);

    const weeklyProgress = Math.min(
      100,
      Math.round((weeklyAverage / 10000) * 100)
    );

    const sortedSteps = [...steps].sort((a, b) => b.steps - a.steps);
    const bestDay =
      sortedSteps.length > 0
        ? {
            date: new Date(sortedSteps[0].date).toLocaleDateString(),
            count: sortedSteps[0].steps,
          }
        : { date: "", count: 0 };

    return {
      weeklyAverage,
      todaySteps: todayEntry ? todayEntry.steps : 0,
      totalSteps,
      caloriesBurned,
      weeklyProgress,
      bestDay,
    };
  }, [steps]);

  // Process chart data for steps
  const stepsChartData = useMemo(() => {
    return steps
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        steps: item.steps,
        calories: Math.round(item.steps * 0.04),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [steps]);

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: "green",
      medium: "blue",
      hard: "orange",
      intense: "red",
    };
    return colorMap[difficulty] || "blue";
  };

  // Calculate workout plan progress
  const completedCount = mealPlan.filter((day) => day.isComplete).length;
  const workoutProgress =
    mealPlan.length > 0
      ? Math.round((completedCount / mealPlan.length) * 100)
      : 0;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <App>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>{`Date: ${label}`}</p>
            <p
              style={{ margin: "5px 0", color: "#52c41a" }}
            >{`Steps: ${payload[0].value?.toLocaleString()}`}</p>
            {payload[1] && (
              <p
                style={{ margin: "5px 0", color: "#ff7a45" }}
              >{`Calories: ${payload[1].value?.toLocaleString()}`}</p>
            )}
          </div>
        </App>
      );
    }
    return null;
  };

  return (
    <App>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Title level={2} style={{ marginBottom: 24 }}>
          Health Dashboard
        </Title>
        <Card
          style={{
            borderRadius: 8,
            marginBottom: 80,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
            maxHeight: 300,
            backgroundColor: "#fff",
            maxWidth: 300,
            margin: "auto",
          }}
          cover={
            person?.avatar ? (
              <img
                alt="User Avatar"
                src={person.avatar}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "cover",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
            ) : (
              <Skeleton.Image active style={{ width: 300, height: 300 }} />
            )
          }
        />
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            {person && (
              <Card
                variant="outlined"
                style={{ borderRadius: 8, marginBottom: 24 }}
              >
                <Title level={4}>Level {person.level}</Title>

                <Progress
                  percent={(person.xp / 5000) * 100}
                  format={() => {
                    const level = person.level;

                    return level >= 10
                      ? `Level ${level} (Max Level)`
                      : `Level ${level} `;
                  }}
                />

                <Text>
                  <StarFilled style={{ color: "#ff4d4f", marginRight: 8 }} />{" "}
                  XP: {person.xp} / 5000
                </Text>
              </Card>
            )}
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              style={{ marginBottom: 24 }}
            >
              Open Avatar Description Generator
            </Button>

            {/* Overview Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  variant="outlined"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    backgroundColor: "#ffffff", // white background
                  }}
                >
                  <Statistic
                    title="Daily Step Average"
                    value={stepsStats.weeklyAverage}
                    suffix="steps"
                    valueStyle={{
                      background:
                        "linear-gradient(135deg, #F23D5E, #D9328E, #BF3FB7, #F24141, #FB765C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  variant="outlined"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    backgroundColor: "#ffffff", // white background
                  }}
                >
                  <Statistic
                    title="Today's Steps"
                    value={stepsStats.todaySteps}
                    suffix="steps"
                    valueStyle={{
                      background:
                        "linear-gradient(135deg, #F23D5E, #D9328E, #BF3FB7, #F24141, #FB765C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  variant="outlined"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    backgroundColor: "#ffffff", // white background
                  }}
                >
                  <Statistic
                    title="Calories Burned"
                    value={stepsStats.caloriesBurned}
                    valueStyle={{
                      background:
                        "linear-gradient(135deg, #F23D5E, #D9328E, #BF3FB7, #F24141, #FB765C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }}
                    prefix={<FireOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  variant="outlined"
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    backgroundColor: "#ffffff", // white background
                  }}
                >
                  <Statistic
                    title="Workout Completion"
                    value={workoutProgress}
                    suffix="%"
                    valueStyle={{
                      background:
                        "linear-gradient(135deg, #F23D5E, #D9328E, #BF3FB7, #F24141, #FB765C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Main Content Tabs */}
            <Card variant="outlined" style={{ borderRadius: 12 }}>
              <Tabs defaultActiveKey="1">
                {/* Activity Overview Tab */}
                <TabPane tab="Activity Overview" key="1">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Card title="Steps Progress" variant="outlined">
                        <Progress
                          percent={stepsStats.weeklyProgress}
                          status={
                            stepsStats.weeklyProgress >= 100
                              ? "success"
                              : "active"
                          }
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                          style={{ marginBottom: 16 }}
                        />
                        <Text>
                          {stepsStats.weeklyProgress >= 100
                            ? "Congratulations! You've reached your 10,000 daily steps goal!"
                            : `${
                                10000 - stepsStats.weeklyAverage
                              } more steps per day to reach your goal`}
                        </Text>

                        {/* Steps Chart */}
                        <div style={{ marginTop: 24, height: 300 }}>
                          {loadingSteps ? (
                            <div style={{ textAlign: "center", padding: 40 }}>
                              <Spin />
                            </div>
                          ) : stepsChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stepsChartData}>
                                <defs>
                                  <linearGradient
                                    id="colorSteps"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#52c41a"
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#52c41a"
                                      stopOpacity={0.1}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                  content={
                                    <CustomTooltip
                                      active={undefined}
                                      payload={undefined}
                                      label={undefined}
                                    />
                                  }
                                />
                                <Area
                                  type="monotone"
                                  dataKey="steps"
                                  stroke="#52c41a"
                                  fillOpacity={1}
                                  fill="url(#colorSteps)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <div style={{ textAlign: "center", padding: 40 }}>
                              <Text type="secondary">
                                No steps data available
                              </Text>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card title="Meal Plan Progress" variant="outlined">
                        <Progress
                          percent={workoutProgress}
                          status={workoutProgress >= 100 ? "success" : "active"}
                          strokeColor={{
                            "0%": "#d0bdf4",
                            "100%": "#fb003a",
                          }}
                          style={{ marginBottom: 16 }}
                        />
                        <Text>
                          {completedCount} of {mealPlan.length} meals completed
                        </Text>

                        {/* Next Workouts */}
                        <div style={{ marginTop: 24 }}>
                          <Title level={5}>Upcoming Meals</Title>
                          {loadingWorkouts ? (
                            <div style={{ textAlign: "center", padding: 40 }}>
                              <Spin />
                            </div>
                          ) : mealPlan.filter((day) => !day.isComplete).length >
                            0 ? (
                            <div>
                              {mealPlan
                                .filter((day) => !day.isComplete)
                                .slice(0, 3)
                                .map((day) => (
                                  <Card
                                    key={day.id}
                                    size="small"
                                    style={{
                                      marginBottom: 12,
                                      borderRadius: 8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: 24,
                                          marginRight: 16,
                                        }}
                                      >
                                        {workoutCategories[day.workoutType]}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: 6 }}>
                                          <Tag
                                            color={getDifficultyColor(
                                              day.difficulty
                                            )}
                                          >
                                            {day.difficulty.toUpperCase()}
                                          </Tag>
                                          <Tag icon={<ClockCircleOutlined />}>
                                            {day.estimatedDuration} min
                                          </Tag>
                                        </div>
                                        <Text
                                          ellipsis
                                          style={{ width: "100%" }}
                                        >
                                          {day.description ||
                                            `${
                                              day.workoutType
                                                .charAt(0)
                                                .toUpperCase() +
                                              day.workoutType.slice(1)
                                            } workout`}
                                        </Text>
                                      </div>
                                      <div>
                                        <FireOutlined
                                          style={{
                                            color: "#ff4d4f",
                                            marginRight: 4,
                                          }}
                                        />
                                        <Text>{day.calories}</Text>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center", padding: 24 }}>
                              <Text type="secondary">All meals tracked!</Text>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                {/* Recent Activity Tab */}
                <TabPane tab="Recent Activity" key="2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Card title="Recent Workouts" variant="outlined">
                        {loadingWorkouts ? (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin />
                          </div>
                        ) : mealPlan.length > 0 ? (
                          <Row gutter={[16, 16]}>
                            {mealPlan.map((day, index) => (
                              <Col xs={24} sm={12} md={8} key={index}>
                                <Card
                                  title={`Day ${index + 1}`}
                                  bordered={false}
                                  style={{ borderRadius: 8 }}
                                  extra={
                                    <Tag
                                      color={getDifficultyColor(day.difficulty)}
                                    >
                                      {day.difficulty}
                                    </Tag>
                                  }
                                >
                                  <Text>
                                    <strong>Meal:</strong> {day.description}
                                  </Text>
                                  <br />
                                  <Text>
                                    <strong>Calories:</strong> {day.calories}
                                  </Text>
                                  <br />
                                  <Text>
                                    <strong>Estimated Prep Time:</strong>{" "}
                                    {day.estimatedTime} min
                                  </Text>
                                  {day.isComplete && (
                                    <Badge status="success" text="Completed" />
                                  )}
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Text type="secondary">
                              No workout plan data available
                            </Text>
                          </div>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                {/* Stats Tab */}
                <TabPane tab="Stats & Trends" key="3">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Card title="Step Tracking" variant="outlined">
                        {loadingSteps ? (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin />
                          </div>
                        ) : stepsChartData.length > 0 ? (
                          <>
                            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                              <Col xs={24} md={6}>
                                <Statistic
                                  title="Best Day"
                                  value={stepsStats.bestDay.count}
                                  suffix={`(${stepsStats.bestDay.date})`}
                                  valueStyle={{ color: "#52c41a" }}
                                  prefix={<ArrowUpOutlined />}
                                />
                              </Col>
                              <Col xs={24} md={6}>
                                <Statistic
                                  title="Total Steps"
                                  value={stepsStats.totalSteps}
                                  valueStyle={{ color: "#1890ff" }}
                                />
                              </Col>
                              <Col xs={24} md={6}>
                                <Statistic
                                  title="Total Calories"
                                  value={stepsStats.caloriesBurned}
                                  valueStyle={{ color: "#fa8c16" }}
                                  prefix={<FireOutlined />}
                                />
                              </Col>
                              <Col xs={24} md={6}>
                                <Statistic
                                  title="Weekly Goal"
                                  value={stepsStats.weeklyProgress}
                                  suffix="%"
                                  valueStyle={{ color: "#722ed1" }}
                                />
                              </Col>
                            </Row>

                            <ResponsiveContainer width="100%" height={400}>
                              <LineChart data={stepsChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                  content={
                                    <CustomTooltip
                                      active={undefined}
                                      payload={undefined}
                                      label={undefined}
                                    />
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="steps"
                                  stroke="#1890ff"
                                  strokeWidth={3}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="calories"
                                  stroke="#ff7a45"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </>
                        ) : (
                          <div style={{ textAlign: "center", padding: 40 }}>
                            <Text type="secondary">
                              No steps data available
                            </Text>
                          </div>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </>
        )}{" "}
        <Modal
          title="Avatar Description Generator"
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={700} // adjust size as needed
          destroyOnClose={true} // optional: reset component state when closing
        >
          <AvatarAnlysiss userLevel={person?.level ?? 1} />
        </Modal>
      </div>
    </App>
  );
}
