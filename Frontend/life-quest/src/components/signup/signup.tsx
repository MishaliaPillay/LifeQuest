import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import styled from "styled-components";

const SignupContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  height: 45px;
  background: linear-gradient(90deg, #ff6b98 0%, #ff9171 100%);
  border: none;
  border-radius: 6px;
  font-weight: 500;

  &:hover,
  &:focus {
    background: linear-gradient(90deg, #ff5289 0%, #ff8060 100%);
  }
`;

const SignupComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: unknown) => {
    setLoading(true);

    // Simulate API call
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

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("You must accept the terms and conditions")
                    ),
            },
          ]}
        ></Form.Item>

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
