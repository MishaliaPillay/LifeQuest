"use client";

import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Spin } from 'antd';
import Sidebar from './sidebar';
import Header from './header';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  // Calculate content margin based on collapsed state and device type
  const getMarginLeft = () => {
    if (isMobile) return 0;
    return collapsed ? 80 : 200;
  };

  // Toggle drawer for mobile view
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          zIndex: 9999,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      
      <AntLayout
        className="site-layout"
        style={{ 
          marginLeft: getMarginLeft(), 
          transition: 'all 0.2s' 
        }}
      >
        <Header 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
        />
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#f5f5f5',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;