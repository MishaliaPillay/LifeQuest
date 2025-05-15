"use client";
import { useEffect, useState } from "react";
import {
  message,
  Spin,
  Card,
  Modal,
  Button,
  Progress,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
  Badge,
} from "antd";
import { CheckCircleOutlined, FireOutlined } from "@ant-design/icons";
import { useAuthActions } from "../../../providers/auth-provider";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";
import { useMealPlanActions } from "@/providers/health-path-provider/meal-plan";
import { useMealActions } from "@/providers/health-path-provider/meal-provider";
import { getId } from "../../../utils/decoder";
import { useRouter } from "next/navigation";
import { launchConfetti } from "../../../utils/confetti";
import { IMeal } from "@/providers/health-path-provider/meal-plan/context";
import { IHealthPath } from "@/providers/health-path-provider/health-provider/context";

const { Title, Text } = Typography;

interface IMealPlanDay {
  order: number;
  description?: string;
  meals: IMeal[];
  score: number;
}

export default function MealPlanPage() {
  const [loading, setLoading] = useState(true);
  const [healthPath, setHealthPath] = useState<IHealthPath | null>(null);
  const [mealPlanDays, setMealPlanDays] = useState<IMealPlanDay[]>([]);
  const [mealPlanId, setMealPlanId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const { getCurrentPerson } = useAuthActions();
  const { getHealthPath, getHealthPaths } = useHealthPathActions();
  const { getMealPlanDaysByPlanId, completePlan } = useMealPlanActions();
  const { completeMeal } = useMealActions();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          message.error("JWT not found");
          return;
        }

        const id = getId(token);
        const person = await getCurrentPerson(parseInt(id));
        if (!person?.id) {
          message.warning("Person not found.");
          return;
        }

        const healthPath = await getHealthPath(person.id);
        const fullPath = await getHealthPaths(healthPath.id);

        setHealthPath(fullPath);

        const planId = fullPath.mealPlans?.[0]?.id;
        if (!planId) {
          message.warning("No meal plan found.");
          return;
        }

        setMealPlanId(planId);
        const mealsResponse = await getMealPlanDaysByPlanId(planId);
        setMealPlanDays(mealsResponse?.result ?? []);
      } catch (err) {
        message.error("Failed to load health path.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompleteMeal = async (
    mealId: string,
    closeModal: boolean = false
  ) => {
    if (!mealId) return;

    if (closeModal) {
      setModalLoading(true);
    } else {
      setCompleting(true);
    }

    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) throw new Error("JWT not found");
      const id = getId(token);
      const person = await getCurrentPerson(parseInt(id));

      await completeMeal(mealId, person.id);
      setTimeout(() => {
        messageApi.success("Meal marked as complete!");
        launchConfetti(); // Launch confetti *after* modal is closed
      }, 300);

      // Refresh meals
      if (mealPlanId) {
        const mealsResponse = await getMealPlanDaysByPlanId(mealPlanId);
        setMealPlanDays(mealsResponse?.result ?? []);
      }

      // Close modal if triggered from modal
      if (closeModal) {
        setSelectedMeal(null);
      }
    } catch (err) {
      message.error("Failed to mark meal as complete.", err);
    } finally {
      if (closeModal) {
        setModalLoading(false);
      } else {
        setCompleting(false);
      }
    }
  };

  const handleCompleteMealPlan = async (): Promise<void> => {
    if (!mealPlanId) {
      message.error("Meal plan ID is missing.");
      return;
    }
    setCompleting(true);

    try {
      await completePlan(mealPlanId);
      message.success("Meal plan completed!");
      launchConfetti();
      sessionStorage.setItem("cameFromExercisePlan", "true");
      router.push("/new-page");
    } catch (err) {
      message.error("Failed to complete meal plan.", err);
    } finally {
      setCompleting(false);
    }
  };

  const completedMeals = mealPlanDays.reduce(
    (acc, day) => acc + day.meals.filter((m) => m.isComplete).length,
    0
  );
  const totalMeals = mealPlanDays.reduce(
    (acc, day) => acc + day.meals.length,
    0
  );
  const progress = totalMeals ? (completedMeals / totalMeals) * 100 : 0;

  return (
    <div style={{ padding: "2rem" }}>
      {" "}
      {contextHolder}
      {loading ? (
        <Spin
          tip="Loading meal plan..."
          size="large"
          style={{ display: "block", margin: "auto" }}
        />
      ) : (
        <>
          <Title level={2}>Your Meal Plan</Title>
          {healthPath && <Text type="secondary">{healthPath.description}</Text>}
          <Divider />
          <Progress percent={progress} status="active" />

          <Row gutter={[16, 16]} style={{ marginTop: "2rem" }}>
            {mealPlanDays.map((day, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`Day ${day.order + 1}`}
                  bordered
                  hoverable
                  onClick={() => setSelectedMeal(day.meals[0])}
                >
                  <Text>
                    <FireOutlined /> Calories:{" "}
                    {day.meals.reduce((acc, m) => acc + m.calories, 0)}
                  </Text>
                  <br />
                  <Text>
                    <CheckCircleOutlined /> Completed:{" "}
                    {day.meals.filter((m) => m.isComplete).length} /{" "}
                    {day.meals.length}
                  </Text>
                  <Divider />
                  {day.meals.map((meal, i) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                      <Badge.Ribbon
                        text={meal.isComplete ? "Done" : "Pending"}
                        color={meal.isComplete ? "green" : "red"}
                      >
                        <Card size="small" bordered={false}>
                          <Text strong>{meal.name}</Text>
                          <br />
                          <Text type="secondary">{meal.description}</Text>
                          <br />
                          <Tag color="orange">{meal.calories} cal</Tag>
                          <div style={{ marginTop: "0.5rem" }}>
                            <Button
                              size="small"
                              type="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteMeal(meal.id);
                              }}
                              disabled={meal.isComplete}
                            >
                              Complete Meal
                            </Button>
                          </div>
                        </Card>
                      </Badge.Ribbon>
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>

          {mealPlanId && (
            <Button
              type="primary"
              loading={completing}
              style={{ marginTop: "2rem" }}
              onClick={handleCompleteMealPlan}
            >
              Complete Entire Meal Plan
            </Button>
          )}

          <Modal
            open={!!selectedMeal}
            title={selectedMeal?.name}
            onCancel={() => setSelectedMeal(null)}
            footer={[
              <Button
                key="complete"
                type="primary"
                loading={modalLoading}
                onClick={() => handleCompleteMeal(selectedMeal?.id || "", true)}
                disabled={selectedMeal?.isComplete}
              >
                Complete Meal
              </Button>,
            ]}
          >
            {selectedMeal && (
              <>
                <Text>
                  <strong>Description:</strong> {selectedMeal.description}
                </Text>
                <br />
                <Text>
                  <strong>Calories:</strong> {selectedMeal.calories}
                </Text>
                <Divider />
                <Title level={4}>Ingredients</Title>
                {selectedMeal.ingredients.map((ing, idx) => (
                  <Card key={idx} size="small" style={{ marginBottom: "1rem" }}>
                    <Text strong>{ing.name}</Text>
                    <br />
                    <Text type="secondary">
                      Protein: {ing.protein}g | Carbs: {ing.carbohydrates}g |
                      Fats: {ing.fats}g
                    </Text>
                    <br />
                    <Tag color="magenta">{ing.calories} cal</Tag>
                  </Card>
                ))}
              </>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}
