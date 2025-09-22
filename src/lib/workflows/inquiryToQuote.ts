// /lib/workflows/inquiryBranchDemo.ts
export type WorkflowStep = {
  id: string;
  title: string;
  description?: string;
  system?: string;
  promptTemplate: (input: {
    customerMessage: string;
    previousStepOutput?: string;
  }) => string;
};

export const MARGIN_FLOOR_PCT = 22;

export const inquiryBranchDemoSteps: WorkflowStep[] = [
  // 1) Extract features from messy intake (LLM → JSON)
  {
    id: "extract-features",
    title: "Extract Features",
    description:
      "Parse the messy inquiry into normalized features for downstream decisions.",
    system:
      "You are a precise intake parser for home-services quotes. Output strict JSON only.",
    promptTemplate: ({ customerMessage }) =>
      [
        "Inquiry:",
        '"""',
        customerMessage,
        '"""',
        "",
        "Extract conservative features. If unknown, use null/empty—not guesses.",
        "- If the address is ambiguous or non-specific (e.g., landmark-only like 'white house' without city/zip), set address to null and add 'ambiguous_address' to riskFlags.",
        "- If the inquiry mentions 'photo', 'photos', 'picture', or 'pictures', include a 'photos_requested' marker in riskFlags (non-risky flag used for routing).",
        "Return STRICT JSON (no code fences):",
        `{
  "contact": { "name": string | null, "email": string | null, "phone": string | null },
  "address": string | null,
  "surfaces": [ { "type": "driveway|patio|siding|walkway|deck|other", "sqft": number | null, "notes": string[] } ],
  "stains": string[],             // e.g., ["oil","mildew"]
  "timeHints": string[],          // e.g., ["Fri PM","Oct 15"]
  "priceSensitivity": "low" | "medium" | "high" | "unknown",
  "readiness": "ready" | "shopping" | "hesitant" | "unknown",
  "riskFlags": string[],          // pets, ladders, height, HOA, out-of-area, ambiguous_address, photos_requested, etc.
  "channelPref": "email" | "sms" | "phone" | "unknown"
}`,
      ].join("\n"),
  },

  // 2) Decide which path to take (LLM → JSON)
  {
    id: "decide-path",
    title: "Decide Path",
    description:
      "Choose one: quote_now, need_photos, or needs_human, with rationale + pillars.",
    system:
      "You map features to a sales/ops path. Output strict JSON only.",
    promptTemplate: ({ previousStepOutput = "{}" }) =>
      [
        "Features JSON:",
        previousStepOutput,
        "",
        "Rules:",
        "- needs_human if any of: strong riskFlags (height/ladder/unsafe), unclear address + high risk language, or contradictory scope.",
        "- need_photos if surfaces/areas are unclear OR stains mentioned without clarity, AND no serious risk.",
        "- need_photos if the inquiry explicitly requests photos/pictures, provided there is no serious risk requiring needs_human.",
        "- need_photos if address is ambiguous (e.g., landmark-only) but otherwise low-risk — use photos to disambiguate.",
        "- quote_now only if surfaces clear enough AND address appears serviceable or not required for scope.",
        "",
        "Also pick 3–5 messaging pillars for copy (e.g., longevity, safety for pets/plants, curb appeal, warranty, fast scheduling).",
        "Return STRICT JSON:",
        `{
  "path": "quote_now" | "need_photos" | "needs_human",
  "rationale": string,
  "pillars": string[]
}`,
      ].join("\n"),
  },

  // 3) Scope estimate (LLM → JSON). Heuristics only, no external data.
  {
    id: "estimate-scope",
    title: "Estimate Scope",
    description:
      "Infer missing sqft and crewHours using stable heuristics so pricing is consistent.",
    system:
      "You estimate scope conservatively. Output strict JSON only.",
    promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
      [
        "Inputs (may be features or decision JSON):",
        previousStepOutput,
        "",
        "Original inquiry (for hints):",
        '"""',
        customerMessage,
        '"""',
        "",
        "Heuristics for missing sqft:",
        "- driveway: 480; patio: 240; siding: 2000; walkway: 80.",
        "- totalSqft = sum; crewHours = (totalSqft/300) + 0.5 setup; min 1.0; +0.5 if stains include oil/rust.",
        "- Round sqft to nearest 10; crewHours to 1 decimal.",
        "Return STRICT JSON:",
        `{
  "areasBySurface": [{ "surface": "driveway|patio|siding|walkway|deck|other", "sqft": number }],
  "totalSqft": number,
  "crewHours": number,
  "assumptions": string[]
}`,
      ].join("\n"),
  },

  // 4) Price (LLM → JSON). Still LLM math; no external pricebooks.
  {
    id: "price-job",
    title: "Price Job",
    description:
      "Create Good/Better/Best, compute internal costs + margins (LLM math).",
    system:
      "You produce itemized tiers with simple internal cost model. Output strict JSON only.",
    promptTemplate: ({ previousStepOutput = "{}" }) =>
      [
        "Scope JSON:",
        previousStepOutput,
        "",
        "Cost heuristics:",
        "- labor: $65 * crewHours",
        "- chem: hard surfaces $0.08/sqft; siding $0.05/sqft",
        "- travel: $15; misc: $15",
        "Tier logic:",
        "- Good: essential clean.",
        "- Better: + pretreat if stains OR mild upsell.",
        "- Best: + sealant/warranty style upsell.",
        "Compute marginPct = (subtotal - (labor+chem+travel+misc)) / subtotal * 100 (1 decimal).",
        "Return STRICT JSON:",
        `{
  "tiers": [
    {
      "name": "Good",
      "lineItems": [{ "name": string, "price": number }],
      "subtotal": number,
      "estCost": { "labor": number, "chem": number, "travel": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    },
    {
      "name": "Better",
      "lineItems": [{ "name": string, "price": number }],
      "subtotal": number,
      "estCost": { "labor": number, "chem": number, "travel": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    },
    {
      "name": "Best",
      "lineItems": [{ "name": string, "price": number }],
      "subtotal": number,
      "estCost": { "labor": number, "chem": number, "travel": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    }
  ],
  "notes": string[]
}`,
      ].join("\n"),
  },

  // 5) Guardrails + Presentation (LLM → JSON). Decides CTA + order.
  {
    id: "guardrails-present",
    title: "Guardrails & Presentation",
    description:
      "Protect margin, order tiers by buyer path, choose CTA, or propose adjustments.",
    system:
      "You enforce guardrails and tailor presentation. Output strict JSON only.",
    promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
      [
        "Pricing JSON (merge with earlier decision and inquiry cues in your reasoning):",
        previousStepOutput,
        "",
        "Original inquiry (for explicit cues like 'photos' and address hints):",
        '"""',
        customerMessage,
        '"""',
        "",
        `Rules:
- Any tier with marginPct < ${MARGIN_FLOOR_PCT} → add a suggested adjustment (increase $ or remove add-on).
- Path rules:
  - quote_now → order Best, Better, Good if priceSensitivity != 'high'; otherwise Value order Good, Better, Best.
  - need_photos → hide Better/Best, CTA 'send_photos'.
  - needs_human → hide all tiers; CTA 'needs_review'.
  - Prefer need_photos if the inquiry explicitly requests photos/pictures (keywords: photo, photos, picture, pictures) and there is no serious risk.
  - Prefer need_photos when address cues are ambiguous/landmark-only and otherwise low-risk.`,
        "",
        "Return STRICT JSON:",
        `{
  "orderedTiers": ["Good","Better","Best"],
  "hiddenTiers": string[],
  "cta": "book_now" | "send_photos" | "needs_review",
  "adjustments": [
    { "tier": "Good|Better|Best", "action": "increase_price" | "remove_item", "amount": number, "note": string }
  ],
  "pathEcho": "quote_now" | "need_photos" | "needs_human"
}`,
      ].join("\n"),
  },

  // 6A) Compose Quote (LLM → Markdown) — used when pathEcho = quote_now
  {
    id: "compose-quote",
    title: "Compose Quote (if quote_now)",
    description:
      "Markdown customer quote for shown tiers, short and friendly.",
    system:
      "You write concise, friendly Markdown. Output Markdown only (no fences).",
    promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
      [
        "Presentation JSON (with orderedTiers & cta):",
        previousStepOutput,
        "",
        "Original inquiry (tone cues):",
        '"""',
        customerMessage,
        '"""',
        "",
        "Write a short Markdown quote:",
        "- H2 title with job type (infer) e.g., '## Driveway & Patio Cleaning — Draft Quote'",
        "- 3–4 value bullets tailored to likely pillars (longevity/safety/scheduling).",
        "- Itemized tiers shown (in chosen order) with **Subtotal** lines, excluding hidden tiers.",
        "- Close with a single CTA sentence matched to `cta` ('Reply to hold Mon 2–4pm', etc.).",
      ].join("\n"),
  },

  // 6B) Compose Photo Request (LLM → Markdown) — used when pathEcho = need_photos
  {
    id: "compose-photo-request",
    title: "Compose Photo Request (if need_photos)",
    description:
      "Markdown guide asking for 2–3 photos to reduce uncertainty.",
    system:
      "You give clear, friendly instructions. Output Markdown only (no fences).",
    promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
      [
        "Presentation JSON (pathEcho should be 'need_photos'):",
        previousStepOutput,
        "",
        "Use the inquiry to tailor what photos to ask for:",
        '"""',
        customerMessage,
        '"""',
        "",
        "Write a concise Markdown note:",
        "- H3 title 'Quick Photos to Finalize Your Quote'",
        "- Bulleted list of 3 specific shots (wide area, close-up of stain, access/water spigot).",
        "- One line about why it helps (accuracy, discounts if area is smaller).",
        "- Closing line with channel choice (email/SMS).",
      ].join("\n"),
  },

  // 6C) Compose Human Review Summary (LLM → Markdown) — used when pathEcho = needs_human
  {
    id: "compose-human-summary",
    title: "Compose Human Review Summary (if needs_human)",
    description:
      "Markdown summary for internal reviewer: risks/ambiguities and a suggested next step.",
    system:
      "You produce a crisp internal note. Output Markdown only (no fences).",
    promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
      [
        "Presentation JSON (pathEcho should be 'needs_human'):",
        previousStepOutput,
        "",
        "Original inquiry (for context):",
        '"""',
        customerMessage,
        '"""',
        "",
        "Write an internal Markdown summary:",
        "- H3 'Manual Review Needed'",
        "- Bullets: risks/ambiguities; what to verify; a suggested call/email script (1–2 lines).",
        "- Keep under 120 words.",
      ].join("\n"),
  },
];
