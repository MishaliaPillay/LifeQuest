"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  List,
  Card,
  Tag,
} from "antd";
import {
  useActivityTypeActions,
  useActivityTypeState,
} from "@/providers/fitnesspath/activity-provider";
import { IGenerateActivityTypeRequest } from "@/providers/fitnesspath/activity-provider/context";

const { Title, Text } = Typography;
const { Option } = Select;

const ActivityTypes: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { generateActivityTypes, getActivityTypes } = useActivityTypeActions();
  const { activityTypes, loading, error } = useActivityTypeState();

  useEffect(() => {
    // Fetch existing activity types when component mounts
    getActivityTypes();
  }, []);

  const handleFinish = async (values: any) => {
    setSubmitting(true);

    try {
      const request: IGenerateActivityTypeRequest = {
        age: values.age,
        gender: values.gender,
        bodyType: values.bodyType,
        fitnessLevel: values.fitnessLevel,
        limitations: values.limitations,
        preferredExerciseTypes: values.preferredExerciseTypes.join(", "),
        availableEquipment: values.availableEquipment,
      };

      await generateActivityTypes(request);
      message.success("Activity types generated successfully!");

      // Don't reset the form so users can make minor adjustments and try again
      // form.resetFields();
    } catch (error) {
      console.error("Error generating activity types:", error);
      message.error("Failed to generate activity types.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={2}>Personal Fitness Profile</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          age: 25,
          gender: "male",
          bodyType: "",
          fitnessLevel: "",
          limitations: "",
          preferredExerciseTypes: [],
          availableEquipment: [],
        }}
      >
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter your age" }]}
        >
          <Input type="number" min={1} max={120} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="bodyType"
          label="Body Type"
          rules={[{ required: true, message: "Please enter your body type" }]}
        >
          <Input placeholder="e.g., Ectomorph, Mesomorph, Endomorph" />
        </Form.Item>

        <Form.Item
          name="fitnessLevel"
          label="Fitness Level"
          rules={[
            { required: true, message: "Please enter your fitness level" },
          ]}
        >
          <Input placeholder="e.g., Beginner, Intermediate, Advanced" />
        </Form.Item>

        <Form.Item
          name="limitations"
          label="Limitations"
          rules={[
            { required: true, message: "Please mention any limitations" },
          ]}
        >
          <Input.TextArea placeholder="e.g., Knee pain, Asthma" rows={2} />
        </Form.Item>

        <Form.Item
          name="preferredExerciseTypes"
          label="Preferred Exercise Types (max 3)"
          rules={[
            { required: true, message: "Please select at least one type" },
          ]}
        >
          <Select
            mode="tags"
            placeholder="e.g., Yoga, HIIT"
            onChange={(val) => {
              if (val.length > 3) {
                message.warning("You can select up to 3 types.");
                form.setFieldsValue({
                  preferredExerciseTypes: val.slice(0, 3),
                });
              }
            }}
          >
            <Option value="yoga">Yoga</Option>
            <Option value="hiit">HIIT</Option>
            <Option value="running">Running</Option>
            <Option value="swimming">Swimming</Option>
            <Option value="weightlifting">Weightlifting</Option>
            <Option value="pilates">Pilates</Option>
            <Option value="cycling">Cycling</Option>
            <Option value="boxing">Boxing</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="availableEquipment"
          label="Available Equipment (max 5)"
          rules={[
            { required: true, message: "Please select at least one type" },
          ]}
        >
          <Select
            mode="tags"
            placeholder="e.g., Dumbbells, Bands"
            onChange={(val) => {
              if (val.length > 5) {
                message.warning("You can select up to 5 items.");
                form.setFieldsValue({
                  availableEquipment: val.slice(0, 5),
                });
              }
            }}
          >
            <Option value="dumbbells">Dumbbells</Option>
            <Option value="bands">Resistance Bands</Option>
            <Option value="treadmill">Treadmill</Option>
            <Option value="bench">Bench</Option>
            <Option value="kettlebell">Kettlebell</Option>
            <Option value="yoga mat">Yoga Mat</Option>
            <Option value="barbell">Barbell</Option>
            <Option value="none">None</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting || loading}
          >
            Generate Fitness Plan
          </Button>
        </Form.Item>
      </Form>

      {/* Display generated activity types */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "10px" }}>
            Generating your personalized fitness plan...
          </Text>
        </div>
      ) : (
        activityTypes.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <Title level={3}>Your Personalized Fitness Plan</Title>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
              dataSource={activityTypes}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={item.category}
                    extra={
                      <Tag
                        color={
                          item.intensityLevel === 1
                            ? "green"
                            : item.intensityLevel === 2
                            ? "blue"
                            : item.intensityLevel === 3
                            ? "orange"
                            : "red"
                        }
                      >
                        Intensity: {item.intensityLevel}
                      </Tag>
                    }
                  >
                    <p>{item.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <Text type="danger">{error}</Text>
        </div>
      )}
    </div>
  );
};

export default ActivityTypes;
