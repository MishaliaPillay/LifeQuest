"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input, Button, Card, message, InputNumber, Statistic, Row, Col, Progress, Typography, Segmented, Spin, Avatar, Badge } from "antd";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  TooltipProps
} from "recharts";
import { 
  PlusOutlined, ReloadOutlined, AreaChartOutlined, LineChartOutlined, 
  BarChartOutlined, TrophyOutlined, ArrowUpOutlined, ArrowDownOutlined,
  DashboardOutlined, UserOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useWeightActions, useWeightState } from "../../../providers/fitnesspath/weight-provider/index";
import { useAuthState, useAuthActions } from "../../../providers/auth-provider";
import { getId } from "../../../utils/decoder";

const { Title, Text, Paragraph } = Typography;

const WeightGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(0);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeChartType, setActiveChartType] = useState<'area' | 'line' | 'bar'>('area');

  const { getWeights, createWeight, updateWeight } = useWeightActions();
  const { weights } = useWeightState();
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

    if (!newWeight) {
      message.warning("Please enter a weight value");
      return;
    }

    setAdding(true);
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
      bestWeight: { date: '', weight: 0 },
      weightTrend: 'neutral'
    };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const sortedWeights = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const last7DaysWeight = weights.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });

    const weeklyAverage = last7DaysWeight.length > 0
      ? parseFloat((last7DaysWeight.reduce((sum, entry) => sum + entry.weight, 0) / last7DaysWeight.length).toFixed(1))
      : 0;

    const todayEntry = weights.find(
      (entry) => new Date(entry.date).toISOString().split('T')[0] === todayStr
    );

    // Calculate total change from first to last entry
    const firstWeight = sortedWeights[0]?.weight || 0;
    const lastWeight = sortedWeights[sortedWeights.length - 1]?.weight || 0;
    const totalWeightChange = parseFloat((lastWeight - firstWeight).toFixed(1));

    // Calculate weekly progress as percentage of goal
    // Assuming goal is to maintain weight within 2% of target (70kg example)
    const targetWeight = 70;
    const idealRange = targetWeight * 0.02;
    const weeklyProgress = Math.min(100, Math.max(0, 100 - Math.abs(weeklyAverage - targetWeight) / idealRange * 100));

    // Find lowest recorded weight
    const lowestWeightEntry = [...weights].sort((a, b) => a.weight - b.weight)[0];
    const bestWeight = lowestWeightEntry
      ? { 
          date: new Date(lowestWeightEntry.date).toLocaleDateString(), 
          weight: lowestWeightEntry.weight 
        }
      : { date: '', weight: 0 };

    // Determine weight trend
    let weightTrend = 'neutral';
    if (sortedWeights.length >= 2) {
      const recentEntries = sortedWeights.slice(-2);
      if (recentEntries[1].weight < recentEntries[0].weight) {
        weightTrend = 'down';
      } else if (recentEntries[1].weight > recentEntries[0].weight) {
        weightTrend = 'up';
      }
    }

    return {
      weeklyAverage,
      todayWeight: todayEntry ? todayEntry.weight : 0,
      totalWeightChange,
      weeklyProgress,
      bestWeight,
      weightTrend
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
            padding: '16px',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <p className="label" style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{`Date: ${label}`}</p>
          <p style={{ margin: '8px 0', color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>{`${payload[0].value?.toLocaleString()} kg`}</p>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = () => {
    if (stats.weightTrend === 'down') {
      return <ArrowDownOutlined style={{ color: '#52c41a' }} />;
    } else if (stats.weightTrend === 'up') {
      return <ArrowUpOutlined style={{ color: '#ff4d4f' }} />;
    }
    return null;
  };

  return (
    <div style={{ 
      padding: 24, 
      maxWidth: 1400, 
      margin: "0 auto", 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
      minHeight: '100vh'
    }}>
      {loadingAuth ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Spin size="large" tip="Loading user data..." />
        </div>
      ) : (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                size={54} 
                style={{ 
                  backgroundColor: '#1890ff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}
              >
                <DashboardOutlined style={{ fontSize: 28, color: 'white' }} />
              </Avatar>
              <div>
                <Title level={2} style={{ margin: 0, color: '#fff' }}>
                  Weight Tracker Dashboard
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  Track and monitor your weight progress
                </Text>
              </div>
            </div>
          }
          bordered={false}
          style={{
            borderRadius: 20,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
          styles={{
            header: {
              background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)',
              color: "#fff",
              padding: "24px",
              borderBottom: "none",
            },
            body: {
              padding: "24px",
            },
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: 16, 
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  marginBottom: 24
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: '#1890ff', marginRight: 12 }}
                    />
                    <Input
                      placeholder="Person ID (Auto-detected from login)"
                      value={personId}
                      onChange={(e) => setPersonId(e.target.value)}
                      style={{ width: 250, borderRadius: 8 }}
                      disabled={!!Auth?.id}
                      prefix={<Badge status="processing" style={{ marginRight: 8 }} />}
                    />
                  </div>
                  <Button 
                    type="primary" 
                    onClick={() => handleFetchWeight()} 
                    loading={loading} 
                    icon={<ReloadOutlined />}
                    size="middle"
                    style={{ borderRadius: 8 }}
                  >
                    Refresh Data
                  </Button>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Title level={4} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ marginRight: 8 }} /> Weight Trends
                  </Title>
                  
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Segmented
                      options={[
                        { label: 'Area', value: 'area', icon: <AreaChartOutlined /> },
                        { label: 'Line', value: 'line', icon: <LineChartOutlined /> },
                        { label: 'Bar', value: 'bar', icon: <BarChartOutlined /> },
                      ]}
                      value={activeChartType}
                      onChange={(value) => setActiveChartType(value as 'area' | 'line' | 'bar')}
                    />
                  </div>
                  
                  <div style={{ 
                    height: 400, 
                    backgroundColor: '#f9fafc', 
                    borderRadius: 12, 
                    padding: 16,
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        {activeChartType === 'area' ? (
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tickLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Area 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#1890ff" 
                              strokeWidth={3}
                              fill="url(#colorWeight)" 
                              activeDot={{ r: 8 }}
                            />
                          </AreaChart>
                        ) : activeChartType === 'line' ? (
                          <LineChart data={chartData}>
                            <XAxis dataKey="date" tickLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Line 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#52c41a" 
                              strokeWidth={3}
                              dot={{ r: 4 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        ) : (
                          <BarChart data={chartData}>
                            <XAxis dataKey="date" tickLine={false} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Bar 
                              dataKey="weight" 
                              fill="#722ed1" 
                              radius={[4, 4, 0, 0]}
                              barSize={30}
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ 
                        height: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        flexDirection: 'column'
                      }}>
                        <AreaChartOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                        <Text type="secondary">No weight data available yet</Text>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card 
                    bordered={false} 
                    style={{ 
                      borderRadius: 16, 
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      height: '100%'
                    }}
                  >
                    <Statistic
                      title={<Text strong style={{ fontSize: 16 }}>Weekly Average</Text>}
                      value={stats.weeklyAverage}
                      suffix="kg"
                      precision={1}
                      valueStyle={{ color: '#1890ff', fontSize: 28 }}
                      prefix={<Badge status="processing" style={{ marginRight: 8 }} />}
                    />
                    <Paragraph type="secondary" style={{ marginTop: 8 }}>
                      Average weight over last 7 days
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    bordered={false} 
                    style={{ 
                      borderRadius: 16, 
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      height: '100%'
                    }}
                  >
                    <Statistic
                      title={<Text strong style={{ fontSize: 16 }}>Today's Weight</Text>}
                      value={stats.todayWeight}
                      suffix="kg"
                      precision={1}
                      valueStyle={{ 
                        color: stats.todayWeight ? (
                          stats.weightTrend === 'down' ? '#52c41a' : 
                          stats.weightTrend === 'up' ? '#ff4d4f' : 
                          '#1890ff'
                        ) : '#1890ff',
                        fontSize: 28
                      }}
                      prefix={getTrendIcon()}
                    />
                    <Paragraph type="secondary" style={{ marginTop: 8 }}>
                      {stats.todayWeight ? 'Recorded for today' : 'Not recorded yet'}
                    </Paragraph>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    bordered={false} 
                    style={{ 
                      borderRadius: 16, 
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      height: '100%'
                    }}
                  >
                    <Statistic
                      title={<Text strong style={{ fontSize: 16 }}>Total Change</Text>}
                      value={stats.totalWeightChange}
                      suffix="kg"
                      precision={1}
                      valueStyle={{ 
                        color: stats.totalWeightChange < 0 ? '#52c41a' : 
                               stats.totalWeightChange > 0 ? '#ff4d4f' : 
                               '#1890ff',
                        fontSize: 28
                      }}
                      prefix={
                        stats.totalWeightChange < 0 ? <ArrowDownOutlined /> :
                        stats.totalWeightChange > 0 ? <ArrowUpOutlined /> :
                        null
                      }
                    />
                    <Paragraph type="secondary" style={{ marginTop: 8 }}>
                      Overall weight change since start
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={8}>
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: 16, 
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  marginBottom: 24
                }}
              >
                <Title level={4} style={{ marginBottom: 16 }}>Record Today's Weight</Title>
                <div style={{ 
                  backgroundColor: '#f0f7ff', 
                  padding: 16, 
                  borderRadius: 12,
                  marginBottom: 16
                }}>
                  <Text>Enter your current weight:</Text>
                  <InputNumber
                    value={newWeight}
                    onChange={(value: number | string | undefined) => {
                      if (typeof value === "number") {
                        setNewWeight(value);
                      }
                    }}
                    style={{ width: '100%', marginTop: 12, height: 50, fontSize: 18 }}
                    min={10}
                    max={200}
                    step={0.1}
                    precision={1}
                    placeholder="Enter new weight"
                    size="large"
                    addonAfter="kg"
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    loading={adding}
                    onClick={handleAddOrUpdateToday}
                    block
                    style={{ 
                      marginTop: 16, 
                      height: 50, 
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 500
                    }}
                  >
                    {weights.find(entry => entry.date === new Date().toISOString().split("T")[0]) ? 'Update Today\'s Weight' : 'Add Today\'s Weight'}
                  </Button>
                </div>
                
                <Title level={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} /> Progress Summary
                </Title>
                
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Weekly Goal Progress</Text>
                    <Text strong>{Math.round(stats.weeklyProgress)}%</Text>
                  </div>
                  <Progress 
                    percent={stats.weeklyProgress} 
                    status={stats.weeklyProgress > 100 ? 'exception' : 'normal'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    strokeWidth={10}
                    showInfo={false}
                  />
                </div>

                {stats.bestWeight.weight > 0 && (
                  <Card
                    style={{ 
                      backgroundColor: '#f6ffed', 
                      marginBottom: 16,
                      borderRadius: 12,
                      border: '1px solid #b7eb8f'
                    }}
                    bodyStyle={{ padding: 16 }}
                    bordered={false}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        icon={<TrophyOutlined />} 
                        style={{ backgroundColor: '#52c41a', marginRight: 12 }}
                      />
                      <div>
                        <Text strong style={{ display: 'block' }}>
                          Best Weight: {stats.bestWeight.weight} kg
                        </Text>
                        <Text type="secondary">
                          Achieved on {stats.bestWeight.date}
                        </Text>
                      </div>
                    </div>
                  </Card>
                )}
                
                <Card
                  title="Tips for Success"
                  style={{ 
                    marginTop: 24,
                    borderRadius: 12,
                    border: '1px solid #e9e9e9'
                  }}
                  headStyle={{ borderBottom: '1px solid #e9e9e9' }}
                  bodyStyle={{ padding: 16 }}
                  bordered={false}
                  size="small"
                >
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li><Text>Weigh yourself at the same time each day</Text></li>
                    <li><Text>Focus on weekly averages, not daily fluctuations</Text></li>
                    <li><Text>Track your nutrition alongside weight</Text></li>
                    <li><Text>Set realistic goals for sustainable progress</Text></li>
                  </ul>
                </Card>
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default WeightGraphPage;