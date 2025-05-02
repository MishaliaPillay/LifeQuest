"use client";

import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { SignupContainer, StyledButton } from "./styles";
import { useAuthActions } from "@/providers/auth-provider";
import { IAuth } from "@/providers/auth-provider/context";

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onBeforeSubmit?: () => void;
}

const SignupComponent: React.FC<SignupFormProps> = ({
  onBeforeSubmit,
  onSignupSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthActions();
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessToast = (msg = "Account created successfully!") => {
    messageApi.success({
      content: msg,
      duration: 3,
      style: { marginTop: "20px" },
    });
  };

  const showErrorToast = (msg = "Signup failed.") => {
    messageApi.error({
      content: msg,
      duration: 5,
      style: { marginTop: "20px" },
    });
  };

  const onFinishSignup = async (values: {
    name: string;
    surname: string;
    emailAddress: string;
    userName: string;
    password: string;
  }) => {
    try {
      onBeforeSubmit?.();
      setLoading(true);

      const auth: IAuth = {
        user: values,
        xp: 0,
        level: 0,
        avatar: "url", // default avatar
      };

      await signUp(auth);
      showSuccessToast();
      onSignupSuccess?.();
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.error?.message || error?.message;
      showErrorToast(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      {contextHolder}
      <h1 style={{ marginBottom: 24, fontWeight: 600 }}>Sign Up</h1>

      <Form
        name="signup"
        layout="vertical"
        size="large"
        onFinish={onFinishSignup}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="First Name"
          />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Please input your surname!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Surname"
          />
        </Form.Item>

        <Form.Item
          name="userName"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Username"
          />
        </Form.Item>

        <Form.Item
          name="emailAddress"
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
