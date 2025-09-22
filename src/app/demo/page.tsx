"use client";

import Header from "./header";
import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Mail,
  Clock,
  Tag,
  ShieldAlert,
  ChevronDown,
  Play,
  Zap,
  GitBranch,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import {
  inquiryToQuoteWorkflow,
  MARGIN_FLOOR_PCT,
} from "@/lib/workflows/inquiryToQuote";
import type { WorkflowStepDefinition } from "@/lib/workflows/types";

async function callAI(args: { system?: string; prompt: string }) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Request failed: ${res.status}`);
  }

  const data = (await res.json()) as { output: string };
  return data.output;
}

type RunState = "idle" | "running" | "done" | "error";
type StepRunResult = { success: boolean; output?: string };
type StepRunOptions = {
  bypassGuards?: boolean;
  existingOutputs?: Record<string, string>;
};
type BranchPath = "quote_now" | "need_photos" | "needs_human";

type GraphNode = {
  idx: number;
  stepId: string;
  dependsOn: string[];
  stage: string;
  requiredPath?: BranchPath;
};

const GRAPH_SPEC: GraphNode[] = [
  { idx: 1, stepId: "extract-features", dependsOn: [], stage: "Intake" },
  { idx: 2, stepId: "decide-path", dependsOn: ["extract-features"], stage: "Routing" },
  { idx: 3, stepId: "estimate-scope", dependsOn: ["decide-path"], stage: "Scope" },
  { idx: 4, stepId: "price-job", dependsOn: ["estimate-scope"], stage: "Pricing" },
  {
    idx: 5,
    stepId: "guardrails-present",
    dependsOn: ["price-job"],
    stage: "Guardrails",
  },
  {
    idx: 6,
    stepId: "compose-quote",
    dependsOn: ["guardrails-present"],
    stage: "Automations",
    requiredPath: "quote_now",
  },
  {
    idx: 7,
    stepId: "compose-photo-request",
    dependsOn: ["guardrails-present"],
    stage: "Automations",
    requiredPath: "need_photos",
  },
  {
    idx: 8,
    stepId: "compose-human-summary",
    dependsOn: ["guardrails-present"],
    stage: "Automations",
    requiredPath: "needs_human",
  },
];

const STEP_BADGES: Record<string, string[]> = {
  "extract-features": ["LLM", "Pricebook"],
  "decide-path": ["LLM", "Routing"],
  "estimate-scope": ["LLM", "Heuristics"],
  "price-job": ["LLM", "Pricing"],
  "guardrails-present": ["LLM", "Guardrails"],
  "compose-quote": ["LLM", "Customer Comms"],
  "compose-photo-request": ["LLM", "Photo Workflow"],
  "compose-human-summary": ["LLM", "Human Handoff"],
};

const STEP_CONSTRAINTS: Record<string, string[]> = {
  "extract-features": [
    "Parse the messy inquiry into normalized JSON",
    "Capture who, what, quantities, and deadlines",
    "Be resilient to typos or missing details",
    "Flag ambiguous addresses and missing fields",
  ],
  "decide-path": [
    "Choose quote_now, need_photos, or needs_human",
    "Return rationale and messaging pillars",
    "Prefer human review for risky or unclear jobs",
    "Route to photo request when surfaces lack clarity",
  ],
  "estimate-scope": [
    "Estimate square footage and crew hours with heuristics",
    "Round sqft to the nearest 10 and hours to 0.1",
    "Document assumptions for missing information",
    "Boost labor for heavy stains or special handling",
  ],
  "price-job": [
    "Build Good/Better/Best pricing tiers",
    "Calculate internal labor, chemical, travel, misc",
    "Expose margin percentage for each tier",
    "Add value bullets to support upsells",
  ],
  "guardrails-present": [
    "Enforce the minimum margin guardrail",
    "Select the CTA that matches the decision path",
    "Hide tiers that violate guardrails",
    "Suggest adjustments when a tier misses targets",
  ],
  "compose-quote": [
    "Create a friendly Markdown quote",
    "Respect the tier ordering from guardrails",
    "Close with an on-brand booking CTA",
    "Keep the copy brief and actionable",
  ],
  "compose-photo-request": [
    "Request 2–3 specific confirmation photos",
    "Explain why images unblock accurate pricing",
    "Match tone to the original inquiry",
    "Close with clear next-step instructions",
  ],
  "compose-human-summary": [
    "Summarize risks for the human reviewer",
    "Suggest what to verify before quoting",
    "Provide a quick outreach script",
    "Keep the note under 120 words",
  ],
};

const STATUS_LABELS: Record<RunState, string> = {
  idle: "Ready",
  running: "Running",
  done: "Complete",
  error: "Needs attention",
};

const STATUS_STYLES: Record<RunState, string> = {
  idle: "bg-slate-100 text-slate-600",
  running: "bg-blue-50 text-blue-600",
  done: "bg-emerald-50 text-emerald-600",
  error: "bg-rose-50 text-rose-600",
};

const PATH_LABELS: Record<BranchPath, string> = {
  quote_now: "Instant quote",
  need_photos: "Request photos",
  needs_human: "Human review",
};

const CTA_LABELS: Record<string, string> = {
  book_now: "Book now",
  send_photos: "Request photos",
  needs_review: "Manual review",
};

type GuardrailsDecision = {
  path?: BranchPath;
  pathEcho?: BranchPath;
  cta?: string;
  hiddenTiers?: string[];
  adjustments?: Array<{ tier?: string }>;
};

type StepCardProps = {
  node: GraphNode;
  config?: WorkflowStepDefinition;
  status?: RunState;
  output?: string;
  error?: string;
  peekOpen: boolean;
  onTogglePeek: (stepId: string) => void;
  onRunStep: (stepId: string) => Promise<StepRunResult>;
  canRun: boolean;
  badges: string[];
  constraints: string[];
  isLast: boolean;
  lockedReason?: string;
  isNext: boolean;
  displayIndex: string;
};

function StepCard({
  node,
  config,
  status,
  output,
  error,
  peekOpen,
  onTogglePeek,
  onRunStep,
  canRun,
  badges,
  constraints,
  isLast,
  lockedReason,
  isNext,
  displayIndex,
}: StepCardProps) {
  const safeStatus: RunState = status ?? "idle";
  const highlight = isNext && safeStatus !== "done" && safeStatus !== "running";

  return (
    <div className="relative pl-10">
      {!isLast && (
        <span className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-200" aria-hidden="true" />
      )}
      <span
        className={`absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold ${
          safeStatus === "done"
            ? "border-emerald-400 text-emerald-600"
            : safeStatus === "running"
            ? "border-blue-400 text-blue-600"
            : safeStatus === "error"
            ? "border-rose-300 text-rose-600"
            : "border-slate-200 text-slate-500"
        }`}
        aria-hidden="true"
      >
        {displayIndex}
      </span>

      <div
        className={`flex-1 rounded-2xl border bg-white shadow-sm transition-shadow ${
          highlight ? "border-blue-300 shadow-md ring-1 ring-blue-100" : "border-slate-200"
        }`}
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              {node.stage}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {config?.title ?? `Step ${displayIndex}`}
            </h3>
            {config?.description && (
              <p className="text-sm leading-relaxed text-slate-500">{config.description}</p>
            )}
            {node.requiredPath && (
              <p className="text-xs text-slate-500">
                Active when path = {" "}
                <span className="font-medium text-slate-700">{PATH_LABELS[node.requiredPath]}</span>
              </p>
            )}
            {lockedReason && safeStatus !== "done" && safeStatus !== "running" && (
              <p className="text-xs text-amber-600">{lockedReason}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  STATUS_STYLES[safeStatus]
                }`}
              >
                {STATUS_LABELS[safeStatus]}
              </span>
              <button
                type="button"
                onClick={() => {
                  void onRunStep(node.stepId);
                }}
                disabled={
                  safeStatus === "running" || safeStatus === "done" || !canRun
                }
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                <Play className="h-4 w-4" />
                {safeStatus === "running"
                  ? "Running…"
                  : safeStatus === "done"
                  ? "Completed"
                  : canRun
                  ? "Run with AI"
                  : "Locked"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={() => onTogglePeek(node.stepId)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            aria-expanded={peekOpen}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${peekOpen ? "rotate-180" : ""}`}
            />
            View run log
          </button>

          {peekOpen && (
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Guardrails
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {constraints.map((item) => (
                    <li key={item} className="leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Output
                </p>
                <div className="mt-2 text-sm text-slate-600">
                  {safeStatus === "error" ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-rose-700">
                      {error || "Step failed."}
                    </div>
                  ) : safeStatus === "running" ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
                      Running AI step…
                    </div>
                  ) : output ? (
                    <div className="prose prose-sm max-w-none rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-900">
                      <ReactMarkdown>{output}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                      No output yet. Run the step to preview the transcript.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BranchPlaceholder({ guardrailsCompleted }: { guardrailsCompleted: boolean }) {
  return (
    <div className="relative pl-10">
      <span className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-200" aria-hidden="true" />
      <span
        className={`absolute left-0 top-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed bg-white text-xs font-semibold ${
          guardrailsCompleted ? "border-blue-300 text-blue-500" : "border-slate-300 text-slate-400"
        }`}
        aria-hidden="true"
      >
        6
      </span>
      <div
        className={`rounded-2xl border border-dashed px-5 py-4 text-sm leading-relaxed ${
          guardrailsCompleted
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-slate-50 text-slate-500"
        }`}
      >
        {guardrailsCompleted
          ? "Guardrails picked a path. Trigger the automation to ship the final output."
          : "Guardrails will route this inquiry to an instant quote, a photo request, or a human review summary."}
      </div>
    </div>
  );
}

export default function QuoteToOrderAutopilotDemo() {
  const workflow = inquiryToQuoteWorkflow;
  const decisionStepId = workflow.branchDecisionStepId;

  const [peekOpen, setPeekOpen] = useState<Record<string, boolean>>({});
  const togglePeek = useCallback(
    (stepId: string) => setPeekOpen((prev) => ({ ...prev, [stepId]: !prev[stepId] })),
    []
  );

  const [intakeOpen, setIntakeOpen] = useState(true);

  const [customerMessage, setCustomerMessage] = useState<string>(
    "I spilled 200 gallons of expired barbecue sauce across my driveway during a tailgate experiment gone wrong. Can you blast it clean by this Friday? The raccoons won't leave."
  );

  const [stepStatus, setStepStatus] = useState<Record<string, RunState>>({});
  const [stepOutput, setStepOutput] = useState<Record<string, string>>({});
  const [stepError, setStepError] = useState<Record<string, string>>({});

  const stepConfigs = useMemo(
    () =>
      GRAPH_SPEC.reduce<Record<string, WorkflowStepDefinition | undefined>>((acc, node) => {
        acc[node.stepId] = workflow.steps[node.stepId];
        return acc;
      }, {}),
    [workflow]
  );

  const decisionOutput = stepOutput[decisionStepId];

  const guardrailsDecision = useMemo<GuardrailsDecision | undefined>(() => {
    if (!decisionOutput) return undefined;
    try {
      return JSON.parse(decisionOutput) as GuardrailsDecision;
    } catch {
      return undefined;
    }
  }, [decisionOutput]);

  const selectedPath = useMemo<BranchPath | undefined>(() => {
    const rawPath = guardrailsDecision?.pathEcho ?? guardrailsDecision?.path;
    if (!rawPath) return undefined;
    return rawPath in workflow.branches ? (rawPath as BranchPath) : undefined;
  }, [guardrailsDecision, workflow.branches]);

  const canRunStep = useCallback(
    (stepId: string): boolean => {
      const status = stepStatus[stepId];
      if (status === "done" || status === "running") {
        return false;
      }

      const stepDef = workflow.steps[stepId];
      if (!stepDef) return false;

      if (stepDef.requiredPath) {
        if (stepStatus[decisionStepId] !== "done") {
          return false;
        }
        if (!selectedPath || selectedPath !== stepDef.requiredPath) {
          return false;
        }
      }

      for (const depId of stepDef.dependsOn ?? []) {
        if (stepStatus[depId] !== "done") {
          return false;
        }
      }

      return true;
    },
    [decisionStepId, selectedPath, stepStatus, workflow.steps]
  );

  const runStep = useCallback(
    async (stepId: string, options: StepRunOptions = {}): Promise<StepRunResult> => {
      const { bypassGuards = false, existingOutputs } = options;
      const stepDef = workflow.steps[stepId];
      if (!stepDef) {
        return { success: false };
      }

      if (!bypassGuards) {
        const status = stepStatus[stepId];
        if (status === "running" || status === "done") {
          return { success: false };
        }
        if (!canRunStep(stepId)) {
          const requirementMessage =
            stepDef.requiredPath && selectedPath && selectedPath !== stepDef.requiredPath
              ? "This step is gated by a different branch."
              : "Complete prerequisite steps first.";
          setStepError((prev) => ({ ...prev, [stepId]: requirementMessage }));
          return { success: false };
        }
      }

      setPeekOpen((prev) => ({ ...prev, [stepId]: true }));
      setStepStatus((prev) => ({ ...prev, [stepId]: "running" }));
      setStepError((prev) => ({ ...prev, [stepId]: "" }));

      try {
        const dependsOn = stepDef.dependsOn ?? [];
        const outputsSource = existingOutputs ?? stepOutput;
        const previousStepOutput =
          dependsOn.length > 0 ? outputsSource[dependsOn[dependsOn.length - 1]] : undefined;

        const prompt = stepDef.promptTemplate({
          customerMessage,
          previousStepOutput,
        });

        const output = await callAI({ system: stepDef.system, prompt });

        setStepOutput((prev) => ({ ...prev, [stepId]: output }));
        setStepStatus((prev) => ({ ...prev, [stepId]: "done" }));

        if (existingOutputs) {
          existingOutputs[stepId] = output;
        }

        return { success: true, output };
      } catch (err: unknown) {
        setStepError((prev) => ({
          ...prev,
          [stepId]: err instanceof Error ? err.message : "Unknown error",
        }));
        setStepStatus((prev) => ({ ...prev, [stepId]: "error" }));
        return { success: false };
      }
    },
    [workflow.steps, stepStatus, canRunStep, selectedPath, customerMessage, stepOutput]
  );

  const runAllSteps = useCallback(async () => {
    setStepStatus({});
    setStepError({});
    setStepOutput({});
    setPeekOpen({});

    const outputs: Record<string, string> = {};
    const baseSteps = workflow.stepOrder.filter((stepId) => {
      const stepDef = workflow.steps[stepId];
      return stepDef && !stepDef.requiredPath;
    });

    for (const stepId of baseSteps) {
      const result = await runStep(stepId, { bypassGuards: true, existingOutputs: outputs });
      if (!result.success) {
        return;
      }
    }

    const decision = outputs[decisionStepId];
    if (!decision) return;

    try {
      const parsed = JSON.parse(decision) as GuardrailsDecision;
      const branch = (parsed.pathEcho ?? parsed.path) as BranchPath | undefined;
      if (!branch) return;
      const branchDef = workflow.branches[branch];
      if (!branchDef) return;
      await runStep(branchDef.resultStepId, {
        bypassGuards: true,
        existingOutputs: outputs,
      });
    } catch {
      // ignore JSON parse failures when auto-running
    }
  }, [decisionStepId, workflow, runStep]);

  const readiness = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const node of GRAPH_SPEC) {
      map[node.stepId] = canRunStep(node.stepId);
    }
    return map;
  }, [canRunStep]);

  const getLockedReason = useCallback(
    (node: GraphNode): string | undefined => {
      if (stepStatus[node.stepId] === "done" || stepStatus[node.stepId] === "running") {
        return undefined;
      }

      if (node.requiredPath) {
        if (stepStatus[decisionStepId] !== "done") {
          return "Complete guardrails to unlock branch automations.";
        }
        if (!selectedPath) {
          return "Waiting for guardrails decision.";
        }
        if (selectedPath !== node.requiredPath) {
          return `Current path: ${PATH_LABELS[selectedPath]}.`;
        }
      }

      for (const depId of node.dependsOn) {
        if (stepStatus[depId] !== "done") {
          const depConfig = workflow.steps[depId];
          return depConfig
            ? `Complete ${depConfig.title} first.`
            : "Complete prerequisite step first.";
        }
      }

      return undefined;
    },
    [decisionStepId, selectedPath, stepStatus, workflow.steps]
  );

  const primaryNodes = GRAPH_SPEC.filter((node) => !node.requiredPath);
  const branchNodes = GRAPH_SPEC.filter((node) => node.requiredPath);

  const nextStep = useMemo(() => {
    for (const node of GRAPH_SPEC) {
      if (readiness[node.stepId]) {
        return node;
      }
    }
    return undefined;
  }, [readiness]);

  const guardrailsCompleted = stepStatus[decisionStepId] === "done";
  const completedPrimary = primaryNodes.filter(
    (node) => stepStatus[node.stepId] === "done"
  ).length;

  const hiddenTiers = Array.isArray(guardrailsDecision?.hiddenTiers)
    ? guardrailsDecision?.hiddenTiers
    : undefined;
  const adjustmentsCount = Array.isArray(guardrailsDecision?.adjustments)
    ? guardrailsDecision?.adjustments.length
    : 0;

  const activeBranchNode = branchNodes.find(
    (node) => node.requiredPath && selectedPath && node.requiredPath === selectedPath
  );

  const activeBranchStatus = activeBranchNode
    ? stepStatus[activeBranchNode.stepId]
    : undefined;
  const activeBranchOutput = activeBranchNode
    ? stepOutput[activeBranchNode.stepId]
    : undefined;
  const activeBranchError = activeBranchNode
    ? stepError[activeBranchNode.stepId]
    : undefined;

  const resetRun = useCallback(() => {
    setStepStatus({});
    setStepError({});
    setStepOutput({});
    setPeekOpen({});
  }, []);

  const decisionStepStatus = stepStatus[decisionStepId];
  const decisionStepOutput = decisionOutput;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-6 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                  Live orchestration
                </p>
                <h1 className="text-2xl font-semibold">
                  Inquiry-to-Quote Autopilot
                </h1>
                <p className="text-sm text-slate-300">
                  Follow each automation stage just like the Zapier platform—edit the
                  intake, run steps, and inspect guardrails before the final handoff.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={runAllSteps}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-white/20"
                >
                  <Play className="h-4 w-4" /> Run entire demo
                </button>
                <button
                  type="button"
                  onClick={resetRun}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" /> Reset state
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 px-6 py-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <ListChecks className="mt-1 h-5 w-5 text-slate-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Progress
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {completedPrimary} / {primaryNodes.length} core steps complete
                </p>
                <p className="text-xs text-slate-500">
                  Run them individually or orchestrate the full journey.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <GitBranch className="mt-1 h-5 w-5 text-slate-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Branch
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedPath ? PATH_LABELS[selectedPath] : "Pending guardrails"}
                </p>
                <p className="text-xs text-slate-500">
                  Guardrails choose the automation after pricing completes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <Zap className="mt-1 h-5 w-5 text-slate-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Next step
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {nextStep
                    ? stepConfigs[nextStep.stepId]?.title ?? `Step ${nextStep.idx}`
                    : "All steps complete"}
                </p>
                <p className="text-xs text-slate-500">
                  {nextStep ? "Ready to run now." : "Outputs are ready below."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Intake queue
                </p>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">1 inbox message</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-5 px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <ShieldAlert className="h-3.5 w-3.5" /> Guardrails
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <Clock className="h-3.5 w-3.5" /> SLA 2h
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <Tag className="h-3.5 w-3.5" /> Powerwash
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIntakeOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">John Doe</p>
                        <p className="text-xs text-slate-500">EML-4812 • 2:15 PM</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        intakeOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {intakeOpen && (
                    <div className="space-y-3 border-t border-slate-100 px-4 py-4">
                      <label
                        htmlFor="customerMessage"
                        className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500"
                      >
                        Customer inquiry
                      </label>
                      <textarea
                        id="customerMessage"
                        name="customerMessage"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
                        rows={5}
                        value={customerMessage}
                        onChange={(e) => setCustomerMessage(e.target.value)}
                      />
                      <p className="text-xs text-slate-500">
                        This message feeds Step 1 and cascades through the entire workflow.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                Guardrails snapshot
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Margin floor</span>
                  <span className="font-semibold text-slate-900">{MARGIN_FLOOR_PCT}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Decision path</span>
                  <span className="font-semibold text-slate-900">
                    {selectedPath ? PATH_LABELS[selectedPath] : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CTA</span>
                  <span className="font-semibold text-slate-900">
                    {guardrailsDecision?.cta
                      ? CTA_LABELS[guardrailsDecision.cta] ?? guardrailsDecision.cta
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Adjustments</span>
                  <span className="font-semibold text-slate-900">{adjustmentsCount}</span>
                </div>
                {hiddenTiers && (
                  <p className="text-xs text-slate-500">
                    Hidden tiers: {hiddenTiers.length > 0 ? hiddenTiers.join(", ") : "None"}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Guardrails status: {guardrailsCompleted ? "Complete" : "Not yet run"}
                </p>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Orchestration timeline
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Demo steps
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runAllSteps}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <Play className="h-4 w-4" /> Run all
                </button>
                <button
                  type="button"
                  onClick={resetRun}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
            </div>

            <div className="space-y-10 px-6 py-6">
              {primaryNodes.map((node, index) => (
                <StepCard
                  key={node.stepId}
                  node={node}
                  config={stepConfigs[node.stepId]}
                  status={stepStatus[node.stepId]}
                  output={stepOutput[node.stepId]}
                  error={stepError[node.stepId]}
                  peekOpen={!!peekOpen[node.stepId]}
                  onTogglePeek={togglePeek}
                  onRunStep={runStep}
                  canRun={readiness[node.stepId]}
                  badges={STEP_BADGES[node.stepId] ?? []}
                  constraints={STEP_CONSTRAINTS[node.stepId] ?? []}
                  isLast={false}
                  lockedReason={getLockedReason(node)}
                  isNext={nextStep?.stepId === node.stepId}
                  displayIndex={`${index + 1}`}
                />
              ))}

              {activeBranchNode ? (
                <StepCard
                  node={activeBranchNode}
                  config={stepConfigs[activeBranchNode.stepId]}
                  status={activeBranchStatus}
                  output={activeBranchOutput}
                  error={activeBranchError}
                  peekOpen={!!peekOpen[activeBranchNode.stepId]}
                  onTogglePeek={togglePeek}
                  onRunStep={runStep}
                  canRun={readiness[activeBranchNode.stepId]}
                  badges={STEP_BADGES[activeBranchNode.stepId] ?? []}
                  constraints={STEP_CONSTRAINTS[activeBranchNode.stepId] ?? []}
                  isLast
                  lockedReason={getLockedReason(activeBranchNode)}
                  isNext={nextStep?.stepId === activeBranchNode.stepId}
                  displayIndex="6"
                />
              ) : (
                <BranchPlaceholder guardrailsCompleted={guardrailsCompleted} />
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                Customer artifact
              </p>
              <h2 className="text-lg font-semibold text-slate-900">Final output</h2>
            </div>
            {selectedPath && (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <GitBranch className="h-3.5 w-3.5" /> {PATH_LABELS[selectedPath]}
              </span>
            )}
          </div>
          <div className="space-y-4 px-6 py-6 text-sm text-slate-600">
            {activeBranchNode ? (
              activeBranchStatus === "error" ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
                  {activeBranchError || "The automation failed. Rerun the step to retry."}
                </div>
              ) : activeBranchStatus === "running" ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  Generating the final artifact…
                </div>
              ) : activeBranchStatus === "done" && activeBranchOutput ? (
                <div className="prose prose-sm max-w-none rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-slate-900">
                  <ReactMarkdown>{activeBranchOutput}</ReactMarkdown>
                </div>
              ) : guardrailsCompleted ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  Run the branch automation to surface the customer-facing output here.
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  Complete the guardrails step to unlock the branch automation.
                </div>
              )
            ) : stepStatus[decisionStepId] === "done" && decisionStepOutput ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Guardrails decision JSON
                </p>
                <pre className="max-h-[320px] overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-100">
                  {decisionStepOutput}
                </pre>
              </>
            ) : decisionStepStatus === "running" ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                Guardrails are still evaluating the pricing outputs…
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                Progress through the workflow to preview the final customer deliverable here.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
