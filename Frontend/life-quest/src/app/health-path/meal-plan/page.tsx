"use client";

import { useEffect, useState } from "react";
import { message, Spin, Card } from "antd";
import { useRouter } from "next/navigation";
import { useAuthActions } from "../../../providers/auth-provider";
import { useHealthPathActions } from "@/providers/health-path-provider/health-provider";
import { getId } from "../../../utils/decoder";
import { useMealPlanActions } from "@/providers/health-path-provider/meal-plan";

export default function HealthPathPage() {
  const [loading, setLoading] = useState(true);
  const [healthPath, setHealthPath] = useState<any>(null);
  const [mealPlanDays, setMealPlanDays] = useState<any[]>([]);
  const [messageApi] = message.useMessage();

  const { getCurrentPerson } = useAuthActions();
  const { getHealthPath, getHealthPaths } = useHealthPathActions();
  const { getMealPlanDaysByPlanId } = useMealPlanActions();
  const router = useRouter();

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
              <h3>{healthPath.name}</h3>
              <p>{healthPath.description}</p>
            </div>
          ) : (
            <p>No health path found.</p>
          )}

          <h3 style={{ marginTop: "2rem" }}>Meal Plan Days</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {mealPlanDays.map((day, index) => (
              <Card
                key={index}
                title={day.description || `Day ${day.order + 1}`}
                style={{ width: 300 }}
                bordered
              >
                <p><strong>Score:</strong> {day.score}</p>
                <p><strong>Meals:</strong></p>
                {day.meals?.map((meal: any, mealIdx: number) => (
                  <div key={mealIdx} style={{ marginBottom: "0.5rem" }}>
                    <p><strong>{meal.name || "Meal"}</strong>: {meal.description}</p>
                    <p><strong>Calories:</strong> {meal.calories}</p>
                    <p><strong>Ingredients:</strong></p>
                    <ul style={{ paddingLeft: "1rem" }}>
                      {meal.ingredients?.map((ingredient: any, i: number) => (
                        <li key={i}>
                          {ingredient.name} ({ingredient.calories} cal)
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
