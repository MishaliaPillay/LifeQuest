"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Drawer, Button } from 'antd';
import { 
  DashboardOutlined, 
  TrophyOutlined, 
  FireOutlined, 
  UserOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

// Define the menu items for the sidebar
const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: '/activities',
    icon: <BarChartOutlined />,
    label: <Link href="/activities">Activities</Link>,
  },
  {
    key: '/achievements',
    icon: <TrophyOutlined />,
    label: <Link href="/achievements">Achievements</Link>,
  },
  {
    key: '/challenges',
    icon: <FireOutlined />,
    label: <Link href="/challenges">Challenges</Link>,
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: <Link href="/profile">Profile</Link>,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link href="/settings">Settings</Link>,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
    onClick: () => {
      // Handle logout logic here
      console.log('Logout clicked');
    },
  }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Handle window resize and check if it's mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getSelectedKey = () => {
    return pathname || '/dashboard';
  };

  // For mobile: show drawer and mobile trigger
  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 101,
          }}
        />
        <Drawer
          placement="left"
          closable={true}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={200}
          bodyStyle={{ padding: 0 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '16px 0',
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Avatar style={{ backgroundColor: '#1890ff' }}>A</Avatar>
            <div style={{ margin: '12px 0' }}>Alex Chen</div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
          />
        </Drawer>
      </>
    );
  }

  // Regular sidebar for desktop
  return (
    <Sider
  trigger={null}
  collapsible
  collapsed={collapsed}
  style={{
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'pink',  // 🌸 sidebar background
  }}
  width={200}
  collapsedWidth={80}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '16px 0',
      color: 'white',
    }}
  >
    <Avatar style={{ backgroundColor: '#fff', color: '#000' }}>A</Avatar>
    {!collapsed && <div style={{ margin: '12px 0', color: '#000' }}>Alex Chen</div>}
  </div>
  <Menu
    mode="inline"
    selectedKeys={[getSelectedKey()]}
    items={menuItems}
    style={{
      backgroundColor: 'pink',  // 🌸 menu background
    }}
  />
</Sider>

  );
};

export default Sidebar;