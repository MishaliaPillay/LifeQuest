"use client";
import React, { useEffect, useState, useRef } from "react";
import { Spin, message } from "antd";
import { useUserState, useUserActions } from "@/providers/user-provider";
import { useAuthActions } from "@/providers/auth-provider";
import { getId } from "@/utils/decoder";
import withAuth from "../../hoc/withAuth";
import styles from "./userDashboard.module.css";
import StepBasedFitnessPlanner from "./step";

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const { getCurrentPerson } = useAuthActions();

  const [loading, setLoading] = useState(true);
  const [personId, setPersonId] = useState<string>("");
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUserAndPerson = async () => {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        message.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        await getCurrentUser(token);
      } catch (error) {
        console.error("Error fetching current user:", error);
        message.error("Failed to load user data.");
        setLoading(false);
        return;
      }

      const userId = getId(token);
      if (!userId || userId === "1") {
        message.error("Invalid user ID.");
        setLoading(false);
        return;
      }

      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        message.error("Invalid user ID format.");
        setLoading(false);
        return;
      }

      try {
        const personData = await getCurrentPerson(userIdNum);
        if (personData?.id) {
          setPersonId(personData.id);
        } else {
          message.warning("Person ID not found.");
        }
      } catch (error) {
        console.error("Error fetching person data:", error);
        message.error("Failed to fetch person data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPerson();
  }, [getCurrentUser, getCurrentPerson]);

  if (loading || !currentUser?.name) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div className={styles.loadingContent}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <StepBasedFitnessPlanner personId={personId} />
    </div>
  );
};

export default withAuth(UserDashboard);