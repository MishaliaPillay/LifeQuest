import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React from "react";

const { TextArea } = Input;

interface ChatInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, onChange, onSend, loading }) => {
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
      <TextArea
        rows={2}
        value={message}
        onChange={onChange}
        placeholder="Ask about your Life Quest or Fitness Path..."
        disabled={loading}
        style={{ flex: 1 }}
      />
      <Button type="primary" icon={<SendOutlined />} onClick={onSend} loading={loading}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
