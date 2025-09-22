// Revenue Rescuer Workflow — Abandoned Lead Revival for Lawn Mowing
import { WorkflowDefinition } from "./types";

export const MARGIN_FLOOR_PCT = 24;

export const inquiryToQuoteWorkflow: WorkflowDefinition = {
  entryStepId: "extract-signals",
  branchDecisionStepId: "guardrails-offer",
  stepOrder: [
    "extract-signals",
    "decide-path",
    "scope-to-price",
    "build-tiers",
    "guardrails-offer",
    "compose-offer-email",
    "compose-value-email",
    "compose-nurture-step",
    "compose-referral-note",
  ],
  branches: {
    buy_now: {
      label: "Buy-now recovery",
      resultStepId: "compose-offer-email",
    },
    value: {
      label: "Value reassurance",
      resultStepId: "compose-value-email",
    },
    hesitant: {
      label: "Hesitant nurture",
      resultStepId: "compose-nurture-step",
    },
    disqualify: {
      label: "Decline & referral",
      resultStepId: "compose-referral-note",
    },
  },
  steps: {
    "extract-signals": {
      title: "Extract Signals",
      description:
        "Pull revival-worthy signals from the abandoned lead to prep smart routing.",
      system:
        "You are a revenue recovery intake parser for a premium lawn care operator. Output strict JSON only.",
      badges: ["LLM", "RevOps"],
      constraints: [
        "Do not invent details—mark unclear data as null or \"unknown\"",
        "Capture blockers and timing cues explicitly mentioned",
        "Surface any hints about prior service levels or expectations",
        "Stay consistent across leads so downstream pricing is stable",
      ],
      gradientClass: "from-emerald-500 via-lime-500 to-green-600",
      promptTemplate: ({ customerMessage }) =>
        [
          "Lead transcript / CRM note:",
          '"""',
          customerMessage,
          '"""',
          "",
          "Extract the recovery signals needed to revive an abandoned lawn mowing lead.",
          "- Flag blockers like competitor quotes, bad past experience, budget caps, HOA notices, or access issues.",
          "- Timing should reflect upcoming weather, events, or season stage (e.g., spring kickoff, mid-season).",
          "Return STRICT JSON (no code fences):",
          `{
  "intent": "renewal" | "price_check" | "shopping" | "urgent_fix" | "unknown",
  "readiness": "hot" | "warm" | "cool" | "unknown",
  "priceSensitivity": "none" | "moderate" | "high" | "unknown",
  "blockers": string[],
  "surfaceHints": string[],
  "timing": { "requestedWindow": string | null, "seasonStage": string | null },
  "contextNotes": string[]
}`,
        ].join("\n"),
    },
    "decide-path": {
      title: "Decide Path",
      description:
        "Choose the right revival playbook with rationale and messaging pillars.",
      system:
        "You are a lifecycle strategist reviving lawn mowing leads. Output strict JSON only.",
      badges: ["LLM", "Routing"],
      constraints: [
        "Pick exactly one path",
        "Tie rationale back to extracted signals",
        "Provide 3-5 messaging pillars anchored in lawn care outcomes",
        "Prefer disqualify only for non-fit or no-service zones",
      ],
      gradientClass: "from-amber-500 via-orange-500 to-amber-600",
      promptTemplate: ({ previousStepOutput = "{}" }) =>
        [
          "Signals JSON:",
          previousStepOutput,
          "",
          "Path rules:",
          "- buy_now: lead is urgent/ready, minimal blockers, trust intact. Aim to lock first cut ASAP.",
          "- value: price-sensitive but savable—requires ROI framing, maybe bundle savings.",
          "- hesitant: emotional or logistical friction that needs reassurance cadence before pitching price.",
          "- disqualify: outside territory, red-flag behavior, or economics untenable—hand off gracefully.",
          "Return STRICT JSON:",
          `{
  "path": "buy_now" | "value" | "hesitant" | "disqualify",
  "rationale": string,
  "pillars": [string, string, string]
}`,
        ].join("\n"),
      dependsOn: ["extract-signals"],
    },
    "scope-to-price": {
      title: "Scope to Price",
      description:
        "Infer lawn size, cadence, and crew plan with locked heuristics for pricing.",
      system:
        "You estimate recurring mowing scope with conservative, repeatable heuristics. Output strict JSON only.",
      badges: ["LLM", "Heuristics"],
      constraints: [
        "Use the same sqft + minutes heuristics every time",
        "Document assumptions you make for missing info",
        "Inflate effort for hills, obstacles, or overgrowth",
        "Never drop below a 45-minute minimum visit",
      ],
      gradientClass: "from-sky-500 via-blue-500 to-blue-600",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Decision JSON (path + pillars):",
          previousStepOutput,
          "",
          "Lead transcript for additional cues:",
          '"""',
          customerMessage,
          '"""',
          "",
          "Heuristics (apply consistently):",
          "- If footage unknown: town lot 8,500 sqft, suburb 12,000 sqft, estate 22,000 sqft.",
          "- Minutes per visit = (estimatedSqft / 250) + 15 setup; +20 if overgrown or many obstacles.",
          "- Crew size defaults to 2. Use 3 if sqft > 18,000 or terrain is sloped/complex.",
          "- Drive time default 20 minutes round trip unless timing notes suggest onsite crew.",
          "- Season length defaults 28 weeks; shorten to 20 for late-season, extend to 32 for year-round markets.",
          "Return STRICT JSON:",
          `{
  "estimatedSqft": number,
  "visitCadence": "weekly" | "biweekly" | "monthly" | "one_time",
  "seasonLengthWeeks": number,
  "minutesPerVisit": number,
  "crewSize": number,
  "driveMinutes": number,
  "terrain": "flat" | "sloped" | "obstructed",
  "assumptions": string[],
  "upsellAngles": string[]
}`,
        ].join("\n"),
      dependsOn: ["decide-path"],
    },
    "build-tiers": {
      title: "Tier Builder",
      description:
        "Lock Good/Better/Best mowing programs with stable unit economics.",
      system:
        "You produce lawn mowing offers with disciplined margin math. Output strict JSON only.",
      badges: ["LLM", "Pricing"],
      constraints: [
        "Base labor rate: $58 per crew hour (minutesPerVisit * crewSize / 60).",
        "Fuel+equipment reserve: $9 per visit + $0.004 per sqft.",
        "Drive cost: $0.55 per drive-minute * crewSize.",
        "Good: essential mow + trim. Better: add edging, blow-down, light bed touch-up. Best: include fertilization or shrub trim anchor upsell.",
        "Show per-visit price and season total; keep tier deltas within 18-28%.",
      ],
      gradientClass: "from-purple-500 via-indigo-500 to-purple-600",
      promptTemplate: ({ previousStepOutput = "{}" }) =>
        [
          "Scope JSON:",
          previousStepOutput,
          "",
          "Compute using the locked heuristics above. SeasonTotal = perVisit * seasonLengthWeeks (or visit count for 'one_time').",
          "Return STRICT JSON:",
          `{
  "tiers": [
    {
      "name": "Good",
      "perVisit": number,
      "seasonTotal": number,
      "lineItems": [{ "name": string, "price": number }],
      "estCost": { "labor": number, "fuel": number, "drive": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    },
    {
      "name": "Better",
      "perVisit": number,
      "seasonTotal": number,
      "lineItems": [{ "name": string, "price": number }],
      "estCost": { "labor": number, "fuel": number, "drive": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    },
    {
      "name": "Best",
      "perVisit": number,
      "seasonTotal": number,
      "lineItems": [{ "name": string, "price": number }],
      "estCost": { "labor": number, "fuel": number, "drive": number, "misc": number },
      "marginPct": number,
      "valueBullets": [string, string, string]
    }
  ],
  "notes": string[]
}`,
        ].join("\n"),
      dependsOn: ["scope-to-price"],
    },
    "guardrails-offer": {
      title: "Guardrails & Offer Strategy",
      description:
        "Protect margin, reorder tiers, add incentives, and pick the right CTA.",
      system:
        "You enforce guardrails for lawn mowing offers and prep the branch automation. Output strict JSON only.",
      badges: ["LLM", "Guardrails"],
      constraints: [
        `Enforce minimum margin: ${MARGIN_FLOOR_PCT}% or higher per tier`,
        "Add incentives only when path requires extra nudge",
        "Map CTA to the branch path (buy_now/value/hesitant/disqualify)",
        "Hide tiers that break strategy or economics",
      ],
      gradientClass: "from-rose-500 via-pink-500 to-rose-600",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Pricing JSON:",
          previousStepOutput,
          "",
          "Lead transcript for tone & urgency cues:",
          '"""',
          customerMessage,
          '"""',
          "",
          "Rules:",
          `- Any tier with marginPct < ${MARGIN_FLOOR_PCT}: recommend price increase or removing an add-on.`,
          "- Path mapping: buy_now → CTA 'book_first_mow'; value → CTA 'schedule_walkthrough'; hesitant → CTA 'start_nurture'; disqualify → CTA 'send_referral'.",
          "- Incentives: offer small add-ons (first cut free edging, skip-fee forgiveness) only when it helps close.",
          "Return STRICT JSON:",
          `{
  "orderedTiers": ["Good", "Better", "Best"],
  "hiddenTiers": string[],
  "cta": "book_first_mow" | "schedule_walkthrough" | "start_nurture" | "send_referral",
  "incentives": string[],
  "adjustments": [
    { "tier": "Good" | "Better" | "Best", "action": "increase_price" | "remove_item", "amount": number | null, "note": string }
  ],
  "pathEcho": "buy_now" | "value" | "hesitant" | "disqualify"
}`,
        ].join("\n"),
      dependsOn: ["build-tiers"],
    },
    "compose-offer-email": {
      title: "Compose Offer Email (buy_now)",
      description: "Write the polished revive email that locks in the first mow now.",
      system:
        "You are the frontline revenue rescuer. Write a persuasive, on-brand email. Output Markdown only (no fences).",
      badges: ["LLM", "Customer Comms"],
      constraints: [
        "Subject line + body—ready to paste",
        "Reference ordered tiers and incentives without exposing internal math",
        "Create an assertive CTA for immediate booking",
        "Keep under 220 words; sound like a premium lawn care crew",
      ],
      gradientClass: "from-green-500 via-teal-500 to-green-600",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Guardrail decision JSON:",
          previousStepOutput,
          "",
          "Original lead transcript (tone cues):",
          '"""',
          customerMessage,
          '"""',
          "",
          "Write the Markdown email:",
          "- Include a compelling subject line (Prefix with 'Subject:').",
          "- Greet the contact warmly, reference why the crew is following up now.",
          "- Summarize the recommended tier (top of orderedTiers) with plain-language value pillars.",
          "- Offer clear CTA aligned with `cta`.",
          "- Close with a confident sign-off from the crew lead.",
        ].join("\n"),
      dependsOn: ["guardrails-offer"],
      requiredPath: "buy_now",
    },
    "compose-value-email": {
      title: "Compose Offer Email (value)",
      description: "Reassure on value, frame savings, and prompt a softer conversion.",
      system:
        "You are a lawn care CSM converting value-seeking leads. Output Markdown only (no fences).",
      badges: ["LLM", "Customer Comms"],
      constraints: [
        "Lead with empathy on budget without discounting below guardrails",
        "Highlight total cost of ownership savings",
        "Propose the middle tier unless guardrails hide it",
        "Drive to a consult or walkthrough CTA",
      ],
      gradientClass: "from-cyan-500 via-blue-500 to-cyan-600",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Guardrail decision JSON:",
          previousStepOutput,
          "",
          "Lead transcript (for tone):",
          '"""',
          customerMessage,
          '"""',
          "",
          "Write the Markdown email:",
          "- Start with 'Subject:' and a trust-building line.",
          "- Restate lawn goals and stack 2-3 value pillars.",
          "- Present the suggested tier with per-visit economics (no internal costs).",
          "- Invite them to the walkthrough CTA with scheduling details.",
          "- End with a reassuring sign-off and reply instructions.",
        ].join("\n"),
      dependsOn: ["guardrails-offer"],
      requiredPath: "value",
    },
    "compose-nurture-step": {
      title: "Compose Nurture Touch (hesitant)",
      description: "Draft the drip step that rebuilds trust before reselling.",
      system:
        "You design short nurture copy for hesitant lawn leads. Output Markdown only (no fences).",
      badges: ["LLM", "Lifecycle"],
      constraints: [
        "Two short paragraphs max",
        "Acknowledge blocker, offer social proof, set gentle follow-up CTA",
        "Close with when the next touch will occur",
      ],
      gradientClass: "from-yellow-500 via-amber-500 to-yellow-600",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Guardrail decision JSON:",
          previousStepOutput,
          "",
          "Lead transcript:",
          '"""',
          customerMessage,
          '"""',
          "",
          "Write the Markdown nurture note (store in drip_step.md):",
          "- Friendly opener acknowledging their hesitation.",
          "- One testimonial or proof point tailored to their blocker.",
          "- Mention when the crew will check back in and how to reach out sooner.",
        ].join("\n"),
      dependsOn: ["guardrails-offer"],
      requiredPath: "hesitant",
    },
    "compose-referral-note": {
      title: "Compose Decline / Referral (disqualify)",
      description: "Close the loop gracefully and point them to a better-fit solution.",
      system:
        "You deliver respectful decline notes for out-of-fit lawn mowing leads. Output Markdown only (no fences).",
      badges: ["LLM", "CX"],
      constraints: [
        "Thank them and clarify the reason for the referral",
        "Offer vetted alternative or DIY tip",
        "Invite them to reach out if circumstances change",
        "Keep under 140 words",
      ],
      gradientClass: "from-slate-500 via-slate-600 to-slate-700",
      promptTemplate: ({ customerMessage, previousStepOutput = "{}" }) =>
        [
          "Guardrail decision JSON:",
          previousStepOutput,
          "",
          "Lead transcript for context:",
          '"""',
          customerMessage,
          '"""',
          "",
          "Write the Markdown reply (referral.md):",
          "- Subject line + body",
          "- Empathetic explanation of the mismatch",
          "- Provide a referral partner or alternative path",
          "- Close the loop with future-looking goodwill.",
        ].join("\n"),
      dependsOn: ["guardrails-offer"],
      requiredPath: "disqualify",
    },
  },
};
