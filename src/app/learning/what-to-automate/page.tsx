import type { Metadata } from "next";
import ResourcePageTemplate, { ResourcePageContent } from "@/components/ResourcePageTemplate";

export const metadata: Metadata = {
    title: "5 Processes to Automate Today | AI Optimized",
    description:
        "Five quick-win automations that compound across revenue, support, and operations, shippable in days, not months.",
};

const content: ResourcePageContent = {
    breadcrumbs: [
        { label: "Resources", href: "/resources" },
        { label: "5 things to automate today" },
    ],
    hero: {
        eyebrow: "LEARN",
        title: "5 Processes to Automate Today",
        description:
            "These fast, low-risk automations deliver measurable lift without rearchitecting your stack. They’re the same patterns we use to get teams shipping in under two weeks.",
        updatedAt: "Sep 2025",
        readTime: "3 min read",
        category: "Resources",
        actions: [
            { label: "Book a working session", href: "/demo" },
            { label: "See a live workflow", href: "/demo", variant: "secondary" },
        ],
    },
    sections: [],
    article: {
        blocks: [
            { type: "paragraph", text: "Chances are, you’re already juggling countless tools to keep your business running. And, let's face it, a lot of your time is probably spent manually moving data between them. That may work when things are simple, but as your processes get more and more complex (and they definitely will), those manual processes start to slow you down, cause errors, and eat into growth." },
            { type: "paragraph", text: "That’s where AI Optimized comes in. Instead of DIY automations, we design custom-built AI workflows that actually understand your business, your data, and your customers. Our custom AI workflows not only streamline operations, but they also spot opportunities, reduce errors, and free up your team to focus on what matters most." },
            { type: "paragraph", text: "Whether you’re just starting to explore automation or ready to scale across your entire business, here are five example workflows that can transform how you work. Today." },
            { type: "divider" },

            { type: "heading", level: 2, text: "1) Act on Leads Instantly" },
            { type: "paragraph", text: "When a new lead shows interest, speed is everything. With AI Optimized, you don’t just notify the team; you take action. Our workflows enrich each lead with context, score them against your ideal customer profile, and route them directly to the right owner with tasks ready to go. Instead of waiting hours or days, you’re ready to engage within minutes." },
            { type: "callout", title: "Observed impact", text: "+18% conversion to meeting; minutes saved per lead quickly add up." },
            { type: "divider" },

            { type: "heading", level: 2, text: "2) Respond to Support Requests with Guardrails" },
            { type: "paragraph", text: "Support teams are often flooded with repetitive questions that still require thoughtful answers. Our workflows draft empathetic, knowledge-based responses automatically, while still flagging high-risk or sensitive cases for human review. The result: your team handles more tickets in less time without losing the personal touch." },
            { type: "callout", title: "Observed impact", text: "-25–35% handle time; more consistent replies without losing tone." },
            { type: "divider" },

            { type: "heading", level: 2, text: "3) Turn Meetings into CRM Updates" },
            { type: "paragraph", text: "Too often, valuable details from customer calls get lost in recordings or never make it back into the CRM. Our workflows convert meeting notes into structured updates: summaries scoped to deal stage, action items with owners and deadlines, and clean field updates synced directly to your CRM. That means less admin work and more pipeline accuracy." },
            { type: "divider" },

            { type: "heading", level: 2, text: "4) Make Knowledge Search Actually Useful" },
            { type: "paragraph", text: "Documentation, support tickets, and release notes usually live in silos, leaving your team searching across multiple systems. We unify them into a single AI-powered search that returns cited, reliable answers. Freshness checks keep outdated information from misleading your team, and when confidence is low, queries can automatically escalate to a human expert." },
            { type: "divider" },

            { type: "heading", level: 2, text: "5) Automate Data Hygiene in the Background" },
            { type: "paragraph", text: "Messy data is a hidden cost that compounds every day. Our workflows run nightly checks to flag missing fields, duplicates, or policy risks, opening tasks with suggested fixes so your team stays compliant and efficient. That means clean data without endless manual cleanup sessions." },
            { type: "quote", text: "Ship value quickly, then layer sophistication. Velocity builds belief.", cite: "AI Optimized" },
            { type: "divider" },

            { type: "heading", level: 2, text: "How to Pilot in a Week" },
            { type: "paragraph", text: "You don’t need a massive rollout to get started. We recommend piloting one workflow with clear guardrails and success metrics before scaling. The goal isn’t perfection on day one; it’s proving measurable value quickly and then building momentum." },
            {
                type: "list", ordered: true, items: [
                    "Pick one workflow and define success (a single metric).",
                    "Wire minimal data sources: mock what you can.",
                    "Set guardrails: approval steps, audit logs, fallbacks.",
                    "Run a time-boxed trial with 5–10 users.",
                    "Review outcomes, document gaps, plan iteration 2.",
                ]
            },
        ],
    },

    bottomCta: {
        title: "Want this tailored to your stack?",
        description:
            "Bring your CRM, help desk, and data sources. We’ll co‑design a minimal, governed pilot and hand you the rollout plan.",
        primary: { label: "Book a working session", href: "/demo" },
        secondary: { label: "See a live workflow", href: "/demo" },
    },
};

export default function FiveThingsToAutomateTodayPage() {
    return <ResourcePageTemplate content={content} />;
}


