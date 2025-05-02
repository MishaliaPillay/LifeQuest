import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";

const LoginContainer = styled.div`
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

const LoginComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: unknown) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login values:", values);
      message.success("Successfully logged in!");
      setLoading(false);
    }, 1500);
  };

  return (
    <LoginContainer>
      <h1 style={{ marginBottom: 24, fontWeight: 600 }}>Sign In</h1>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Email Address"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
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
            LOGIN
          </StyledButton>
        </Form.Item>
      </Form>
    </LoginContainer>
  );
};

export default LoginComponent;
