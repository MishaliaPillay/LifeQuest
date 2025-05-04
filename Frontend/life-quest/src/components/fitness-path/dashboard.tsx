"use client"

import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Statistic, 
  Avatar, 
  Badge, 
  Tabs, 
  List, 
  Tag, 
  Typography,
  Space
} from 'antd';
import { 
  FireOutlined, 
  TrophyOutlined, 
  ArrowUpOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  // Mock data - in real app these would come from API calls
  const [userData] = useState({
    name: "Alex Chen",
    level: 14,
    xp: 7500,
    xpToNextLevel: 10000,
    avatar: null,
    badges: ["Early Bird", "Marathon Runner", "Weight Goal Champion"],
    streaks: {
      weight: 8,
      steps: 12,
      activities: 5
    }
  });

  const [weightData] = useState([
    { date: '2025-04-01', weight: 83.2 },
    { date: '2025-04-08', weight: 82.5 },
    { date: '2025-04-15', weight: 81.9 },
    { date: '2025-04-22', weight: 81.4 },
    { date: '2025-04-29', weight: 80.8 },
    { date: '2025-05-01', weight: 80.3 },
  ]);

  const [stepData] = useState([
    { date: '2025-04-28', steps: 8923 },
    { date: '2025-04-29', steps: 10234 },
    { date: '2025-04-30', steps: 9541 },
    { date: '2025-05-01', steps: 11254 },
    { date: '2025-05-02', steps: 9876 },
    { date: '2025-05-03', steps: 12087 },
    { date: '2025-05-04', steps: 8543 },
  ]);

  const [activities] = useState([
    { id: 1, type: "Running", date: "2025-05-03", duration: 45, distance: 5.2, calories: 420, xp: 180 },
    { id: 2, type: "Yoga", date: "2025-05-02", duration: 60, calories: 240, xp: 120 },
    { id: 3, type: "Strength", date: "2025-05-01", duration: 50, calories: 380, xp: 150 },
    { id: 4, type: "Cycling", date: "2025-04-30", duration: 75, distance: 18.5, calories: 520, xp: 210 },
    { id: 5, type: "Running", date: "2025-04-29", duration: 30, distance: 3.5, calories: 280, xp: 100 },
    { id: 6, type: "Swimming", date: "2025-04-28", duration: 40, distance: 1.2, calories: 350, xp: 160 },
  ]);

  const activityTypes = ["Running", "Cycling", "Swimming", "Yoga", "Strength", "Other"];

  // Create tabs items array for the new Tabs API
  const activityTabItems = [
    {
      key: 'all',
      label: 'All Activities',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={activities}
          renderItem={item => (
            <List.Item
              actions={[
                <Tag color="blue" key="xp">{item.xp} XP</Tag>,
                <Tag color="green" key="cal">{item.calories} cal</Tag>
              ]}
            >
              <List.Item.Meta
                title={item.type}
                description={
                  <Space direction="vertical" size={0}>
                    <Text>{item.date} • {item.duration} minutes</Text>
                    {item.distance && <Text type="secondary">{item.distance} km</Text>}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    ...activityTypes.map(type => ({
      key: type,
      label: type,
      children: (
        <List
          itemLayout="horizontal"
          dataSource={activities.filter(a => a.type === type)}
          renderItem={item => (
            <List.Item
              actions={[
                <Tag color="blue" key="xp">{item.xp} XP</Tag>,
                <Tag color="green" key="cal">{item.calories} cal</Tag>
              ]}
            >
              <List.Item.Meta
                title={`${item.type} - ${item.date}`}
                description={
                  <Space direction="vertical" size={0}>
                    <Text>{item.duration} minutes</Text>
                    {item.distance && <Text type="secondary">{item.distance} km</Text>}
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: `No ${type.toLowerCase()} activities found` }}
        />
      )
    }))
  ];
  
  return (
    <div>
      {/* XP & Level Section */}
      <Card 
        variant="borderless"
        style={{ 
          background: 'linear-gradient(90deg, #ff6b98 0%, #ff9171 100%)', 
          color: 'white',
          marginBottom: 20
        }}
      >
        <Row gutter={24} align="middle">
          <Col xs={24} sm={4} md={3} style={{ textAlign: 'center' }}>
            <Badge count={userData.level} overflowCount={999}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#fff', color: '#1890ff' }}
              />
            </Badge>
          </Col>
          
          <Col xs={24} sm={16} md={18}>
            <Title level={4} style={{ color: 'white', marginBottom: 5 }}>{userData.name}</Title>
            <Text style={{ color: 'white', marginBottom: 10, display: 'block' }}>
              Level {userData.level} Fitness Warrior
            </Text>
            <Progress 
              percent={Math.round((userData.xp / userData.xpToNextLevel) * 100)} 
              status="active" 
              showInfo={false}
              strokeColor="#cb44b2"
              trailColor="rgba(255,255,255,0.3)"
            />
            <Text style={{ color: 'white' }}>
              {userData.xp.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP to Level {userData.level + 1}
            </Text>
          </Col>
          
          <Col xs={24} sm={4} md={3} style={{ textAlign: 'center' }}>
            <Statistic 
              title={<span style={{ color: 'white' }}>Total XP</span>} 
              value={userData.xp} 
              prefix={<TrophyOutlined />} 
              valueStyle={{ color: 'white' }}
            />
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Space size="small" wrap>
              {userData.badges.map((badge, index) => (
                <Tag key={index} color="purple" icon={<StarOutlined />}>
                  {badge}
                </Tag>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Streak Tracker Section */}
      <Card title={<><FireOutlined /> Streak Tracker</>} style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card type="inner" title="Weight Logging">
              <Statistic 
                value={userData.streaks.weight} 
                suffix="days" 
                prefix={<FireOutlined style={{ color: userData.streaks.weight > 5 ? '#ff4d4f' : '#faad14' }} />}
                valueStyle={{ color: userData.streaks.weight > 5 ? '#ff4d4f' : '#faad14' }}
              />
              <Text type="secondary">Keep logging your weight daily!</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card type="inner" title="Step Goals">
              <Statistic 
                value={userData.streaks.steps} 
                suffix="days" 
                prefix={<FireOutlined style={{ color: userData.streaks.steps > 5 ? '#ff4d4f' : '#faad14' }} />}
                valueStyle={{ color: userData.streaks.steps > 5 ? '#ff4d4f' : '#faad14' }}
              />
              <Text type="secondary">Keep walking, you're crushing it!</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card type="inner" title="Activity Consistency">
              <Statistic 
                value={userData.streaks.activities} 
                suffix="days" 
                prefix={<FireOutlined style={{ color: userData.streaks.activities > 5 ? '#ff4d4f' : '#faad14' }} />}
                valueStyle={{ color: userData.streaks.activities > 5 ? '#ff4d4f' : '#faad14' }}
              />
              <Text type="secondary">Consistency pays off!</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Activity Tabs Section */}
      <Card title={<><ArrowUpOutlined /> Recent Activities</>} style={{ marginBottom: 20 }}>
        <Tabs items={activityTabItems} />
      </Card>
    </div>
  );
};

export default DashboardPage;