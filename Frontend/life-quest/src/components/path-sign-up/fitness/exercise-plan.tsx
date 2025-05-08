"use client";
import React, { useState } from "react";
import { Typography, Card, Row, Col,  message } from "antd";
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

const { Title, Text } = Typography;

// Draggable Activity Component
const ActivityItem = ({ id, content, isInDay = false, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    marginBottom: 8,
    borderLeft: "4px solidrgb(255, 24, 120)",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text>{content}</Text>
        {isInDay && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            style={{ cursor: "pointer", color: "red" }}
          >
            ✕
          </span>
        )}
      </div>
    </Card>
  );
};

// Day Container Component
const DayContainer = ({ day, items, onRemoveActivity }) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: `day-${day}`,
  });

  return (
    <Card
      title={`Day ${day}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ height: "100%", minHeight: 200 }}
    >
      <div style={{ minHeight: 120 }}>
        {items.length === 0 ? (
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginTop: 40 }}
          >
            Drop activities here
          </Text>
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
              />
            ))}
          </SortableContext>
        )}
      </div>
    </Card>
  );
};

const CreateExercisePlan = ({ availableActivities }) => {
  // State for each day's activities
  const [dayActivities, setDayActivities] = useState(
    Array(10)
      .fill(null)
      .map((_, i) => ({ day: i + 1, activities: [] }))
  );

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
    if (overId.toString().startsWith("day-")) {
      const dayNumber = parseInt(overId.toString().split("-")[1]);

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
                    { ...activityToAdd, id: uniqueId },
                  ],
                };
              }
            }
            return day;
          })
        );

        message.success(`Added "${activityToAdd.content}" to Day ${dayNumber}`);
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>10-Day Exercise Planner</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: "block" }}>
        Drag and drop activities into the day containers to create your exercise
        plan
      </Text>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Available Activities">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <SortableContext
                  items={availableActivities.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {availableActivities.map((activity) => (
                    <div key={activity.id} style={{ width: "calc(20% - 8px)" }}>
                      <ActivityItem
                        id={activity.id}
                        content={activity.content}
                        onRemove={undefined}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>
            </Card>
          </Col>

          {/* Day containers - 2 rows of 5 */}
          <SortableContext
            items={dayActivities.map((day) => `day-${day.day}`)}
            strategy={verticalListSortingStrategy}
          >
            {[0, 1].map((row) => (
              <React.Fragment key={`row-${row}`}>
                {[1, 2, 3, 4, 5].map((col) => {
                  const dayIndex = row * 5 + col - 1;
                  const day = dayActivities[dayIndex];
                  return (
                    <Col
                      xs={24} // full width on extra small screens
                      sm={12} // half width on small screens
                      md={8} // 1/3 width on medium screens (3 per row)
                      lg={8} // 1/3 width on large screens (3 per row)
                      xl={8} // 1/3 width on extra large screens (3 per row)
                      xxl={12} // 1/3 width on double extra large screens (3 per row)
                      key={`day-${day.day}`}
                    >
                      <DayContainer
                        day={day.day}
                        items={day.activities}
                        onRemoveActivity={handleRemoveActivity}
                      />
                    </Col>
                  );
                })}
              </React.Fragment>
            ))}
          </SortableContext>
        </Row>
      </DndContext>
    </div>
  );
};

export default CreateExercisePlan;
