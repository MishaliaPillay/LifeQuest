"use client";
import React from "react";
import { Typography, Form, Input, Button, Select, message } from "antd";

const { Title } = Typography;
const { Option } = Select;

const ActivityTypes: React.FC = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (values.preferredExerciseTypes.length > 3) {
      return message.error("You can select up to 3 preferred exercise types.");
    }
    if (values.availableEquipment.length > 5) {
      return message.error("You can select up to 5 equipment items.");
    }
    console.log("Submitted values:", values);
    // Add your logic here
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
            {
              required: true,
              message: "Please select at least one exercise type",
            },
          ]}
        >
          <Select
            mode="tags"
            placeholder="e.g., Yoga, HIIT"
            maxTagCount={3}
            maxLength={3}
            onChange={(val) => {
              if (val.length > 3) {
                message.warning("You can select up to 3 types.");
                form.setFieldsValue({
                  preferredExerciseTypes: val.slice(0, 3),
                });
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="availableEquipment"
          label="Available Equipment (max 5)"
          rules={[
            {
              required: true,
              message: "Please select at least one type of equipment",
            },
          ]}
        >
          <Select
            mode="tags"
            placeholder="e.g., Dumbbells, Resistance Bands, Treadmill "
            maxTagCount={3}
            maxLength={3}
            onChange={(val) => {
              if (val.length > 3) {
                message.warning("You can select up to 3 types.");
                form.setFieldsValue({
                  availableEquipment: val.slice(0, 3),
                });
              }
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Generate Plan
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ActivityTypes;
