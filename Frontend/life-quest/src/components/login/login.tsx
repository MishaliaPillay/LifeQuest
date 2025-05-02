import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ISignInRequest } from "@/providers/auth-provider/context";
import { useAuthActions } from "@/providers/auth-provider";
import { useUserActions } from "@/providers/user-provider";
interface LoginFormProps {
  onLoginSuccess?: () => void;
  onBeforeSubmit?: () => void;
}

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

const LoginComponent: React.FC = ({
  onLoginSuccess,
  onBeforeSubmit,
}: LoginFormProps) => {
  const { signIn } = useAuthActions();

  const { getCurrentUser } = useUserActions();
  const [loading, setLoading] = useState(false);

  // Configure toast message options
  const [messageApi, contextHolder] = message.useMessage();

  // Toast message display functions
  const showSuccessToast = (msg = "Successfully logged in!") => {
    messageApi.success({
      content: msg,
      duration: 3,
      style: {
        marginTop: "20px",
      },
    });
  };

  const showErrorToast = (
    msg = "Login failed! Please check your credentials."
  ) => {
    messageApi.error({
      content: msg,
      duration: 5,
      style: {
        marginTop: "20px",
      },
    });
  };
  const onFinishLogin = async (values: ISignInRequest) => {
    onBeforeSubmit?.();
    setLoading(true);
    console.log(values);
    try {
      const loginResult = await signIn(values);

      if (loginResult) {
        const token = sessionStorage.getItem("jwt");
        getCurrentUser(token);
        setLoading(false);
        showSuccessToast();
        onLoginSuccess?.();
      } else {
        setLoading(false);
        showErrorToast();
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        showErrorToast(
          error.response.data.errorMessage ||
            "Login failed! Please check your credentials."
        );
      } else {
        showErrorToast();
      }
    }
  };

  return (
    <LoginContainer>
      {contextHolder}
      <h1 style={{ marginBottom: 24, fontWeight: 600 }}>Sign In</h1>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinishLogin}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="userNameOrEmailAddress"
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
