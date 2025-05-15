"use client";

import { useState } from "react";
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
import { useAuthActions } from "@/providers/auth-provider";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

interface AvatarAnalysisProps {
  userLevel: number;
  personId: string;
}

export default function AvatarAnalysis({
  userLevel,
  personId,
}: AvatarAnalysisProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { updateDescription } = useAuthActions();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skinColor, setSkinColor] = useState("");
  const [race, setRace] = useState("");
  const [unlockedAccessories, setUnlockedAccessories] = useState<string[]>([]);

  const handleImageChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const file = info.file.originFileObj as File;
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const aiDescription = await analyzePersonImage(selectedImage);

      const newAccessories = [...unlockedAccessories];
      if (userLevel >= 1) {
        if (!newAccessories.includes("Hat")) newAccessories.push("Hat");
        if (!newAccessories.includes("Glasses")) newAccessories.push("Glasses");
      }
      if (userLevel >= 3) {
        if (!newAccessories.includes("Shirt")) newAccessories.push("Shirt");
        if (!newAccessories.includes("Pants")) newAccessories.push("Pants");
        if (!newAccessories.includes("Shoes")) newAccessories.push("Shoes");
      }

      const accessoriesText =
        newAccessories.length > 0
          ? ` Accessories unlocked: ${newAccessories.join(", ")}.`
          : "";

      const finalDescription = aiDescription + accessoriesText;
      setDescription(finalDescription);
      setUnlockedAccessories(newAccessories);

      await updateDescription(personId, finalDescription);
      messageApi.success("Avatar description updated!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        messageApi.error(err.message);
      } else {
        messageApi.error("Unknown error analyzing image");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription("");
    setSkinColor("");
    setRace("");
    setUnlockedAccessories([]);
  };

  const handleSave = async () => {
    if (!imagePreview || !description || !skinColor || !race) {
      messageApi.warning("Please complete all fields before saving.");
      return;
    }

    messageApi.open({
      key: "saving",
      type: "loading",
      content: "Saving avatar…",
    });

    try {
      await updateDescription(personId, description);

      messageApi.open({
        key: "saving",
        type: "success",
        content: "Avatar data saved!",
        duration: 2,
      });
    } catch (err: unknown) {
      console.error(err);
      messageApi.error("Failed to save avatar to server.");
    }
  };

  return (
    <div className={styles.container}>
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
        onClick={handleGenerateDescription}
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

          {unlockedAccessories.length > 0 && (
            <Card className={styles.accessoryCard}>
              <Title level={4}>Unlocked Accessories</Title>
              <ul>
                {unlockedAccessories.includes("Hat") && <li>🧢 Hat</li>}
                {unlockedAccessories.includes("Glasses") && <li>👓 Glasses</li>}
                {unlockedAccessories.includes("Shirt") && <li>👕 Shirt</li>}
                {unlockedAccessories.includes("Pants") && <li>👖 Pants</li>}
                {unlockedAccessories.includes("Shoes") && <li>👟 Shoes</li>}
              </ul>
            </Card>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Button type="primary" onClick={handleSave}>
              Save Avatar Data
            </Button>
            <Button onClick={handleReset}>Reset Form</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
