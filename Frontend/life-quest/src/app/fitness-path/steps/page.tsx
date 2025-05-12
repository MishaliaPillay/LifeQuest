"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Input,
  Button,
  Card,
  Spin,
  message,
  Modal,
  InputNumber,
  Statistic,
  Row,
  Col,
  Progress,
  Typography,
} from "antd";
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
  BarChart,
  Bar,
  Legend,
  TooltipProps,
} from "recharts";
import {
  PlusOutlined,
  ReloadOutlined,
  TrophyOutlined,
  FireOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  useStepsActions,
  useStepsState,
} from "../../../providers/fitnesspath/step-provider/index";
import { useAuthState, useAuthActions } from "../../../providers/auth-provider";
import { getId } from "../../../utils/decoder";

const { Title, Text } = Typography;

// Professional color palette
const COLORS = {
  primary: "#D9328E", // Primary brand color
  secondary: "#BF3FB7", // Secondary brand color
  accent: "#F23D5E", // Accent color
  highlight: "#FB765C", // Highlight color
  danger: "#F24141", // Danger/alert color
  lightBg: "#FFF5F9", // Light background
  darkBg: "#2A0D24", // Dark background
  textLight: "#FFFFFF", // Light text
  textDark: "#333333", // Dark text
  borderLight: "#F8D1E5", // Light border
};

const StepsGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newSteps, setNewSteps] = useState<number>(0);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeChartType, setActiveChartType] = useState<
    "area" | "line" | "bar"
  >("area");

  const { getSteps, createStep, updateStep } = useStepsActions();
  const { steps } = useStepsState();
  // Get auth state and actions
  const { Auth } = useAuthState();
  const { getCurrentPerson } = useAuthActions();

  // Get the user ID from JWT token, then fetch person data using that ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingAuth(true);
        // Get JWT token from session storage
        const accessToken = sessionStorage.getItem("jwt");

        if (accessToken) {
          // Extract user ID from JWT token
          const userId = getId(accessToken);

          if (userId && userId !== "1") {
            // Check it's not the default value
            // Convert userId to number for the API call
            const userIdNum = parseInt(userId, 10);

            if (!isNaN(userIdNum)) {
              try {
                // Get person data using the user ID from token
                const response = await getCurrentPerson(userIdNum);

                // Handle data from response
                if (response && response) {
                  const personData = response;

                  if (personData.id) {
                    // Use the person ID from the returned data
                    setPersonId(personData.id);
                    // Fetch steps using the person ID
                    handleFetchSteps(personData.id);
                    message.success("User authenticated successfully");
                  } else {
                    message.warning("Person ID not found in response");
                  }
                } else {
                  message.warning("Invalid response format from server");
                }
              } catch (error) {
                console.error("Error fetching person data:", error);
                message.error("Failed to fetch person data");
              }
            } else {
              message.error("Invalid user ID format");
            }
          } else {
            message.warning("Could not extract valid user ID from token");
          }
        } else {
          message.warning("No authentication token found. Please log in.");
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        message.error("Failed to authenticate user");
      } finally {
        setLoadingAuth(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFetchSteps = async (id = personId) => {
    if (!id) {
      message.warning("Please enter a person ID");
      return;
    }
    setLoading(true);
    try {
      await getSteps(id);
      message.success("Steps loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to load steps");
    }
    setLoading(false);
  };

  const handleAddOrUpdateToday = async () => {
    if (!personId) {
      message.warning("Please enter a person ID first");
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existingToday = steps.find(
      (step) => new Date(step.date).toISOString().split("T")[0] === todayDate
    );

    const payload = {
      id: existingToday ? existingToday.id : undefined, // only needed for update
      personId,
      date: todayDate,
      steps: newSteps,
      note: "Updated via app",
      caloriesBurned: newSteps * 0.04, // example formula
    };

    try {
      if (existingToday) {
        await updateStep(payload);
        message.success("Today's step entry updated!");
      } else {
        await createStep(payload);
        message.success("Today's step entry created!");
      }
      await getSteps(personId); // refresh graph
    } catch (error) {
      console.error(error);
      message.error("Failed to add/update today's steps");
    }

    setAdding(false);
    setNewSteps(0);
  };

  // Calculate stats
  const stats = useMemo(() => {
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

  // Process chart data
  const chartData = useMemo(() => {
    return steps
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        steps: item.steps,
        calories: Math.round(item.steps * 0.04),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [steps]);

  // Custom tooltip style
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: COLORS.lightBg,
            padding: "10px",
            border: `1px solid ${COLORS.borderLight}`,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p
            className="label"
            style={{ margin: 0, fontWeight: "bold", color: COLORS.textDark }}
          >{`Date: ${label}`}</p>
          <p
            style={{ margin: "5px 0", color: COLORS.primary }}
          >{`Steps: ${payload[0].value?.toLocaleString()}`}</p>
          {payload[1] && (
            <p
              style={{ margin: "5px 0", color: COLORS.accent }}
            >{`Calories: ${payload[1].value?.toLocaleString()}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1200,
        margin: "0 auto",
        background: `linear-gradient(to bottom, ${COLORS.lightBg}, #ffffff)`,
      }}
    >
      <Card
        title={
          <Title level={2} style={{ margin: 0, color: COLORS.textLight }}>
            <span style={{ marginRight: 10 }}>🚶‍♂️</span>
            Step Tracker Dashboard
          </Title>
        }
        variant="borderless"
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
        loading={loadingAuth}
        styles={{
          header: {
            backgroundColor: COLORS.primary,
            color: COLORS.textLight,
            padding: "16px 24px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Input
                placeholder="Person ID (Auto-detected from login)"
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                style={{
                  width: 300,
                  marginRight: 16,
                  borderRadius: 8,
                  height: 40,
                  borderColor: COLORS.borderLight,
                }}
                disabled={!!Auth?.id || loadingAuth}
              />
              <Button
                type="primary"
                onClick={() => handleFetchSteps()}
                loading={loading}
                icon={<ReloadOutlined />}
                style={{
                  borderRadius: 8,
                  height: 40,
                  background: COLORS.secondary,
                  borderColor: COLORS.secondary,
                }}
              >
                Refresh Steps
              </Button>
            </div>

            <Button
              type="primary"
              onClick={() => setAdding(true)}
              style={{
                marginBottom: 16,
                borderRadius: 8,
                height: 40,
                background: COLORS.accent,
                borderColor: COLORS.accent,
              }}
              icon={<PlusOutlined />}
            >
              Add/Update Today
            </Button>
          </Col>

          <Col xs={24} md={6}>
            <Card
              size="small"
              style={{
                backgroundColor: COLORS.lightBg,
                borderRadius: 8,
                border: `1px solid ${COLORS.borderLight}`,
              }}
            >
              <Statistic
                title={<Text strong>Today&apos;s Steps</Text>}
                value={stats.todaySteps}
                suffix="steps"
                valueStyle={{ color: COLORS.primary }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                  background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.accent}22)`,
                }}
              >
                <Statistic
                  title="Daily Average"
                  value={stats.weeklyAverage}
                  suffix="steps"
                  valueStyle={{ color: COLORS.primary }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                  background: `linear-gradient(135deg, ${COLORS.secondary}22, ${COLORS.primary}22)`,
                }}
              >
                <Statistic
                  title="Total Steps"
                  value={stats.totalSteps}
                  valueStyle={{ color: COLORS.secondary }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                  background: `linear-gradient(135deg, ${COLORS.highlight}22, ${COLORS.danger}22)`,
                }}
              >
                <Statistic
                  title="Calories Burned"
                  value={stats.caloriesBurned}
                  valueStyle={{ color: COLORS.highlight }}
                  prefix={<FireOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                size="small"
                style={{
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                  background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.secondary}22)`,
                }}
              >
                <Statistic
                  title="Best Day"
                  value={stats.bestDay.count}
                  suffix={`(${stats.bestDay.date})`}
                  valueStyle={{ color: COLORS.accent }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 24 }}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Activity Trends</span>
                <div>
                  <Button
                    type={activeChartType === "area" ? "primary" : "default"}
                    onClick={() => setActiveChartType("area")}
                    size="small"
                    style={{
                      marginRight: 8,
                      borderRadius: 4,
                      ...(activeChartType === "area"
                        ? {
                            background: COLORS.primary,
                            borderColor: COLORS.primary,
                          }
                        : {}),
                    }}
                  >
                    Area
                  </Button>
                  <Button
                    type={activeChartType === "line" ? "primary" : "default"}
                    onClick={() => setActiveChartType("line")}
                    size="small"
                    style={{
                      marginRight: 8,
                      borderRadius: 4,
                      ...(activeChartType === "line"
                        ? {
                            background: COLORS.primary,
                            borderColor: COLORS.primary,
                          }
                        : {}),
                    }}
                  >
                    Line
                  </Button>
                  <Button
                    type={activeChartType === "bar" ? "primary" : "default"}
                    onClick={() => setActiveChartType("bar")}
                    size="small"
                    style={{
                      borderRadius: 4,
                      ...(activeChartType === "bar"
                        ? {
                            background: COLORS.primary,
                            borderColor: COLORS.primary,
                          }
                        : {}),
                    }}
                  >
                    Bar
                  </Button>
                </div>
              </div>
            }
            style={{
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            styles={{
              body: { padding: 0 },
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: 80 }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Loading your fitness data...</p>
              </div>
            ) : steps && steps.length > 0 ? (
              <div style={{ padding: 16 }}>
                <ResponsiveContainer width="100%" height={400}>
                  {activeChartType === "area" ? (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
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
                            stopColor={COLORS.primary}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLORS.primary}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorCal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLORS.accent}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLORS.accent}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="steps"
                        stroke={COLORS.primary}
                        fillOpacity={1}
                        fill="url(#colorSteps)"
                      />
                      <Area
                        type="monotone"
                        dataKey="calories"
                        stroke={COLORS.accent}
                        fillOpacity={1}
                        fill="url(#colorCal)"
                      />
                    </AreaChart>
                  ) : activeChartType === "line" ? (
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="steps"
                        stroke={COLORS.primary}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke={COLORS.accent}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="steps"
                        fill={COLORS.primary}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="calories"
                        fill={COLORS.accent}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  No steps data to display. Please fetch steps.
                </Text>
              </div>
            )}
          </Card>
        </div>

        <div style={{ marginTop: 24 }}>
          <Card title="Weekly Goal Progress" style={{ borderRadius: 12 }}>
            <Progress
              percent={stats.weeklyProgress}
              status={stats.weeklyProgress >= 100 ? "success" : "active"}
              strokeColor={{
                "0%": COLORS.secondary,
                "100%": COLORS.primary,
              }}
              size={20}
              format={(percent) => `${percent}% of 10,000 daily steps`}
            />
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              {stats.weeklyProgress >= 100
                ? "Congratulations! You've reached your goal!"
                : `Keep going! You need ${
                    10000 - stats.weeklyAverage
                  } more steps per day to reach your goal.`}
            </Text>
          </Card>
        </div>
      </Card>

      <Modal
        title="Add or Update Today's Steps"
        open={adding}
        onOk={handleAddOrUpdateToday}
        onCancel={() => setAdding(false)}
        okText="Save"
        centered
        styles={{
          header: {
            backgroundColor: COLORS.primary,
            color: COLORS.textLight,
          },
          body: { padding: "24px" },
          footer: { borderTop: `1px solid ${COLORS.borderLight}` },
        }}
        okButtonProps={{
          style: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
          },
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Title level={4} style={{ marginBottom: 24 }}>
            How many steps did you take today?
          </Title>
          <InputNumber
            min={0}
            max={100000}
            value={newSteps}
            onChange={(value) => setNewSteps(value || 0)}
            placeholder="Enter step count"
            style={{ width: "100%", height: 50, fontSize: 20 }}
            size="large"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
          />

          <Text type="secondary" style={{ display: "block", marginTop: 16 }}>
            This will calculate to approximately {Math.round(newSteps * 0.04)}{" "}
            calories burned
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default StepsGraphPage;
