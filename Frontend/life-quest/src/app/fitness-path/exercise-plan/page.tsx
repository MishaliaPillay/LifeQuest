"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, message, Spin } from "antd";
import { getId } from "../../../utils/decoder";
import { useAuthActions } from "../../../providers/auth-provider";
import { useFitnessPathActions } from "@/providers/fitnesspath/fitness-provider";
import { useActivityTypeActions } from "@/providers/fitnesspath/activity-provider";
const { Title, Text } = Typography;
const days = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);

export default function WorkoutPlanPage() {
  const [userId, setUserId] = useState("");
  const [fitnessPathId, setFitnessPathId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getExercisePlan } = useActivityTypeActions();
  const { getCurrentPerson } = useAuthActions();
  const { getFitnessPaths } = useFitnessPathActions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          message.error("JWT not found");
          return;
        }

        const id = getId(token); // user ID
        setUserId(id);

        const person = await getCurrentPerson(parseInt(id));
        if (!person?.id) {
          message.warning("Person not found for this user.");
          return;
        }
        console.log("pers", person);
        const fitnessPaths = await getFitnessPaths(person.id);

        const exercisePlanId = fitnessPaths.exercisePlans[0]?.id;
        console.log("Exercise Plan ID:", exercisePlanId);
        console.log(fitnessPaths.exercisePlans[0]);
        if (fitnessPaths?.id) {
          setFitnessPathId(fitnessPaths.id);
        } else {
          message.warning("Fitness path not found.");
        }

        const exercisePlan = await getExercisePlan(exercisePlanId);

        console.log("wsddfg", exercisePlan);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load workout plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>My 10-Day Workout Plan</Title>

      {loading ? (
        <Spin tip="Loading user info..." />
      ) : (
        <>
          <Text strong>User ID:</Text> <Text>{userId}</Text>
          <br />
          <Text strong>Fitness Path ID:</Text>{" "}
          <Text type={fitnessPathId ? "success" : "danger"}>
            {fitnessPathId ?? "Not assigned"}
          </Text>
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {days.map((day) => (
              <Col xs={24} sm={12} md={8} lg={6} key={day}>
                <Card title={day} bordered style={{ height: "200px" }}>
                  <p>📝 Description</p>
                  <p>🏋️‍♀️ Activity</p>
                  <p>🔥 Calories</p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}
