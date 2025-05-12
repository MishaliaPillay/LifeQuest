"use client"; 
import React, { useState, useEffect, useRef } from "react";
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
import { useUserActions, useUserState } from "@/providers/user-provider"; // Import the user context
import styles from "./sidebar.module.css";

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
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions(); // Hook to access the actions
  const hasFetched = useRef(false); // Ref to track if data has been fetched

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    if (token && !currentUser && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      getCurrentUser(token); // We don't need to track loading here
    }
  }, [currentUser, getCurrentUser]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getSelectedKey = () => pathname || "/dashboard";

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
            <Avatar className={styles.avatar}>{currentUser?.name[0]}</Avatar>
            <div className={styles.username}>{currentUser?.name}</div>
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
        <Avatar className={styles.avatar}>{currentUser?.name[0]}</Avatar>
        {!collapsed && <div className={styles.username}>{currentUser?.name}</div>}
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
