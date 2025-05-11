import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./LoginComponent.module.css";
import { ISignInRequest } from "@/providers/auth-provider/context";
import { useAuthActions } from "@/providers/auth-provider";
import { useUserActions } from "@/providers/user-provider";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onBeforeSubmit?: () => void;
}

const LoginComponent: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onBeforeSubmit,
}) => {
  const { signIn } = useAuthActions();
  const { getCurrentUser } = useUserActions();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessToast = (msg = "Successfully logged in!") => {
    messageApi.success({
      content: msg,
      duration: 3,
      style: { marginTop: "20px" },
    });
  };

  const showErrorToast = (
    msg = "Login failed! Please check your credentials."
  ) => {
    messageApi.error({
      content: msg,
      duration: 5,
      style: { marginTop: "20px" },
    });
  };

  const onFinishLogin = async (values: ISignInRequest) => {
    onBeforeSubmit?.();
    setLoading(true);

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
      if (error.response?.data) {
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
    <div className={styles.loginContainer}>
      {contextHolder}
      <h1 className={styles.loginTitle}>Sign In</h1>

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
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className={styles.styledButton}
          >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginComponent;
