"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  TrophyOutlined,
  FireOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const menuItems: MenuProps["items"] = [
  {
    key: "/fitness-path",
    icon: <DashboardOutlined />,
    label: <Link href="/fitness-path">Dashboard</Link>,
  },
  {
    key: "/fitness-path/exercise-plan",
    icon: <BarChartOutlined />,
    label: <Link href="/fitness-path/exercise-plan">Exercise Plan</Link>,
  },
  {
    key: "/fitness-path/weight",
    icon: <TrophyOutlined />,
    label: <Link href="/fitness-path/weight">Weight</Link>,
  },
  {
    key: "/fitness-path/steps",
    icon: <FireOutlined />,
    label: <Link href="/fitness-path/steps">Steps</Link>,
  },
  {
    key: "/fitness-path/profile",
    icon: <UserOutlined />,
    label: <Link href="/fitness-path/profile">Profile</Link>,
  },

  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    onClick: () => {},
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  drawerOpen,
  setDrawerOpen,
}) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getSelectedKey = () => {
    return pathname || "/dashboard";
  };

  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 101,
          }}
        />
        <Drawer
          placement="left"
          closable
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={200}
          styles={{
            body: { padding: 0 },
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "16px 0",
              padding: "16px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Avatar style={{ backgroundColor: "#1890ff" }}>A</Avatar>
            <div style={{ margin: "12px 0" }}>Alex Chen</div>
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "pink",
      }}
      width={200}
      collapsedWidth={80}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "16px 0",
          color: "white",
        }}
      >
        <Avatar style={{ backgroundColor: "#fff", color: "#000" }}>A</Avatar>
        {!collapsed && (
          <div style={{ margin: "12px 0", color: "#000" }}>Alex Chen</div>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          backgroundColor: "pink",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
