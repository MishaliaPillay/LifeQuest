"use client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Typography, Card, Row, Col, message, Button, Tabs, Empty, Spin } from "antd";
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
import { useExercisePlanActions } from "@/providers/fitnesspath/exercise-plan";
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Draggable Activity Component
const ActivityItem = ({
  id,
  content,
  isInDay = false,
  onRemove,
  description,
  category,
 calories,
  duration
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
          <Text strong>{content}</Text>
          {description && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              {description}
            </Text>
          )}
          {calories !== undefined && (
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              calories: {calories} {category && `• ${category}`}
            </div>
          )}     {duration && (
            <Text
              type="secondary"
              style={{ display: "block", fontSize: "12px" }}
            >
              {duration}
            </Text>
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

// Day Container Component
const DayContainer = ({ day, items, onRemoveActivity }) => {
  const droppableId = `day-${day}`;
  const { setNodeRef } = useDroppable({ id: droppableId });

  return (
    <Card
      title={`Day ${day}`}
      size="small"
      style={{ height: "100%", minHeight: 150 }}
      ref={setNodeRef} // Attach the droppable ref here
    >
      <div style={{ minHeight: 100 }}>
        {items.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Drop activities here"
            style={{ margin: "20px 0" }}
          />
        ) : (
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <ActivityItem
                key={item.id}
                id={item.id}
                content={item.content}
                isInDay={true}
                onRemove={onRemoveActivity}
                description={item.description}
                category={item.category}
                calories={item.calories}
                duration={item.duration}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </Card>
  );
};

const ExercisePlanBuilder = ({
  availableActivities,
  fitnessPathId,
  onPlanSubmit,
}) => {
  // State for each day's activities
  const [dayActivities, setDayActivities] = useState(
    Array(10)
      .fill(null)
      .map((_, i) => ({ day: i + 1, activities: [] }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPlan } = useExercisePlanActions();

  // Setup sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropped on a day container
    if (typeof overId === "string" && overId.startsWith("day-")) {
      const dayNumber = parseInt(overId.split("-")[1]);

      // Find the activity from available list
      const activityToAdd = availableActivities.find(
        (act) => act.id === activeId
      );

      if (activityToAdd) {
        // Create a new unique ID for this instance
        const uniqueId = `${activeId}-${Date.now()}`;

        setDayActivities((days) =>
          days.map((day) => {
            if (day.day === dayNumber) {
              // Check if activity already exists in this day
              const exists = day.activities.some((a) => a.id === uniqueId);
              if (!exists) {
                return {
                  ...day,
                  activities: [
                    ...day.activities,
                    {
                      ...activityToAdd,
                      id: uniqueId, // used for rendering/sorting
                      activityId: activityToAdd.id, // preserve original ID
                    },
                  ],
                };
              }
            }
            return day;
          })
        );

        message.success(`Added activity to Day ${dayNumber}`);
      }
    }
  };

  // Remove activity from a day
  const handleRemoveActivity = (activityId) => {
    setDayActivities((days) =>
      days.map((day) => ({
        ...day,
        activities: day.activities.filter((a) => a.id !== activityId),
      }))
    );
  };

  // Check if all 10 days have at least one activity
  const allDaysFilled = dayActivities.every(day => day.activities.length > 0);

  // Handle plan submission
  const handleSubmitPlan = async () => {
    // Ensure all days have activities
    if (!allDaysFilled) {
      message.error("Please add at least one activity to each day");
      return;
    }

    // Show loading message
    const loadingMessage = message.loading("Creating your exercise plan...", 0);
    setIsSubmitting(true);

    // Format the plan according to API specifications
    const plan = {
      fitnessPathId: fitnessPathId,
      name: "string",
      days: dayActivities.map((d) => ({
        description: "string",
        activityTypeIds: d.activities.map((a) => a.activityId),
        duration: 0,
        calories: 0,
      })),
    };

    try {
      await createPlan(plan);

      // Close loading message
      setTimeout(loadingMessage, 0);
      message.success({
        content: "Exercise Plan created successfully!",
        duration: 3,
        style: {
          marginTop: '20px',
        },
      });
      if (onPlanSubmit) onPlanSubmit();
    } catch (error) {
      console.error("Error creating plan:", error);
      // Close loading message
      setTimeout(loadingMessage, 0);
      message.error({
        content: "Failed to create Exercise Plan",
        duration: 3,
        style: {
          marginTop: '20px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>Build Your Exercise Plan</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        Drag and drop activities into each day to create your personalized
        workout plan. You must add at least one activity to each day.
      </Text>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <Card title="Available Activities" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <SortableContext
              items={availableActivities.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {availableActivities.length === 0 ? (
                <Empty description="No activities available yet" />
              ) : (
                availableActivities.map((activity) => (
                  <div key={activity.id} style={{ width: "calc(20% - 8px)" }}>
                    <ActivityItem
                      id={activity.id}
                      content={activity.content}
                      description={activity.description}
                      category={activity.category}
                      calories={activity.calories}
                      duration={activity.duration}
                      onRemove={undefined}
                    />
                  </div>
                ))
              )}
            </SortableContext>
          </div>
        </Card>

        <Spin spinning={isSubmitting} >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Days 1-5" key="1">
              <Row gutter={[16, 16]}>
                <SortableContext
                  items={dayActivities.slice(0, 5).map((day) => `day-${day.day}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {dayActivities.slice(0, 5).map((day) => (
                    <Col xs={24} sm={12} md={12} lg={8} key={`day-${day.day}`}>
                      <div id={`day-${day.day}`}>
                        <DayContainer
                          day={day.day}
                          items={day.activities}
                          onRemoveActivity={handleRemoveActivity}
                        />
                      </div>
                    </Col>
                  ))}
                </SortableContext>
              </Row>
            </TabPane>
            <TabPane tab="Days 6-10" key="2">
              <Row gutter={[16, 16]}>
                <SortableContext
                  items={dayActivities
                    .slice(5, 10)
                    .map((day) => `day-${day.day}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {dayActivities.slice(5, 10).map((day) => (
                    <Col xs={24} sm={12} md={12} lg={8} key={`day-${day.day}`}>
                      <div id={`day-${day.day}`}>
                        <DayContainer
                          day={day.day}
                          items={day.activities}
                          onRemoveActivity={handleRemoveActivity}
                        />
                      </div>
                    </Col>
                  ))}
                </SortableContext>
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
            {isSubmitting ? "Submitting..." : "Submit Exercise Plan"}
          </Button>
        </div>
      </DndContext>
    </div>
  );
};

export default ExercisePlanBuilder;