// ChatPage.tsx
"use client";

import React, { useState } from "react";
import { Typography, Spin, message as antdMessage } from "antd";
import ChatInput from "./chat-input";
import ChatWindow from "./chat-window";
import styles from "./chat.module.css";
import { fetchAIResponse } from "../../../utils/chat-ai";

const { Title, Paragraph } = Typography;

const ChatPage = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = { role: "user", content: userMessage };
    const updatedMessages = [...chatLog, newUserMessage];

    setChatLog(updatedMessages);
    setUserMessage("");
    setLoading(true);

    try {
      const aiReply = await fetchAIResponse(updatedMessages);

      if (aiReply) {
        setChatLog([...updatedMessages, { role: "assistant", content: aiReply }]);
      } else {
        antdMessage.error("No valid response from AI.");
        setChatLog([
          ...updatedMessages,
          { role: "assistant", content: "Sorry, I couldn't generate a reply. Please try again." },
        ]);
      }
    } catch (error) {
      antdMessage.error("Failed to fetch AI response.",error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Title level={2}>🧭 Life Quest & Fitness Path Guide</Title>
      <Paragraph type="secondary">
        Ask personalized questions about your goals, health, and mission — and get insightful, AI-powered guidance.
      </Paragraph>

      <ChatWindow messages={chatLog} />
      <ChatInput
        message={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onSend={handleSend}
        loading={loading}
      />
      {loading && <Spin style={{ marginTop: "1rem" }} />}
    </div>
  );
};

export default ChatPage;