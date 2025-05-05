"use client";

import React, { useState } from "react";
import { Input, Button, Card, Spin, message } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStepsActions, useStepsState } from "../../../providers/fitnesspath/step-provider/index";

const StepsGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { getSteps } = useStepsActions();
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

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Card title="Step Tracker Graph" bordered={false}>
        <Input
          placeholder="Enter Person ID"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleFetchSteps} loading={loading}>
          Fetch Steps
        </Button>

        <div style={{ marginTop: 32 }}>
        {steps && steps.length > 0 ? (
  <LineChart
    width={700}
    height={300}
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
    <Line type="monotone" dataKey="count" stroke="#1890ff" />
  </LineChart>
) : (
  <p>No steps data to display. Please fetch steps.</p>
)}

        </div>
      </Card>
    </div>
  );
};

export default StepsGraphPage;
