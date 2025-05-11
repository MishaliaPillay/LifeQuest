'use client'

import { Card, Col, Row, Typography } from 'antd'

const { Title } = Typography

const days = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)

export default function WorkoutPlanPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>My 10-Day Workout Plan</Title>
      <Row gutter={[16, 16]}>
        {days.map((day) => (
          <Col xs={24} sm={12} md={8} lg={6} key={day}>
            <Card title={day} bordered style={{ height: '200px' }}>
              <p>📝 Description</p>
              <p>🏋️‍♀️ Activity</p>
              <p>🔥 Calories</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
