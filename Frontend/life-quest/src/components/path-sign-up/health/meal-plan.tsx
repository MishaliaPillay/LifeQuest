"use client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  Typography,
  Card,
  Row,
  Col,
  message,
  Button,
  Tabs,
  Empty,
  Spin,
} from "antd";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMealPlanActions } from "@/providers/health-path-provider/meal-plan";
import { IMealPlan } from "@/providers/health-path-provider/meal-plan/context";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MealItem = ({
  id,
  content,
  isInDay = false,
  onRemove,
  protein,
  carbohydrates,
  servingSize,
  fats,
  calories,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    marginBottom: 8,
    background: "#fff",
    borderRadius: 4,
    border: "1px solid #f0f0f0",
    padding: "8px 12px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Text strong>{content}</Text>{" "}
          {servingSize !== undefined && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              Serving size: {servingSize}g
            </Text>
          )}
          {protein !== undefined && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              Protein: {protein}g
            </Text>
          )}
          {carbohydrates !== undefined && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              Carbs: {carbohydrates}g
            </Text>
          )}
          {fats !== undefined && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              Fats: {fats}g
            </Text>
          )}
          {calories !== undefined && (
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              Calories: {calories}
            </div>
          )}
        </div>
        {isInDay && (
          <Button
            type="text"
            danger
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  );
};

const DayContainer = ({ day, items, onRemoveMeal }) => {
  const droppableId = `day-${day}`;
  const { setNodeRef } = useDroppable({ id: droppableId });

  return (
    <Card title={`Day ${day}`} size="small" ref={setNodeRef}>
      <div style={{ minHeight: 100 }}>
        {items.length === 0 ? (
          <Empty description="Drop meals here" style={{ margin: "20px 0" }} />
        ) : (
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <MealItem
                key={item.id}
                id={item.id}
                content={item.content}
                isInDay={true}
                onRemove={onRemoveMeal}
                protein={item.protein}
                carbohydrates={item.carbohydrates}
                servingSize={item.servingSize}
                fats={item.fats}
                calories={item.calories}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </Card>
  );
};

const MealPlanBuilder = ({ availableMeals, healthPathId, onPlanSubmit }) => {
  const [dayMeals, setDayMeals] = useState(
    Array(10)
      .fill(null)
      .map((_, i) => ({ day: i + 1, meals: [] }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlan } = useMealPlanActions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (typeof overId === "string" && overId.startsWith("day-")) {
      const dayNumber = parseInt(overId.split("-")[1]);
      const mealToAdd = availableMeals.find((m) => m.id === activeId);

      if (mealToAdd) {
        const uniqueId = `${activeId}-${Date.now()}`;

        setDayMeals((days) =>
          days.map((day) =>
            day.day === dayNumber
              ? {
                  ...day,
                  meals: [
                    ...day.meals,
                    {
                      ...mealToAdd,
                      id: uniqueId,
                      mealId: mealToAdd.id,
                      content: mealToAdd.name,
                    },
                  ],
                }
              : day
          )
        );

        message.success(`Added meal to Day ${dayNumber}`);
      }
    }
  };

  const handleRemoveMeal = (mealId) => {
    setDayMeals((days) =>
      days.map((day) => ({
        ...day,
        meals: day.meals.filter((m) => m.id !== mealId),
      }))
    );
  };

  const allDaysFilled = dayMeals.every((day) => day.meals.length > 0);

  const handleSubmitPlan = async () => {
    if (!allDaysFilled) {
      message.error("Please add at least one meal to each day");
      return;
    }

    const loadingMessage = message.loading("Creating your Meal Plan...", 0);
    setIsSubmitting(true);

const plan: IMealPlan = {
  healthPathId,
  name: "My Meal Plan",
  status: 0, // or "Active" or any appropriate enum/value
  meals: dayMeals.flatMap((d) => d.meals.map((m) => m.mealId)),
  mealPlanDays: dayMeals.map((d, index) => ({
    order: index,
    description: `Day ${d.day}`,
    meals: d.meals.map((m) => m.mealId),
    score: 0,
  })),
};



    try {
      await createPlan(plan);
      setTimeout(loadingMessage, 0);
      message.success("Meal Plan created successfully!");
      if (onPlanSubmit) onPlanSubmit();
    } catch (error) {
      setTimeout(loadingMessage, 0);
      message.error("Failed to create Meal Plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>Build Your Meal Plan</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        Drag and drop meals into each day to create your personalized plan.
      </Text>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <Card title="Available Meals" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <SortableContext
              items={availableMeals.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {availableMeals.length === 0 ? (
                <Empty description="No meals available" />
              ) : (
                availableMeals.map((meal) => (
                  <div key={meal.id} style={{ width: "calc(20% - 8px)" }}>
                    <MealItem
                      id={meal.id}
                      content={meal.name}
                      protein={meal.protein}
                      carbohydrates={meal.carbohydrates}
                      fats={meal.fats}
                      calories={meal.calories}
                      servingSize={meal.servingSize}
                      onRemove={undefined}
                    />
                  </div>
                ))
              )}
            </SortableContext>
          </div>
        </Card>

        <Spin spinning={isSubmitting}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Days 1-5" key="1">
              <Row gutter={[16, 16]}>
                {dayMeals.slice(0, 5).map((day) => (
                  <Col xs={24} sm={12} md={12} lg={8} key={day.day}>
                    <DayContainer
                      day={day.day}
                      items={day.meals}
                      onRemoveMeal={handleRemoveMeal}
                    />
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tab="Days 6-10" key="2">
              <Row gutter={[16, 16]}>
                {dayMeals.slice(5).map((day) => (
                  <Col xs={24} sm={12} md={12} lg={8} key={day.day}>
                    <DayContainer
                      day={day.day}
                      items={day.meals}
                      onRemoveMeal={handleRemoveMeal}
                    />
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
        </Spin>

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Button
            type="primary"
            onClick={handleSubmitPlan}
            size="large"
            disabled={!allDaysFilled || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Meal Plan"}
          </Button>
        </div>
      </DndContext>
    </div>
  );
};

export default MealPlanBuilder;
