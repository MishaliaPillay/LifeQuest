"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, message, Spin } from "antd";
import { getId } from "../../../utils/decoder";
import { useAuthActions } from "../../../providers/auth-provider";
import { useFitnessPathActions } from "@/providers/fitnesspath/fitness-provider";
import { useActivityTypeActions } from "@/providers/fitnesspath/activity-provider";
import { IExercisePlanDay } from "@/providers/fitnesspath/activity-provider/context";

const { Title, Text } = Typography;

export default function WorkoutPlanPage() {
  const [userId, setUserId] = useState("");
  const [fitnessPathId, setFitnessPathId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exercisePlan, setExercisePlan] = useState<IExercisePlanDay[]>([]); // store workout plan days

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

        const fitnessPaths = await getFitnessPaths(person.id);
        const exercisePlanId = fitnessPaths.exercisePlans[0]?.id;

        if (fitnessPaths?.id) {
          setFitnessPathId(fitnessPaths.id);
        } else {
          message.warning("Fitness path not found.");
        }

        const planResponse = await getExercisePlan(exercisePlanId);
        setExercisePlan(planResponse); // store the result array
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // adjust as needed to center better vertically
          }}
        >
          <Spin tip="Loading workout plan..." size="large" />
        </div>
      ) : (
        <>
          <Text strong>User ID:</Text> <Text>{userId}</Text>
          <br />
          <Text strong>Fitness Path ID:</Text>{" "}
          <Text type={fitnessPathId ? "success" : "danger"}>
            {fitnessPathId ?? "Not assigned"}
          </Text>
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            {exercisePlan.map((day, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={day.id}>
                <Card
                  title={`Day ${index + 1}`}
                  bordered
                  style={{ height: "250px" }}
                >
                  <p>
                    📝 <strong>Description:</strong>{" "}
                    {day.description || "No description"}
                  </p>
                  <p>
                    🏋️‍♀️ <strong>Activity:</strong>{" "}
                    {day.activities?.[0]?.description || "No activity"}
                  </p>
                  <p>
                    🔥 <strong>Calories:</strong> {day.calories}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}
