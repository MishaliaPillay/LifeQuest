"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  TrophyOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import styles from "../fitness-path/sidebar.module.css";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  drawerOpen,
  setDrawerOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("cameFromExercisePlan"); // optional
    router.push("/auth-page");
  };

  const getSelectedKey = () => pathname || "/health-path";

  const menuItems: MenuProps["items"] = [
    {
      key: "/health-path",
      icon: <DashboardOutlined />,
      label: <Link href="/health-path">Dashboard</Link>,
    },
    {
      key: "/health-path/exercise-plan",
      icon: <BarChartOutlined />,
      label: <Link href="/health-path/exercise-plan">Meal Plan</Link>,
    },
    {
      key: "/health-path/weight",
      icon: <TrophyOutlined />,
      label: <Link href="/health-path/weight">Weight</Link>,
    },
    {
      key: "/health-path/profile",
      icon: <UserOutlined />,
      label: <Link href="/health-path/profile">Profile</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          className={styles.mobileButton}
        />
        <Drawer
          placement="left"
          closable
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={200}
          styles={{ body: { padding: 0 } }}
        >
          <div className={styles.drawerHeader}>
            <Avatar className={styles.avatar}>A</Avatar>
            <div className={styles.username}>Alex Chen</div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            className={styles.menu}
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
      width={200}
      collapsedWidth={80}
      className={styles.sidebar}
    >
      <div className={styles.avatarContainer}>
        <Avatar className={styles.avatar}>A</Avatar>
        {!collapsed && <div className={styles.username}>Alex Chen</div>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className={styles.menu}
      />
    </Sider>
  );
};

export default Sidebar;
