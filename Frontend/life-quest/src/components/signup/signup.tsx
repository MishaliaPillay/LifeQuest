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
  const [form] = Form.useForm(); // Add form instance
  const { signUp } = useAuthActions();
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessToast = (msg = "Account created successfully!") => {
    messageApi.success({ content: msg, duration: 3, style: { marginTop: 20 } });
  };

  const showErrorToast = (msg = "Signup failed.") => {
    messageApi.error({ content: msg, duration: 5, style: { marginTop: 20 } });
  };

  const onFinishSignup = async (values: any) => {
    try {
      onBeforeSubmit?.();
      setLoading(true);

      const auth: IAuth = {
        user: values, // Directly use form values, no manual remapping needed
        xp: 0,
        level: 0,
        avatar: "url", // placeholder
      };

      await signUp(auth);

      showSuccessToast();
      form.resetFields(); // Clear form
      onSignupSuccess?.(); // Switch tab
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed.";
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
        form={form}
        name="signup"
        layout="vertical"
        size="large"
        onFinish={onFinishSignup}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Please input your surname!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Surname" />
        </Form.Item>

        <Form.Item
          name="userName"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="emailAddress"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email Address" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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
