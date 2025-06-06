"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Card,
  Spin,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useUserState, useUserActions } from "@/providers/user-provider";
import styles from "./profile.module.css";
import { IPerson } from "@/providers/user-provider/context";
import { IUser } from "@/providers/user-provider/context";
import { useAuthActions } from "@/providers/auth-provider";
import { IAuth } from "@/providers/auth-provider/context";
const { Title, Paragraph } = Typography;

const Profile: React.FC = () => {
  const { currentUser } = useUserState();
  const { getCurrentUser, updateUser } = useUserActions();
  const [person, setPerson] = useState<IAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasFetched = useRef(false);
  const { getCurrentPerson } = useAuthActions();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");

    if (token && !currentUser && !hasFetched.current) {
      hasFetched.current = true;
      getCurrentUser(token); // don't await
    }
  }, [currentUser, getCurrentUser]);

  useEffect(() => {
    const fetchPerson = async () => {
      if (currentUser?.id && !person) {
        const personData = await getCurrentPerson(currentUser.id);

        setPerson(personData);
        setLoading(false);
      }
    };

    fetchPerson();
  }, [getCurrentUser]);

  const handleUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files allowed.");
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async (values: IUser) => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const updatedPerson: IPerson = {
        id: person.id,
        user: {
          ...currentUser,
          name: values.name,
          surname: values.surname,
          emailAddress: values.email,
        },
        xp: 0,
        level: 0,
        avatar: "url",
        pathId: person.pathId,
      };

      await updateUser(updatedPerson);
      message.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !currentUser?.name) {
    return (
      <Spin size="large">
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>Loading your dashboard...</div>
        </div>
      </Spin>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Card className={styles.welcomeCard}>
        <Title level={2}>
          🚀 Welcome,{" "}
          <span className={styles.userName}>{currentUser.name}</span>
        </Title>
        <Paragraph>
          Ready to embark on your next LifeQuest? Explore goals, track progress,
          and stay motivated.
        </Paragraph>
      </Card>

      <Card className={styles.profileCard} title="🧑 Your Profile" bordered>
        <div className={styles.avatarSection}>
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            className={styles.uploadAvatar}
          >
            <Avatar
              size={100}
              src={avatarUrl}
              icon={!avatarUrl && <UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.uploadText}>
              <UploadOutlined /> Upload Photo
            </div>
          </Upload>
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: currentUser.name,
            surname: currentUser.surname,
            email: currentUser.emailAddress,
          }}
          onFinish={handleSave}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Surname" name="surname">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
