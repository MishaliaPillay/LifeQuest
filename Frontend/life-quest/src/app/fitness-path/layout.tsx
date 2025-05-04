"use client";

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../components/fitness-path/sidebar'; // Import your Sidebar component
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
  <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
  
  <Layout
    style={{ 
      marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
      transition: 'margin-left 0.2s',
    }}
  >
    <Header
      style={{ 
        position: 'fixed',
        top: 0,
        left: isMobile ? 0 : (collapsed ? 80 : 200),
        right: 0,
        zIndex: 1000,
        padding: '0 16px',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        height: 64,
        width: `calc(100% - ${isMobile ? 0 : (collapsed ? 80 : 200)}px)`,
        transition: 'left 0.2s, width 0.2s',
      }}
    >
      {React.createElement(
        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, 
        {
          onClick: () => setCollapsed(!collapsed),
          style: { fontSize: '18px', cursor: 'pointer' }
        }
      )}
      <div style={{ marginLeft: '16px', fontSize: '18px' }}>
        FitTracker Pro
      </div>
    </Header>

    <Content
      style={{ 
        margin: '88px 16px 24px',  // notice: top margin increased to account for fixed header (64px + extra)
        padding: 24, 
        background: '#fff',
        borderRadius: '4px',
        minHeight: 280,
      }}
    >
      {children}
    </Content>
  </Layout>
</Layout>

  );
};

export default AppLayout;