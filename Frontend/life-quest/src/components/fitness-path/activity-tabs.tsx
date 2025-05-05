import React from 'react';
import { Tabs, List, Tag, Typography, Space ,Card} from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Activity {
  id: number;
  type: string;
  date: string;
  duration: number;
  distance?: number;
  calories: number;
  xp: number;
}

interface Props {
  activities: Activity[];
}

const ActivityTabs: React.FC<Props> = ({ activities }) => {
  const activityTypes = ["Running", "Cycling", "Swimming", "Yoga", "Strength", "Other"];

  const items = [
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
    <Card title={<><ArrowUpOutlined /> Recent Activities</>} style={{ marginBottom: 20 }}>
      <Tabs items={items} />
    </Card>
  );
};

export default ActivityTabs;
