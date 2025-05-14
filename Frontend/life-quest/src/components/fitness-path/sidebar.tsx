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
  MessageOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { useUserActions, useUserState } from "@/providers/user-provider";
import styles from "./sidebar.module.css";

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
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const hasFetched = useRef(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (token && !currentUser && !hasFetched.current) {
      hasFetched.current = true;
      getCurrentUser(token);
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

  const getSelectedKey = () => pathname || "/fitness-path";

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("cameFromExercisePlan");
    router.push("/auth-page");
  };

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
      key: "/fitness-path/chat-fit",
      icon: <MessageOutlined/>,
      label: <Link href="/fitness-path/chat-fit">Chat</Link>,
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
            <Avatar className={styles.avatar}>
              {currentUser?.name?.[0] || "U"}
            </Avatar>
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
        <Avatar className={styles.avatar}>
          {currentUser?.name?.[0] || "U"}
        </Avatar>
        {!collapsed && (
          <div className={styles.username}>{currentUser?.name}</div>
        )}
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
