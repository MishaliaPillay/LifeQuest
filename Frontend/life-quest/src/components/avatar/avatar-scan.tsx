"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Divider,
  Card,
  message,
  Upload,
  Spin,
  Input,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styles from "./HealthAnalysisComponent.module.css";
import { analyzePersonImage } from "@/utils/avatar-service";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;
interface AvatarAnalysisProps {
  userLevel: number;
}

export default function AvatarAnalysis({ userLevel }: AvatarAnalysisProps) {
  // 1️⃣ Create a local message instance
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skinColor, setSkinColor] = useState("");
  const [race, setRace] = useState("");

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem("avatarData");
    if (saved) {
      const { description, skinColor, race } = JSON.parse(saved);

      setDescription(description);
      setSkinColor(skinColor);
      setRace(race);
    }
  }, []);

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj as File;
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsLoading(true);
    setDescription("");

    try {
      const { description } = await analyzePersonImage(selectedImage);
      setDescription(description);
    } catch (err: unknown) {
      if (err instanceof Error) {
        messageApi.error(err.message);
      } else {
        messageApi.error("Unknown error analyzing image");
      }
    }

    setIsLoading(false);
  };

  const handleSave = () => {
    if (!imagePreview || !description || !skinColor || !race) {
      messageApi.warning("Please complete all fields before saving.");
      return;
    }

    // show loading indicator keyed so we can replace it
    messageApi.open({
      key: "saving",
      type: "loading",
      content: "Saving avatar…",
    });

    setTimeout(() => {
      localStorage.setItem(
        "avatarData",
        JSON.stringify({ imagePreview, description, skinColor, race })
      );

      messageApi.open({
        key: "saving",
        type: "success",
        content: "Avatar data saved!",
        duration: 2,
      });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* 2️⃣ Render the contextHolder once */}
      {contextHolder}

      <Title level={2}>Avatar Description Generator</Title>
      <Divider />

      <Dragger
        name="file"
        multiple={false}
        accept="image/*"
        onChange={handleImageChange}
        beforeUpload={(file) => {
          const ok = file.type.startsWith("image/");
          if (!ok) messageApi.error(`${file.name} is not an image file`);
          return ok || Upload.LIST_IGNORE;
        }}
        className={styles.upload}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag to upload a photo</p>
        <p className="ant-upload-hint">Only one image supported</p>
      </Dragger>

      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={isLoading || !selectedImage}
        className={styles.button}
        size="large"
      >
        {isLoading ? <Spin size="small" /> : "Generate Description"}
      </Button>

      {imagePreview && (
        <>
          <Title level={5}>Image Preview</Title>
          <Card
            bodyStyle={{
              display: "flex",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxHeight: 300, width: "100%", objectFit: "cover" }}
            />
          </Card>
        </>
      )}

      {description && (
        <Card className={styles.analysisContainer}>
          <Title level={3}>Person Description</Title>
          <Paragraph>{description}</Paragraph>

          <Input
            placeholder="Skin color (e.g. fair, olive, dark)"
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <Input
            placeholder="Race (e.g. African, Asian, Caucasian)"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          {userLevel >= 1 && (
            <Card className={styles.accessoryCard}>
              <Title level={4}>Unlocked Accessories</Title>
              <ul>
                <li>🧢 Hat</li>
                <li>👓 Glasses</li>
              </ul>
              {userLevel >= 3 && (
                <>
                  <li>👕 Shirt</li>
                  <li>👖 Pants</li>
                  <li>👟 Shoes</li>
                </>
              )}
            </Card>
          )}

          <Button type="primary" onClick={handleSave}>
            Save Avatar Data
          </Button>
        </Card>
      )}
    </div>
  );
}
