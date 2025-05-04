"use client"
import React from 'react';
import { Card, Row, Col, Progress, Avatar, Badge, Space, Tag, Typography, Statistic } from 'antd';
import { UserOutlined, TrophyOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserProfile = ({ userData }) => {
  return (
    <Card 
      variant="borderless"
      style={{ 
        background: 'linear-gradient(90deg, #ff6b98 0%, #ff9171 100%)', 
        color: 'white',
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
  );
};

export default UserProfile;