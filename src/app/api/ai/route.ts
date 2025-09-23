// /app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { enforceRateLimit } from "@/lib/server/rateLimit";

// POST /api/ai
export async function POST(req: NextRequest) {
  try {
    const rateLimit = await enforceRateLimit(req);

    const rateLimitHeaders: Record<string, string> = {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rateLimit.reset / 1000).toString(),
    };

    if (!rateLimit.success) {
      if (rateLimit.retryAfter > 0) {
        rateLimitHeaders["Retry-After"] = rateLimit.retryAfter.toString();
      }

      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders }
      );
    }

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
    const response = NextResponse.json({ output }, { status: 200 });

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (err: unknown) {
    // 7) Helpful error text for debugging in the client
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


