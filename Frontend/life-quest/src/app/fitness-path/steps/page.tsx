"use client";

import React, { useState } from "react";
import { Input, Button, Card, Spin, message, Modal, InputNumber } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStepsActions, useStepsState } from "../../../providers/fitnesspath/step-provider/index";

const StepsGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newSteps, setNewSteps] = useState<number>(0);

  const { getSteps, createStep, updateStep } = useStepsActions();
  const { steps } = useStepsState();

  const handleFetchSteps = async () => {
    if (!personId) {
      message.warning("Please enter a person ID");
      return;
    }
    setLoading(true);
    try {
      await getSteps(personId);
      message.success("Steps loaded!");
    } catch (error) {
      message.error("Failed to load steps");
    }
    setLoading(false);
  };

  const handleAddOrUpdateToday = async () => {
    if (!personId) {
      message.warning("Please enter a person ID first");
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existingToday = steps.find(
      (step) => new Date(step.date).toISOString().split("T")[0] === todayDate
    );

    const payload = {
      id: existingToday ? existingToday.id : undefined, // only needed for update
      personId,
      date: todayDate,
      steps: newSteps,
      note: "Updated via app",
      caloriesBurned: newSteps * 0.04, // example formula
    };

    try {
      if (existingToday) {
        await updateStep(payload);
        message.success("Today's step entry updated!");
      } else {
        await createStep(payload);
        message.success("Today's step entry created!");
      }
      await getSteps(personId); // refresh graph
    } catch (error) {
      message.error("Failed to add/update today's steps");
    }

    setAdding(false);
    setNewSteps(0);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Card
        title="🚶‍♂️ Step Tracker Graph"
        bordered={false}
        style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <Input
          placeholder="Enter Person ID"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          style={{ marginBottom: 16, width: 300 }}
        />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleFetchSteps} loading={loading}>
            Fetch Steps
          </Button>{" "}
          <Button type="dashed" onClick={() => setAdding(true)}>
            ➕ Add/Update Today
          </Button>
        </div>

        <div style={{ marginTop: 32, background: "#f0f2f5", padding: 16, borderRadius: 12 }}>
          {steps && steps.length > 0 ? (
            <LineChart
              width={800}
              height={400}
              data={steps.map((item) => ({
                date: new Date(item.date).toLocaleDateString(),
                count: item.steps,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#52c41a" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <p style={{ textAlign: "center" }}>
              No steps data to display. Please fetch steps.
            </p>
          )}
        </div>
      </Card>

      <Modal
        title="Add or Update Today's Steps"
        open={adding}
        onOk={handleAddOrUpdateToday}
        onCancel={() => setAdding(false)}
        okText="Save"
      >
        <InputNumber
          min={0}
          value={newSteps}
          onChange={(value) => setNewSteps(value || 0)}
          placeholder="Enter step count"
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default StepsGraphPage;
