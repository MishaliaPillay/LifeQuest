"use client";

import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { SignupContainer, StyledButton } from "./styles"; // Adjust path as needed
import { useAuthActions } from "@/providers/auth-provider";
import { IAuth, UserRequestDto } from "@/providers/auth-provider/context";

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

  const onFinishSignup = async (values: {
    name: string;
    surname: string;
    userName: string;
    email: string;
    password: string;
  }) => {
    console.log(values);
    try {
      onBeforeSubmit?.();
      setLoading(true);

      const user: UserRequestDto = {
        name: values.name,
        surname: values.surname,
        emailAddress: values.email,
        userName: values.userName,
        password: values.password,
      };

      const auth: IAuth = {
        user,
        xp: 0,
        level: 0,
        avatar: "url", // placeholder
      };

      await signUp(auth);
      message.success("Account created successfully!");
      onSignupSuccess?.();
    } catch (error: any) {
      message.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <h1 style={{ marginBottom: 24, fontWeight: 600 }}>Sign Up</h1>

      <Form
        name="signup"
        initialValues={{ agreement: true }}
        onFinish={onFinishSignup}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Name"
          />
        </Form.Item>
        <Form.Item
          name="surname"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Surname"
          />
        </Form.Item>
        <Form.Item
          name="userName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Username"
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
