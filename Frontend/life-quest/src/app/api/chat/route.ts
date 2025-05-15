// app/api/chat/route.ts

import { NextResponse } from "next/server";

const systemPrompt = {
  role: "system",
  content: "You are a concise AI assistant for health and fitness guidance.",
};

const MAX_HISTORY = 2;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const recentMessages = messages.slice(-MAX_HISTORY);
    const finalMessages = [systemPrompt, ...recentMessages];

    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000/",
          "X-Title": "LifeQuest Chat",
        },
        body: JSON.stringify({
          model: "opengvlab/internvl3-2b:free",
          messages: finalMessages,
          max_tokens: 250,
          temperature: 0.7,
        }),
      }
    );

    const data = await openRouterRes.json();

    return NextResponse.json({
      message: data.choices?.[0]?.message?.content || "No valid response.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
