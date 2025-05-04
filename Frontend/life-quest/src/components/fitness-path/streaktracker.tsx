"use client"
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StreakTracker = ({ streaks }) => {
  return (
    <Card title={<><FireOutlined /> Streak Tracker</>} variant="outlined">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card type="inner" title="Weight Logging" variant="outlined">
            <Statistic 
              value={streaks.weight} 
              suffix="days" 
              prefix={<FireOutlined style={{ color: streaks.weight > 5 ? '#ff4d4f' : '#faad14' }} />}
              valueStyle={{ color: streaks.weight > 5 ? '#ff4d4f' : '#faad14' }}
            />
            <Text type="secondary">Keep logging your weight daily!</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card type="inner" title="Step Goals" variant="outlined">
            <Statistic 
              value={streaks.steps} 
              suffix="days" 
              prefix={<FireOutlined style={{ color: streaks.steps > 5 ? '#ff4d4f' : '#faad14' }} />}
              valueStyle={{ color: streaks.steps > 5 ? '#ff4d4f' : '#faad14' }}
            />
            <Text type="secondary">Keep walking, you're crushing it!</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card type="inner" title="Activity Consistency" variant="outlined">
            <Statistic 
              value={streaks.activities} 
              suffix="days" 
              prefix={<FireOutlined style={{ color: streaks.activities > 5 ? '#ff4d4f' : '#faad14' }} />}
              valueStyle={{ color: streaks.activities > 5 ? '#ff4d4f' : '#faad14' }}
            />
            <Text type="secondary">Consistency pays off!</Text>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default StreakTracker;