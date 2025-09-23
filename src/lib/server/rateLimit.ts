import type { NextRequest } from "next/server";

const REQUEST_LIMIT = getPositiveInteger(process.env.RATE_LIMIT_REQUESTS, 20);
const WINDOW_MINUTES = getPositiveInteger(process.env.RATE_LIMIT_WINDOW_MINUTES, 1);
const WINDOW_SECONDS = WINDOW_MINUTES * 60;
const WINDOW_MS = WINDOW_SECONDS * 1000;
const RATE_LIMIT_PREFIX = process.env.RATE_LIMIT_PREFIX ?? "rate-limit:ai";
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type RateLimiter = {
  limit(identifier: string): Promise<RateLimitResult>;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
};

const rateLimiter = getOrCreateRateLimiter();

export async function enforceRateLimit(req: NextRequest): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(req);
  return rateLimiter.limit(identifier);
}

function getClientIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    if (first && first.trim().length > 0) {
      return first.trim();
    }
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return "anonymous";
}

function getPositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function extractNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value === "object" && "result" in value) {
    const nested = (value as { result: unknown }).result;
    if (typeof nested === "number") {
      return nested;
    }
  }

  return 0;
}

function createConfiguredRateLimiter(): RateLimiter {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Rate limiting is disabled because Upstash credentials are not configured."
      );
    }

    return {
      async limit(): Promise<RateLimitResult> {
        return {
          success: true,
          limit: REQUEST_LIMIT,
          remaining: REQUEST_LIMIT,
          reset: Date.now() + WINDOW_MS,
          retryAfter: 0,
        };
      },
    };
  }

  const endpoint = `${UPSTASH_URL.replace(/\/$/, "")}/pipeline`;
  const headers = {
    Authorization: `Bearer ${UPSTASH_TOKEN}`,
    "Content-Type": "application/json",
  };

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const key = `${RATE_LIMIT_PREFIX}:${identifier}`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, WINDOW_SECONDS.toString(), "NX"],
            ["PTTL", key],
          ]),
        });

        if (!response.ok) {
          throw new Error(
            `Upstash pipeline request failed with status ${response.status}`
          );
        }

        const payload = (await response.json()) as { result?: unknown[] };
        const results = Array.isArray(payload.result) ? payload.result : [];
        const count = extractNumber(results[0]);
        const ttlMs = extractNumber(results[2]);

        const remaining = Math.max(0, REQUEST_LIMIT - count);
        const success = count <= REQUEST_LIMIT;
        const ttl = ttlMs > 0 ? ttlMs : WINDOW_MS;
        const reset = Date.now() + ttl;
        const retryAfter = success ? 0 : Math.ceil(ttl / 1000);

        return {
          success,
          limit: REQUEST_LIMIT,
          remaining,
          reset,
          retryAfter,
        };
      } catch (error) {
        console.error("Failed to enforce rate limit via Upstash:", error);

        return {
          success: true,
          limit: REQUEST_LIMIT,
          remaining: REQUEST_LIMIT,
          reset: Date.now() + WINDOW_MS,
          retryAfter: 0,
        };
      }
    },
  };
}

function getOrCreateRateLimiter(): RateLimiter {
  if (!globalThis.__aiRateLimiter) {
    globalThis.__aiRateLimiter = createConfiguredRateLimiter();
  }

  return globalThis.__aiRateLimiter;
}

declare global {
  var __aiRateLimiter: RateLimiter | undefined;
}
