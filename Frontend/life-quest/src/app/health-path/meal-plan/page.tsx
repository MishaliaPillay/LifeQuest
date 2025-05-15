"use client";
import { useEffect, useState } from "react";
import { message, Spin, Card, Modal, Button, Progress } from "antd";
import { useAuthActions } from "../../../providers/auth-provider";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";
import { getId } from "../../../utils/decoder";
import { useMealPlanActions } from "@/providers/health-path-provider/meal-plan";
import { IIngredient } from "@/providers/health-path-provider/meal-plan/context"; // Assuming your interfaces are in this path
import { IMeal } from "@/providers/health-path-provider/meal-plan/context";
import { useRouter } from "next/navigation";
import { IHealthPath } from "@/providers/health-path-provider/health-provider/context";
import { launchConfetti } from "../../../utils/confetti"; // Import your confetti utility
import { useMealActions } from "@/providers/health-path-provider/meal-provider";
interface IMealPlanDay {
  order: number;
  description?: string;
  meals: IMeal[];
  score: number;
}

export default function HealthPathPage() {
  const [loading, setLoading] = useState(true);
  const [healthPath, setHealthPath] = useState<IHealthPath | null>(null);
  const [mealPlanDays, setMealPlanDays] = useState<IMealPlanDay[]>([]);
  const [mealPlanId, setMealPlanId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null);
  const { getCurrentPerson } = useAuthActions();
  const { getHealthPath, getHealthPaths } = useHealthPathActions();
  const { getMealPlanDaysByPlanId, completePlan } = useMealPlanActions();
  const router = useRouter();
  const { completeMeal } = useMealActions();
  useEffect(() => {
    const fetchHealthPath = async () => {
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

        const healthPath = await getHealthPath(person.id);
        const healthpathfound = await getHealthPaths(healthPath.id);

        if (!healthPath?.id) {
          message.warning("Health path not found.");
          return;
        }

        setHealthPath(healthpathfound);

        const mealPlanId = healthpathfound.mealPlans?.[0]?.id;
        if (!mealPlanId) {
          message.warning("No meal plan found.");
          return;
        }

        setMealPlanId(mealPlanId);
        const mealsResponse = await getMealPlanDaysByPlanId(mealPlanId);
        setMealPlanDays(mealsResponse?.result ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load health path.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthPath();
  }, []);

  const handleCardClick = (meal: IMeal) => {
    setSelectedMeal(meal);
  };

  const renderIngredients = (ingredients: IIngredient[]) => {
    return ingredients.map((ingredient, index) => (
      <div key={index}>
        <p>
          <strong>{ingredient.name}</strong> ({ingredient.calories} cal)
        </p>
        <ul>
          <li>Protein: {ingredient.protein}g</li>
          <li>Carbs: {ingredient.carbohydrates}g</li>
          <li>Fats: {ingredient.fats}g</li>
        </ul>
      </div>
    ));
  };

  const handleCompleteMealPlan = async () => {
    if (!mealPlanId) {
      message.error("Meal plan ID is missing.");
      return;
    }

    setCompleting(true);

    try {
      await completePlan(mealPlanId);

      sessionStorage.setItem("cameFromExercisePlan", "true");
      router.push("/new-page");
      message.success("Meal plan completed!");
      launchConfetti(); // Trigger confetti after completing the plan
      // Replace with actual next page
    } catch (error) {
      message.error("Failed to complete meal plan.", error);
    } finally {
      setCompleting(false);
    }
  };

  const handleCompleteMeal = async (mealId: string) => {
    if (!mealId) return;

    setCompleting(true);

    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) throw new Error("JWT not found");

      const id = getId(token);
      const person = await getCurrentPerson(parseInt(id));

      await completeMeal(mealId, person.id); // 🔥 Actually call API to complete the meal
      console.log("meal is", mealId);
      // Refresh meal plan days
      if (mealPlanId) {
        const mealsResponse = await getMealPlanDaysByPlanId(mealPlanId);
        setMealPlanDays(mealsResponse?.result ?? []);
      }

      launchConfetti();
      message.success("Meal marked as complete!");
    } catch (err) {
      console.error("Failed to mark meal as complete:", err);
      message.error("Failed to mark meal as complete.");
    } finally {
      setCompleting(false);
    }
  };

  // Calculate meal plan completion progress
  const completedMeals = mealPlanDays.reduce((acc, day) => {
    return acc + day.meals.filter((meal) => meal.isComplete).length;
  }, 0);
  const totalMeals = mealPlanDays.reduce(
    (acc, day) => acc + day.meals.length,
    0
  );
  const progress = totalMeals ? (completedMeals / totalMeals) * 100 : 0;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f7fa" }}>
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
        <div>
          <h2>Your Health Path</h2>
          {healthPath ? (
            <div>
              <p>{healthPath.description}</p>
            </div>
          ) : (
            <p>No health path found.</p>
          )}

          <h3 style={{ marginTop: "2rem" }}>Meal Plan Days</h3>
          <Progress percent={progress} status="active" />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {mealPlanDays.map((day, index) => (
              <Card
                key={index}
                title={day.description || `Day ${day.order + 1}`}
                style={{ width: 300 }}
                bordered
                onClick={() => handleCardClick(day.meals[0])}
              >
                <p>
                  <strong>Score:</strong> {day.score}
                </p>
                <p>
                  <strong>Meals:</strong>
                </p>
                {day.meals?.map((meal, mealIdx) => (
                  <div key={mealIdx} style={{ marginBottom: "0.5rem" }}>
                    <p>
                      <strong>{meal.name || "Meal"}</strong>: {meal.description}
                    </p>
                    <p>
                      <strong>Calories:</strong> {meal.calories}
                    </p>
                    <Button onClick={() => handleCompleteMeal(meal.id)}>
                      Complete Meal
                    </Button>
                  </div>
                ))}
              </Card>
            ))}
          </div>

          {mealPlanId && (
            <Button
              type="primary"
              onClick={handleCompleteMealPlan}
              loading={completing}
              style={{ marginTop: "2rem" }}
            >
              Complete Meal Plan
            </Button>
          )}

          <Modal
            visible={selectedMeal !== null}
            title={selectedMeal?.name}
            onCancel={() => setSelectedMeal(null)}
            footer={[
              <Button
                key="complete"
                type="primary"
                onClick={() => handleCompleteMeal(selectedMeal?.id || "")}
              >
                Complete Meal
              </Button>,
            ]}
            width={600}
          >
            {selectedMeal && (
              <div>
                <p>
                  <strong>Description:</strong> {selectedMeal.description}
                </p>
                <p>
                  <strong>Calories:</strong> {selectedMeal.calories}
                </p>
                <h4>Ingredients:</h4>
                {renderIngredients(selectedMeal.ingredients)}
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}
