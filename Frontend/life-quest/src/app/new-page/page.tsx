"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Card,
  Spin,
  Form,
  Input,
  Button,
  Select,
  message,
  Divider,
} from "antd";
import { useUserState, useUserActions } from "@/providers/user-provider";
import { useFitnessPathActions } from "@/providers/fitnesspath/fitness-provider";
import { useAuthActions } from "@/providers/auth-provider";
import { useActivityTypeActions } from "../../providers/fitnesspath/activity-type-provider"
import { getId } from "@/utils/decoder";
import withAuth from "../../hoc/withAuth";
import styles from "./userDashboard.module.css";

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface FitnessPathFormValues {
  name: string;
  description: string;
  type: string;
  goal: string;
  duration: number;
}

const UserDashboard: React.FC = () => {
  const { currentUser } = useUserState();
  const { getCurrentUser } = useUserActions();
  const { createFitnessPath } = useFitnessPathActions();
  const { getCurrentPerson } = useAuthActions();
  const { generateActivityTypes } = useActivityTypeActions(); // ✅ NEW

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [personId, setPersonId] = useState<string>("");
  const hasFetched = useRef(false);
  const [form] = Form.useForm<FitnessPathFormValues>();

  useEffect(() => {
    const fetchUserAndPerson = async () => {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        message.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        await getCurrentUser(token);
      } catch (error) {
        console.error("Error fetching current user:", error);
        message.error("Failed to load user data.");
        setLoading(false);
        return;
      }

      const userId = getId(token);
      if (!userId || userId === "1") {
        message.error("Invalid user ID.");
        setLoading(false);
        return;
      }

      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        message.error("Invalid user ID format.");
        setLoading(false);
        return;
      }

      try {
        const personData = await getCurrentPerson(userIdNum);
        if (personData?.id) {
          setPersonId(personData.id);
        } else {
          message.warning("Person ID not found.");
        }
      } catch (error) {
        console.error("Error fetching person data:", error);
        message.error("Failed to fetch person data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPerson();
  }, [getCurrentUser, getCurrentPerson]);

  const handleFormSubmit = async (values: FitnessPathFormValues) => {
    if (!personId) {
      message.error("Person ID is missing. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      // Create Fitness Path
      const fitnessPath = {
        title: values.name,
        description: values.description,
        stepEntryIds: [],
        weightEntryIds: [],
        activityIds: [],
        personId: personId,
      };

      await createFitnessPath(fitnessPath);
      message.success("Fitness path created successfully!");

      // ✅ Generate Activity Types (you can later pull these from real user input)
      const request = {
        age: 22,
        gender: "female",
        bodyType: "mesomorph",
        fitnessLevel: "intermediate",
        limitations: "none",
        preferredExerciseTypes: values.type,
        availableEquipment: ["dumbbells", "resistance bands"],
      };

      await generateActivityTypes(request);
      message.success("Suggested activities generated!");

      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
      message.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentUser?.name) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div className={styles.loadingContent}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Card className={styles.welcomeCard}>
        <Title level={2}>
          🚀 Welcome, <span className={styles.userName}>{currentUser.name}</span>
        </Title>
        <Paragraph>
          Ready to embark on your next LifeQuest? Explore goals, track progress,
          and stay motivated.
        </Paragraph>
      </Card>

      <Divider orientation="left">Create Your Fitness Path</Divider>

      <Card className={styles.formCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            duration: 30,
            type: "cardio",
          }}
        >
          <Form.Item
            name="name"
            label="Fitness Path Name"
            rules={[{ required: true, message: "Please enter a name for your fitness path" }]}
          >
            <Input placeholder="e.g., Summer Shred 2025" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please describe your fitness path" }]}
          >
            <Input.TextArea placeholder="Describe your fitness goals and what you want to achieve" rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Fitness Type"
            rules={[{ required: true, message: "Please select a fitness type" }]}
          >
            <Select placeholder="Select the type of fitness">
              <Option value="cardio">Cardio</Option>
              <Option value="strength">Strength Training</Option>
              <Option value="flexibility">Flexibility & Yoga</Option>
              <Option value="mixed">Mixed Training</Option>
              <Option value="weightloss">Weight Loss</Option>
              <Option value="endurance">Endurance</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="goal"
            label="Specific Goal"
            rules={[{ required: true, message: "Please enter your specific goal" }]}
          >
            <Input placeholder="e.g., Run 5km, Lose 5kg, Bench press 100kg" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (days)"
            rules={[{ required: true, message: "Please specify the duration" }]}
          >
            <Input type="number" min={1} max={365} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Create Fitness Path
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default withAuth(UserDashboard);
