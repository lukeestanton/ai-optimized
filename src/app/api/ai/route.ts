// /app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai"; // Ensure `openai` is installed: npm i openai

// POST /api/ai
export async function POST(req: NextRequest) {
  try {
    // 1) Parse body sent from the client
    const { system, prompt, temperature = 0.2 } = (await req.json()) as {
      system?: string;
      prompt: string;
      temperature?: number;
    };

    // 2) Safety checks
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `prompt` in request body." },
        { status: 400 }
      );
    }

    // 3) Create OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // stored in .env
    });

    // 4) Call a small, fast model; keep messages generic
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature,
      messages: [
        system ? { role: "system", content: system } : undefined,
        { role: "user", content: prompt },
      ].filter(Boolean) as { role: "system" | "user"; content: string }[],
    });

    // 5) Grab the text content defensively
    const output =
      completion.choices?.[0]?.message?.content?.trim() ??
      "(No content returned)";

    // 6) Return a simple JSON payload the UI can consume
    return NextResponse.json({ output }, { status: 200 });
  } catch (err: unknown) {
    // 7) Helpful error text for debugging in the client
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


