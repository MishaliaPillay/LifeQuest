"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input, Button, Card, Spin, message, Modal, InputNumber, Statistic } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useStepsActions, useStepsState } from "../../../providers/fitnesspath/step-provider/index";
import { useAuthState, useAuthActions } from "../../../providers/auth-provider";
import { getId } from "../../../utils/decoder";

const StepsGraphPage: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newSteps, setNewSteps] = useState<number>(0);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const { getSteps, createStep, updateStep } = useStepsActions();
  const { steps } = useStepsState();
  // Get auth state and actions
  const { Auth } = useAuthState();
  const { getCurrentPerson } = useAuthActions();

  // Get the user ID from JWT token, then fetch person data using that ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingAuth(true);
        // Get JWT token from session storage
        const accessToken = sessionStorage.getItem("jwt");
        
        if (accessToken) {
          // Extract user ID from JWT token
          const userId = getId(accessToken);
          
          if (userId && userId !== "1") { // Check it's not the default value
            // Convert userId to number for the API call
            const userIdNum = parseInt(userId, 10);
            
            if (!isNaN(userIdNum)) {
              try {
                // Get person data using the user ID from token
                const response = await getCurrentPerson(userIdNum);
                
                // Handle the nested structure in the API response
                // The actual person data is in response.result
                console.log(response)
                if (response && response) {
                  const personData = response;
                  console.log("Person data:", personData);
                  
                  if (personData.id) {
                    // Use the person ID from the returned data
                    setPersonId(personData.id);
                    // Fetch steps using the person ID
                    handleFetchSteps(personData.id);
                    message.success("User authenticated successfully");
                  } else {
                    message.warning("Person ID not found in response");
                  }
                } else {
                  message.warning("Invalid response format from server");
                }
              } catch (error) {
                console.error("Error fetching person data:", error);
                message.error("Failed to fetch person data");
              }
            } else {
              message.error("Invalid user ID format");
            }
          } else {
            message.warning("Could not extract valid user ID from token");
          }
        } else {
          message.warning("No authentication token found. Please log in.");
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        message.error("Failed to authenticate user");
      } finally {
        setLoadingAuth(false);
      }
    };

    fetchUserData();
  }, []); // Include getCurrentPerson in dependencies

  const handleFetchSteps = async (id = personId) => {
    if (!id) {
      message.warning("Please enter a person ID");
      return;
    }
    setLoading(true);
    try {
      await getSteps(id);
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

  // Calculate weekly average
  const weeklyAverage = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const last7DaysSteps = steps.filter((step) => {
      const stepDate = new Date(step.date);
      return stepDate >= oneWeekAgo && stepDate <= today;
    });

    if (last7DaysSteps.length === 0) return 0;

    const totalSteps = last7DaysSteps.reduce((sum, step) => sum + step.steps, 0);
    return Math.round(totalSteps / last7DaysSteps.length);
  }, [steps]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Card
        title="🚶‍♂️ Step Tracker Graph"
        bordered={false}
        style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        loading={loadingAuth}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <Input
            placeholder="Person ID (Auto-detected from login)"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
            disabled={!!Auth?.id || loadingAuth} // Disable manual entry when authenticated or loading
          />
          <Button type="primary" onClick={() => handleFetchSteps()} loading={loading}>
            Refresh Steps
          </Button>
        </div>
        
        <Button type="dashed" onClick={() => setAdding(true)} style={{ marginBottom: 16 }}>
          ➕ Add/Update Today
        </Button>

        <div style={{ marginTop: 32, background: "#f0f2f5", padding: 16, borderRadius: 12 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
              <p style={{ marginTop: 16 }}>Loading steps data...</p>
            </div>
          ) : steps && steps.length > 0 ? (
            <>
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

              <div style={{ marginTop: 24 }}>
                <Statistic
                  title="📊 Average Steps (Past 7 Days)"
                  value={weeklyAverage}
                  suffix="steps/day"
                />
              </div>
            </>
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