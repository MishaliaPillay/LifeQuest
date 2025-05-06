"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input, Button, Card, Spin, message, Modal, InputNumber, Statistic, Row, Col, Progress, Typography } from "antd";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend,
  TooltipProps
} from "recharts";
import { 
  PlusOutlined, ReloadOutlined, TrophyOutlined,
  FireOutlined, CalendarOutlined, ArrowUpOutlined
} from '@ant-design/icons';
import { useWeightActions, useWeightState } from "../../../providers/fitnesspath/weight-provider/index";
import { useAuthState, useAuthActions } from "../../../providers/auth-provider";
import { getId } from "../../../utils/decoder";

const { Title, Text } = Typography;

const WeightGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(0);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeChartType, setActiveChartType] = useState<'area' | 'line' | 'bar'>('area');

  const { getWeights, createWeight, updateWeight } = useWeightActions();
  const { weights } = useWeightState();
  // Get auth state and actions
  const { Auth } = useAuthState();
  const { getCurrentPerson } = useAuthActions();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingAuth(true);
        const accessToken = sessionStorage.getItem("jwt");
        
        if (accessToken) {
          const userId = getId(accessToken);
          
          if (userId && userId !== "1") {
            const userIdNum = parseInt(userId, 10);
            
            if (!isNaN(userIdNum)) {
              try {
                const response = await getCurrentPerson(userIdNum);
                if (response && response.id) {
                  setPersonId(response.id);
                  handleFetchWeight(response.id);
                  message.success("User authenticated successfully");
                } else {
                  message.warning("Person ID not found in response");
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

  const handleFetchWeight = async (id = personId) => {
    if (!id) {
      message.warning("Please enter a person ID");
      return;
    }
    setLoading(true);
    try {
      await getWeights(id);
      message.success("Weight data loaded!");
    } catch (error) {
      console.error(error);
      message.error("Failed to load weight data");
    }
    setLoading(false);
  };

  const handleAddOrUpdateToday = async () => {
    if (!personId) {
      message.warning("Please enter a person ID first");
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existingToday = weights.find(
      (entry) => new Date(entry.date).toISOString().split("T")[0] === todayDate
    );

    const payload = {
      id: existingToday ? existingToday.id : undefined,
      personId,
      date: todayDate,
      weight: newWeight,
      note: "Updated via app",
    };

    try {
      if (existingToday) {
        await updateWeight(payload);
        message.success("Today's weight entry updated!");
      } else {
        await createWeight(payload);
        message.success("Today's weight entry created!");
      }
      await getWeights(personId);
    } catch (error) {
      console.error(error);
      message.error("Failed to add/update today's weight");
    }

    setAdding(false);
    setNewWeight(0);
  };

  const stats = useMemo(() => {
    if (!weights.length) return {
      weeklyAverage: 0,
      todayWeight: 0,
      totalWeightChange: 0,
      weeklyProgress: 0,
      bestWeight: { date: '', weight: 0 }
    };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const last7DaysWeight = weights.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });

    const weeklyAverage = last7DaysWeight.length > 0
      ? Math.round(last7DaysWeight.reduce((sum, entry) => sum + entry.weight, 0) / last7DaysWeight.length)
      : 0;

    const todayEntry = weights.find(
      (entry) => new Date(entry.date).toISOString().split('T')[0] === todayStr
    );

    const totalWeightChange = weights.reduce((sum, entry, index) => {
      if (index === 0) return sum;
      return sum + (entry.weight - weights[index - 1].weight);
    }, 0);

    const weeklyProgress = Math.min(100, Math.round((weeklyAverage / 70) * 100)); // Example: target weight 70 kg

    const sortedWeight = [...weights].sort((a, b) => b.weight - a.weight);
    const bestWeight = sortedWeight.length > 0
      ? { date: new Date(sortedWeight[0].date).toLocaleDateString(), weight: sortedWeight[0].weight }
      : { date: '', weight: 0 };

    return {
      weeklyAverage,
      todayWeight: todayEntry ? todayEntry.weight : 0,
      totalWeightChange,
      weeklyProgress,
      bestWeight
    };
  }, [weights]);

  const chartData = useMemo(() => {
    return weights.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [weights]);

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>{`Date: ${label}`}</p>
          <p style={{ margin: '5px 0', color: '#52c41a' }}>{`Weight: ${payload[0].value?.toLocaleString()} kg`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto", background: 'linear-gradient(to bottom, #f0f8ff, #ffffff)' }}>
      <Card
        title={
          <Title level={2} style={{ margin: 0 }}>
            <span style={{ marginRight: 10 }}>⚖️</span>
            Weight Tracker Dashboard
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
            backgroundColor: "#1890ff",
            color: "#fff",
            padding: "16px 24px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <Input
                placeholder="Person ID (Auto-detected from login)"
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                style={{ width: 300, marginRight: 16, borderRadius: 8, height: 40 }}
                disabled={!!Auth?.id || loadingAuth}
              />
              <Button 
                type="primary" 
                onClick={() => handleFetchWeight()} 
                loading={loading} 
                icon={<ReloadOutlined />} 
                size="large"
                disabled={loadingAuth}
              >
                Load Weight Data
              </Button>
            </div>

            <div>
              <Title level={4}>Weight Statistics</Title>
              <Row gutter={24}>
                <Col span={8}>
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <Statistic
                      title="Weekly Average"
                      value={stats.weeklyAverage}
                      suffix="kg"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <Statistic
                      title="Today's Weight"
                      value={stats.todayWeight}
                      suffix="kg"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <Statistic
                      title="Total Weight Change"
                      value={stats.totalWeightChange}
                      suffix="kg"
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Weekly Progress</Title>
              <Progress
                percent={stats.weeklyProgress}
                status={stats.weeklyProgress > 100 ? 'exception' : 'normal'}
                strokeColor="#1890ff"
                style={{ marginBottom: 24 }}
              />
            </div>

            <div>
              <Title level={4}>Best Weight</Title>
              {stats.bestWeight.weight > 0 ? (
                <Text strong>
                  Your best weight was {stats.bestWeight.weight} kg on {stats.bestWeight.date}.
                </Text>
              ) : (
                <Text>No weight data recorded yet</Text>
              )}
            </div>
          </Col>

          <Col xs={24} md={6}>
            <Card>
            <InputNumber
  value={newWeight}
  onChange={(value: number | string | undefined) => {
    if (typeof value === "number") {
      setNewWeight(value);
    }
  }}
  style={{ width: '100%' }}
  min={10}
  max={200}
  step={0.1}
  precision={1}
  placeholder="Enter new weight"
/>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                loading={adding}
                onClick={handleAddOrUpdateToday}
                block
                style={{ marginTop: 16 }}
              >
                {weights.find(entry => entry.date === new Date().toISOString().split("T")[0]) ? 'Update Weight' : 'Add Weight'}
              </Button>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 32 }}>
          <Title level={4}>Weight Trend</Title>
          <ResponsiveContainer width="100%" height={400}>
            {activeChartType === 'area' ? (
              <AreaChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="weight" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            ) : activeChartType === 'line' ? (
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="weight" fill="#8884d8" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default WeightGraphPage;
