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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styles from "./HealthAnalysisComponent.module.css";
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;
import { analyzePersonImage } from "@/utils/avatar-service";

export default function HealthAnalysisComponent() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (info) => {
    const { status } = info.file;

    if (status === "done") {
      const file = info.file.originFileObj;
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
      const result = await analyzePersonImage(selectedImage);
      setDescription(result.description);
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Avatar Description Generator</Title>
      <Divider />
      <Dragger
        {...{
          name: "file",
          multiple: false,
          accept: "image/*",
          onChange: handleImageChange,
          beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) message.error(`${file.name} is not an image file`);
            return isImage || Upload.LIST_IGNORE;
          },
        }}
        className={styles.upload}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single image upload only</p>
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
          <Card bodyStyle={{ display: "flex", justifyContent: "center" }}>
            <img src={imagePreview} alt="Preview" className={styles.previewImage} />
          </Card>
        </>
      )}

      {description && (
        <Card className={styles.analysisContainer}>
          <Title level={3}>Person Description</Title>
          <Paragraph>{description}</Paragraph>
        </Card>
      )}
    </div>
  );
}
