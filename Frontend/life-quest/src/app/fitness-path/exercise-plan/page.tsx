"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  message,
  Spin,
  Modal,
  Button,
  Progress,
  Badge,
  Tag,
  Divider,
  App,
} from "antd";
import {
  FireOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import { getId } from "../../../utils/decoder";
import { useAuthActions } from "../../../providers/auth-provider";
import { useFitnessPathActions } from "@/providers/fitnesspath/fitness-provider";
import { useActivityTypeActions } from "@/providers/fitnesspath/activity-provider";
import { useExercisePlanActions } from "@/providers/fitnesspath/exercise-plan";
import {
  IExercisePlanDay,
  IActivity,
} from "@/providers/fitnesspath/activity-provider/context";
import { launchConfetti } from "../../../utils/confetti"; // adjust path if needed

const { Title, Text, Paragraph } = Typography;

// Define workout category icons
const workoutCategories = {
  strength: "💪",
  cardio: "🏃‍♂️",
  flexibility: "🧘‍♀️",
  recovery: "🔄",
  hiit: "⚡",
};

// Extend the IExercisePlanDay interface with our UI properties
interface EnhancedExercisePlanDay extends IExercisePlanDay {
  difficulty: string;
  workoutType: keyof typeof workoutCategories;
  estimatedDuration: number;
}

export default function WorkoutPlanPage() {
  const [loading, setLoading] = useState(true);
  const [exercisePlan, setExercisePlan] = useState<EnhancedExercisePlanDay[]>(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDay, setSelectedDay] =
    useState<EnhancedExercisePlanDay | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completing, setCompleting] = useState(false);
  const { getExercisePlan, completeActivity } = useActivityTypeActions();
  const { getCurrentPerson } = useAuthActions();
  const { getFitnessPaths } = useFitnessPathActions();
  const [planId, setPlanId] = useState<string | null>(null);
  const [completingPlan, setCompletingPlan] = useState(false);
  const router = useRouter();
  const { completePlan } = useExercisePlanActions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          message.error("JWT not found");
          return;
        }

        const id = getId(token);

        const person = await getCurrentPerson(parseInt(id));
        if (!person?.id) {
          message.warning("Person not found for this user.");
          return;
        }

        const fitnessPaths = await getFitnessPaths(person.id);
        const exercisePlanId = fitnessPaths.exercisePlans[0]?.id;
        setPlanId(exercisePlanId);
        if (!fitnessPaths?.id) {
          message.warning("Fitness path not found.");
        }

        const planResponse = await getExercisePlan(exercisePlanId);

        const enhancedPlan = planResponse.map((day: IExercisePlanDay) => {
          let difficulty = "easy";
          if (day.calories > 400) difficulty = "medium";
          if (day.calories > 600) difficulty = "hard";
          if (day.calories > 800) difficulty = "intense";

          const workoutType = day.description?.toLowerCase().includes("cardio")
            ? ("cardio" as const)
            : day.description?.toLowerCase().includes("strength")
            ? ("strength" as const)
            : day.description?.toLowerCase().includes("flex")
            ? ("flexibility" as const)
            : day.description?.toLowerCase().includes("recovery")
            ? ("recovery" as const)
            : ("hiit" as const);

          const estimatedDuration = Math.round(day.calories / 10);

          return {
            ...day,
            difficulty,
            workoutType,
            estimatedDuration,
          } as EnhancedExercisePlanDay;
        });

        setExercisePlan(enhancedPlan);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load workout plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showDayDetails = (day: EnhancedExercisePlanDay) => {
    setSelectedDay(day);
    setIsModalVisible(true);
  };

  const completedCount = exercisePlan.filter((day) => day.isComplete).length;

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDay(null);
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    const colorMap: Record<string, string> = {
      easy: "green",
      medium: "blue",
      hard: "orange",
      intense: "red",
    };
    return colorMap[difficulty] || "blue";
  };
  const handleCompleteActivity = async (activityId: string) => {
    setCompleting(true);
    try {
      await completeActivity(activityId);

      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const id = getId(token);
      const person = await getCurrentPerson(parseInt(id));
      const fitnessPaths = await getFitnessPaths(person.id);
      const exercisePlanId = fitnessPaths.exercisePlans[0]?.id;
      const planResponse = await getExercisePlan(exercisePlanId);
     
      const updatedPlan = planResponse.map((day: IExercisePlanDay) => {
        let difficulty = "easy";
        if (day.calories > 400) difficulty = "medium";
        if (day.calories > 600) difficulty = "hard";
        if (day.calories > 800) difficulty = "intense";

        const workoutType = day.description?.toLowerCase().includes("cardio")
          ? "cardio"
          : day.description?.toLowerCase().includes("strength")
          ? "strength"
          : day.description?.toLowerCase().includes("flex")
          ? "flexibility"
          : day.description?.toLowerCase().includes("recovery")
          ? "recovery"
          : "hiit";

        const estimatedDuration = Math.round(day.calories / 10);

        return {
          ...day,
          difficulty,
          workoutType,
          estimatedDuration,
        } as EnhancedExercisePlanDay;
      });

      setExercisePlan(updatedPlan);
      setIsModalVisible(false); // Close modal first

      setTimeout(() => {
        messageApi.success("Workout marked as complete!");
        launchConfetti(); // Launch confetti *after* modal is closed
      }, 300); // Add slight delay for better UX
    } catch (error) {
      console.error(error);
      message.error("Failed to mark as complete.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <App>
      <div
        className="workout-plan-container"
        style={{ padding: "2rem", backgroundColor: "#f5f7fa" }}
      >
        {contextHolder}

        <div className="header-container" style={{ marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            My 10-Day Workout Plan
          </Title>
          <Paragraph type="secondary">
            Follow this personalized plan to reach your fitness goals
          </Paragraph>
        </div>

        {/* Progress indicator */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card variant="outlined" style={{ borderRadius: 8 }}>
              <Title level={4}>Your Progress</Title>
              <Progress
                percent={
                  exercisePlan.length > 0
                    ? Math.round((completedCount / exercisePlan.length) * 100)
                    : 0
                }
                status="active"
                style={{ marginBottom: 8 }}
              />

              <Text>
                {completedCount} of {exercisePlan.length} workouts completed
              </Text>
            </Card>
          </Col>
        </Row>

        {loading ? (
          <div
            className="loading-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {exercisePlan.map((day, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={day.id}>
                <Badge.Ribbon
                  text={day.isComplete ? "Completed" : `Day ${index + 1}`}
                  color={day.isComplete ? "green" : "#eb2f57"}
                >
                  <Card
                    hoverable
                    onClick={() => showDayDetails(day)}
                    style={{
                      height: 220,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                      backgroundColor: day.isComplete ? "#f6ffed" : "#fff",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontSize: 28,
                      }}
                    >
                      {workoutCategories[day.workoutType]}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <Tag color={getDifficultyColor(day.difficulty)}>
                        {day.difficulty.toUpperCase()}
                      </Tag>
                      <Tag icon={<ClockCircleOutlined />}>
                        {day.estimatedDuration} min
                      </Tag>
                      <Tag
                        style={{ backgroundColor: "#FAFA96" }}
                        icon={
                          <StarFilled
                            style={{ color: "#ff4d4f", marginRight: 8 }}
                          />
                        }
                      >
                        Xp: {day.xp}
                      </Tag>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 12, height: 44 }}
                    >
                      {day.description ||
                        "Focus on form and controlled movements"}
                    </Paragraph>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <FireOutlined
                        style={{ color: "#ff4d4f", marginRight: 8 }}
                      />
                      <span>{day.calories} calories</span>
                    </div>

                    {day.isComplete && (
                      <div
                        style={{ position: "absolute", bottom: 16, right: 16 }}
                      >
                        <CheckCircleOutlined
                          style={{ fontSize: 20, color: "#52c41a" }}
                        />
                      </div>
                    )}
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        )}
        {planId && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={completingPlan}
            onClick={async () => {
              setCompletingPlan(true);
              try {
                await completePlan(planId);
                sessionStorage.setItem("cameFromExercisePlan", "true");

                router.push("/new-page");
                message.success("Plan marked as complete!");
              } catch {
                message.error("Failed to complete plan.");
              } finally {
                setCompletingPlan(false);
              }
            }}
            style={{
              display:
                completedCount === exercisePlan.length ? "block" : "none", // Hide button if not all are completed
              marginTop: "20px", // Add bottom margin
            }}
          >
            Complete Plan
          </Button>
        )}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: selectedDay
                    ? getDifficultyColor(selectedDay.difficulty)
                    : "blue",
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 8,
                }}
              ></div>
              <span>
                Day{" "}
                {exercisePlan.findIndex((d) => d.id === selectedDay?.id) + 1}{" "}
                Workout
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
            !selectedDay?.isComplete && (
              <Button
                key="complete"
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={completing}
                onClick={() => handleCompleteActivity(selectedDay!.id)}
              >
                Mark Complete
              </Button>
            ),
          ]}
        >
          {selectedDay ? (
            <div className="workout-detail">
              <div
                className="workout-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                  backgroundColor: "#f9f9f9",
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <div style={{ marginRight: 16, fontSize: 24 }}>
                  {workoutCategories[selectedDay.workoutType]}
                </div>
                <div>
                  <div>
                    <Tag color={getDifficultyColor(selectedDay.difficulty)}>
                      {selectedDay.difficulty.toUpperCase()}
                    </Tag>
                    <Tag icon={<ClockCircleOutlined />}>
                      {selectedDay.estimatedDuration} min
                    </Tag>
                    <Tag icon={<FireOutlined />}>
                      {selectedDay.calories} calories
                    </Tag>
                  </div>
                  <Title level={4} style={{ margin: "8px 0" }}>
                    {selectedDay.workoutType.charAt(0).toUpperCase() +
                      selectedDay.workoutType.slice(1)}{" "}
                    Workout
                  </Title>
                </div>
              </div>

              <Divider orientation="left">Description</Divider>
              <Paragraph>
                {selectedDay.description ||
                  "Focus on proper form and controlled movements throughout this workout."}
              </Paragraph>

              <Divider orientation="left">Activities</Divider>
              {selectedDay.activities?.length > 0 ? (
                <ul className="activity-list" style={{ paddingLeft: 20 }}>
                  {selectedDay.activities.map((activity: IActivity, i) => (
                    <li key={i} style={{ marginBottom: 12 }}>
                      <Text strong>
                        {activity.description || `Exercise ${i + 1}`}
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Text type="secondary">
                    No specific activities defined for this day.
                  </Text>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Spin />
            </div>
          )}
        </Modal>

        <style jsx global>{`
          .workout-plan-container {
            min-height: 100vh;
          }
          @media (max-width: 768px) {
            .workout-plan-container {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    </App>
  );
}
