import { Card } from "antd";
import React from "react";

interface ChatMessageProps {
  role: string;
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <Card
      style={{
        marginBottom: "12px",
        backgroundColor: role === "user" ? "#f0f5ff" : "#fffbe6",
        border: "1px solid #d9d9d9",
      }}
    >
      <strong>{role === "user" ? "You" : "AI"}:</strong>
      <p style={{ marginTop: 8 }}>{content}</p>
    </Card>
  );
};

export default ChatMessage;
