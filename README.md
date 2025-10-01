## AI Optimized

AI Optimized – “AI Workflow Implementation for Your Business” – is a Next.js 15 + React 19 application that pairs a multi-section marketing site with an interactive inquiry-to-quote automation demo for demo video to showcase guardrailed AI workflows.

## Highlights

- **Sticky mega-navigation**: catalogs services, strategies, resources, live demos, and workflows while keeping a “Get Free Proposal” CTA visible across the site.
- **Conversion-focused hero**: blends value messaging, lead-capture form, and rotating testimonials to establish credibility above the fold.
- **“How it Works”**: combines an embedded Loom explainer with a narrative on human-in-the-loop automation for complex processes.
- **21-day pilot timeline**: outlines the draft→build→prove→autopilot journey for prospects evaluating implementation speed.
- **Industry use-case switcher**: surfaces seven verticalized workflow case studies with step-by-step breakdowns and quantified impact.
- **About and footer**: reinforce the team’s expertise and supply resource hubs for deeper exploration.
- **Quote-to-order demo console**: orchestrates the entire workflow, exposes guardrail decisions, and renders customer-ready outputs with branch-specific automation.
- **Workflow definitions**: encode prompt templates, guardrails, dependency graphs, and branch logic, providing a blueprint for extending the automation library.

## Tech Stack & Architecture

- **Frameworks**: Next.js 15 with Turbopack scripts, React 19, and TypeScript.
- **Styling**: Tailwind CSS 4 with global Century Gothic typography and custom scrollbars set in `globals.css`.
- **Icons & UI**: Lucide icons, React Markdown rendering, and bespoke timeline/step components.
- **AI Integration**: OpenAI SDK powers the `/api/ai` route used by the demo’s step runner.
- **API Protection**: An Upstash-backed rate limiter shields `/api/ai` from excessive traffic while remaining serverless-frien
dly.
- **Module Resolution**: Path alias `@/*` simplifies imports across `src`.

## Project Structure

```text
src/
  app/
    page.tsx            # Landing page assembly
    layout.tsx          # Metadata, font, and global styles
    globals.css         # Tailwind + custom theme tokens
    api/ai/route.ts     # Serverless proxy to OpenAI chat completions
    demo/               # Quote-to-order workflow console
  components/           # Marketing page sections & shared UI
  lib/
    workflows/          # Workflow definitions and types
    types.ts            # Shared state types
```

## Getting Started

### Install dependencies

Use your preferred Node package manager (e.g., `npm install`) to pull the modules defined in `package.json` before running any scripts.

### Set environment variables

Create `.env.local` (or equivalent) and provide:

- `OPENAI_API_KEY` so the `/api/ai` route can authenticate with OpenAI.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the server-side rate limiter. When omitted, rate limiting is disabled for local development.
- Optional knobs for tuning limits: `RATE_LIMIT_REQUESTS` (default `20`) and `RATE_LIMIT_WINDOW_MINUTES` (default `1`).

### Run the development server

```bash
npm run dev
```

Starts Next.js with Turbopack and hot reloading.

### Build & serve production output

```bash
npm run build
npm run start
```

Build uses Turbopack; `next start` serves the compiled app.

### Lint the project

```bash
npm run lint
```

Runs ESLint with the Next.js TypeScript configuration.

## Using the Quote-to-Order Demo

Navigate to `/demo` (linked from the header’s “Live Demos” menu) to open the “Lawn Care Revival Playbook.”

The intake panel lets you edit the sample customer inquiry; the guardrails snapshot mirrors real-time decisions (margin floor, CTA, tier adjustments).

“Run all” executes the core path in order, while each step card can be triggered individually to inspect guardrails, prompts, and outputs. Locked steps explain prerequisites or branch requirements, and Markdown-rendered transcripts appear in-line.

After guardrails finish, branch-specific automations (buy-now/value/hesitant/disqualify) become available; the final artifact panel displays the generated customer communication or JSON decision trace.

## Workflow Configuration

`src/lib/workflows/inquiryToQuote.ts` defines the Revenue Rescuer workflow: ordered steps, branch metadata, prompt templates, guardrail constraints, and the global margin floor constant used in the UI.

Each `WorkflowStepDefinition` declares dependencies, required branch, guardrail badges, and prompt builder, enabling the demo to enforce orchestration rules declared in `WorkflowDefinition` and `WorkflowBranchDefinition` types.

To author new workflows, mirror this structure: add a definition file under `src/lib/workflows`, import it into the demo page, and update the UI to surface branch-specific outputs.

## Styling & UX

Global Tailwind layers set background/foreground tokens, typography, scrollbar styling, and smooth scrolling, while the root layout injects the Century Gothic font from Google Fonts and a custom SVG favicon.

Marketing sections rely on bespoke gradients, responsive grids, and hover states to drive engagement without external UI kits.
