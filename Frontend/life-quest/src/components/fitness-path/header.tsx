"use client";
import { Avatar } from 'antd';

import React from 'react';
import { Layout, Button, Dropdown, Space, Badge } from 'antd';
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  toggleDrawer?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile, 
  toggleDrawer 
}) => {
  const router = useRouter();

  const signOutUser = () => {
  
    router.push('/');
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link href="/profile">Profile</Link>,
    },
    {
      key: 'settings',
      label: <Link href="/settings">Settings</Link>,
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: signOutUser,
    },
  ];

  interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }
  
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Achievement',
      message: 'You earned the "Early Riser" badge!',
      time: '5 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'Streak Alert',
      message: 'keep going',
      time: '2 hours ago',
      read: true,
    },
  ];
  

  const notificationItems: MenuProps['items'] = notifications.map(notification => ({
    key: notification.id,
    label: (
      <div>
        <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
          {notification.title}
        </div>
        <div style={{ fontSize: '12px' }}>{notification.message}</div>
        <div style={{ fontSize: '10px', color: '#999' }}>{notification.time}</div>
      </div>
    ),
  }));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AntHeader
      style={{
        padding: '0 20px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => isMobile ? toggleDrawer?.() : setCollapsed(!collapsed)}
        style={{ fontSize: '16px' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
          <Badge count={unreadCount} size="small">
            <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
          </Badge>
        </Dropdown>
        
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar style={{ backgroundColor: '#1890ff' }}>
              <UserOutlined />
            </Avatar>
            <span className="hidden sm:inline">Alex Chen</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;