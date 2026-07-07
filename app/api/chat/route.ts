import { NextResponse } from "next/server";
import { Message } from "@/types/chat";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: Message[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format. Messages must be an array." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMEINI_API_KEY;
    if (!apiKey) {
      console.error("GEMEINI_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "API configuration error. Please check server logs." },
        { status: 500 }
      );
    }

    // Format messages for Google's Gemini API
    // Note: Gemini uses 'user' and 'model' roles (instead of 'assistant')
    const contents = messages.map((msg) => {
      const role = msg.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: msg.content }],
      };
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (Status ${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Gemini API returned an error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the text content from the Gemini response structure
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: candidateText });
  } catch (error: any) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
