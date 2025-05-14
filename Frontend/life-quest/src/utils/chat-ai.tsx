// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from "next";

const systemPrompt = {
  role: "system",
  content: "You are a concise AI assistant for health and fitness guidance.",
};

const MAX_HISTORY = 2;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const recentMessages = messages.slice(-MAX_HISTORY);
    const finalMessages = [systemPrompt, ...recentMessages];

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com",
        "X-Title": "LifeQuest Chat",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-prover-v2:free",
        messages: finalMessages,
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await openRouterRes.json();

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || "No valid response.",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export const fetchAIResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    return data.message || null;
  } catch (error) {
    console.error("Client error:", error);
    return null;
  }
};
