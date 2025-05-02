"use client";
import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { SignupContainer, StyledButton } from "./styles"; // Adjust the path if needed

const SignupComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: unknown) => {
    setLoading(true);

    setTimeout(() => {
      console.log("Signup values:", values);
      message.success("Account created successfully!");
      setLoading(false);
    }, 1500);
  };

  return (
    <SignupContainer>
      <h1 style={{ marginBottom: 24, fontWeight: 600 }}>Sign Up</h1>

      <Form
        name="signup"
        initialValues={{ agreement: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Full Name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Email Address"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <StyledButton
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            CREATE ACCOUNT
          </StyledButton>
        </Form.Item>
      </Form>
    </SignupContainer>
  );
};

export default SignupComponent;
