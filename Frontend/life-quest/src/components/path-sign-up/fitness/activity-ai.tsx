import React, { useState, useEffect, useRef } from "react";
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
  Alert
} from "antd";
import {
  useActivityTypeActions,
  useActivityTypeState,
} from "@/providers/fitnesspath/activity-provider";
import { IBaseActivityTypeRequest } from "@/providers/fitnesspath/activity-provider/context";
import { IActivityType } from "@/providers/fitnesspath/activity-provider/context";
const { Title, Text } = Typography;
const { Option } = Select;

const ActivityTypes: React.FC<{
  onActivityTypesGenerated: (types: IActivityType[]) => void;
}> = ({ onActivityTypesGenerated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { generateActivityTypes } = useActivityTypeActions();
  const { activityTypes, isPending, isError, errorMessage } = useActivityTypeState();

  const previousTypesRef = useRef<IActivityType[]>([]);

  useEffect(() => {
    if (
      activityTypes &&
      activityTypes.length > 0 &&
      JSON.stringify(previousTypesRef.current) !== JSON.stringify(activityTypes)
    ) {

      onActivityTypesGenerated(activityTypes);
      previousTypesRef.current = activityTypes;
    }
  }, [activityTypes, onActivityTypesGenerated]);

  const handleFinish = async (values: IBaseActivityTypeRequest) => {
    setSubmitting(true);

    try {
      const request = {
        age: values.age,
        gender: values.gender,
        bodyType: values.bodyType,
        fitnessLevel: values.fitnessLevel,
        limitations: values.limitations,
        preferredExerciseTypes: values.preferredExerciseTypes,
        availableEquipment: values.availableEquipment,
      };

      await generateActivityTypes(request);
      message.success("Activity types generated successfully!");
    } catch (error) {
      console.error("Error generating activity types:", error);
      message.error("Failed to generate activity types.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>Create Your Fitness Profile</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        Tell us about yourself so we can generate the best workout activities for your needs
      </Text>
      
      {isError && errorMessage && (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          age: 30,
          gender: "male",
          bodyType: "mesomorph",
          fitnessLevel: "beginner",
          limitations: "none",
          preferredExerciseTypes: ["running"],
          availableEquipment: ["treadmill"],
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter your age" }]}
            style={{ flex: "1 0 120px" }}
          >
            <Input type="number" min={1} max={120} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select your gender" }]}
            style={{ flex: "1 0 200px" }}
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
            style={{ flex: "1 0 250px" }}
          >
            <Select placeholder="Select your body type">
              <Option value="ectomorph">Ectomorph (Slim, Lean Body)</Option>
              <Option value="mesomorph">Mesomorph (Athletic, Muscular Body)</Option>
              <Option value="endomorph">Endomorph (Soft, Round Body)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fitnessLevel"
            label="Fitness Level"
            rules={[{ required: true, message: "Please enter your fitness level" }]}
            style={{ flex: "1 0 200px" }}
          >
            <Select placeholder="Select your fitness level">
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="limitations"
          label="Limitations"
          rules={[{ required: true, message: "Please mention any limitations" }]}
        >
          <Input.TextArea
            placeholder="e.g., Knee pain, Asthma, or 'none' if no limitations"
            rows={2}
          />
        </Form.Item>

        <Form.Item
          name="preferredExerciseTypes"
          label="Preferred Exercise Types (max 3)"
          rules={[{ required: true, message: "Please select at least one type" }]}
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
          rules={[{ required: true, message: "Please select at least one type" }]}
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
            loading={submitting || isPending}
          >
            Generate Activities
          </Button>
        </Form.Item>
      </Form>

      {/* Display generated activity types */}
      {isPending ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "10px" }}>
            Generating your personalized fitness activities...
          </Text>
        </div>
      ) : (
        activityTypes.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <Title level={4}>Your Personalized Fitness Activities</Title>
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
                    size="small"
                  >
                    <p>{item.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ActivityTypes;
