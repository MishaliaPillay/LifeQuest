import React from "react";
import ChatMessage from "./chat-message";

interface ChatWindowProps {
  messages: { role: string; content: string }[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
};

export default ChatWindow;
