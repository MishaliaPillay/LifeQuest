"use client";
import React, { useState } from "react";
import { Typography, Form, Input, Button, Select } from "antd";

const { Title } = Typography;
const { Option } = Select;

const ActivityTypes: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div>
      <Title level={2}>Personal Fitness Profile</Title>
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          age: 20,
          gender: "",
          bodyType: "",
          fitnessLevel: "",
          limitations: "",
          preferredExerciseTypes: "",
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
          label="Sex"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
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
          label="Preferred Exercise Types"
          rules={[{ required: true, message: "Please list your preferences" }]}
        >
          <Input placeholder="e.g., Yoga, HIIT, Strength Training" />
        </Form.Item>

        <Form.Item
          name="availableEquipment"
          label="Available Equipment"
          rules={[{ required: true, message: "Please select at least one" }]}
        >
          <Select mode="tags" placeholder="Select or enter equipment">
            <Option value="dumbbells">Dumbbells</Option>
            <Option value="resistance bands">Resistance Bands</Option>
            <Option value="kettlebell">Kettlebell</Option>
            <Option value="yoga mat">Yoga Mat</Option>
            <Option value="treadmill">Treadmill</Option>
            <Option value="none">None</Option>
          </Select>
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
