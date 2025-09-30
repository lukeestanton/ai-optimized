// /app/api/ai/route.ts
// JUST FOR DEMO VID. REMOVE LATER.
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { enforceRateLimit } from "@/lib/server/rateLimit";

// POST
export async function POST(req: NextRequest) {
  try {
    const rateLimit = await enforceRateLimit(req);

    const rateLimitHeaders: Record<string, string> = {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(rateLimit.reset / 1000).toString()
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

    const { system, prompt, temperature = 0.2 } = (await req.json()) as {
      system?: string;
      prompt: string;
      temperature?: number;
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `prompt` in request body." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature,
      messages: [
        system ? { role: "system", content: system } : undefined,
        { role: "user", content: prompt },
      ].filter(Boolean) as { role: "system" | "user"; content: string }[],
    });

    const output =
      completion.choices?.[0]?.message?.content?.trim() ??
      "(No content returned)";

    const response = NextResponse.json({ output }, { status: 200 });

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


