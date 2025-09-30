// Demo test just for loom. Remove later.
"use client";

import Header from "@/components/HeaderLegacy";
import { useCallback, useMemo, useState } from "react";
import StepCard from "./components/StepCard";
import BranchPlaceholder from "./components/BranchPlaceholder";
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
type BranchPath = "buy_now" | "value" | "hesitant" | "disqualify";

type GraphNode = {
  idx: number;
  stepId: string;
  dependsOn: string[];
  stage: string;
  requiredPath?: BranchPath;
};

const GRAPH_SPEC: GraphNode[] = [
  { idx: 1, stepId: "extract-signals", dependsOn: [], stage: "Signal Intake" },
  { idx: 2, stepId: "decide-path", dependsOn: ["extract-signals"], stage: "Routing" },
  { idx: 3, stepId: "scope-to-price", dependsOn: ["decide-path"], stage: "Scoping" },
  { idx: 4, stepId: "build-tiers", dependsOn: ["scope-to-price"], stage: "Offer Design" },
  {
    idx: 5,
    stepId: "guardrails-offer",
    dependsOn: ["build-tiers"],
    stage: "Guardrails",
  },
  {
    idx: 6,
    stepId: "compose-offer-email",
    dependsOn: ["guardrails-offer"],
    stage: "Automation",
    requiredPath: "buy_now",
  },
  {
    idx: 7,
    stepId: "compose-value-email",
    dependsOn: ["guardrails-offer"],
    stage: "Automation",
    requiredPath: "value",
  },
  {
    idx: 8,
    stepId: "compose-nurture-step",
    dependsOn: ["guardrails-offer"],
    stage: "Automation",
    requiredPath: "hesitant",
  },
  {
    idx: 9,
    stepId: "compose-referral-note",
    dependsOn: ["guardrails-offer"],
    stage: "Automation",
    requiredPath: "disqualify",
  },
];

const PATH_LABELS: Record<BranchPath, string> = {
  buy_now: "Buy-now recovery",
  value: "Value reassurance",
  hesitant: "Hesitant nurture",
  disqualify: "Decline & referral",
};

const CTA_LABELS: Record<string, string> = {
  book_first_mow: "Book first mow",
  schedule_walkthrough: "Schedule walkthrough",
  start_nurture: "Start nurture cadence",
  send_referral: "Send referral",
};

type GuardrailsDecision = {
  path?: BranchPath;
  pathEcho?: BranchPath;
  cta?: string;
  hiddenTiers?: string[];
  incentives?: string[];
  adjustments?: Array<{ tier?: string; action?: string; note?: string; amount?: number | null }>;
};

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
    "Hey there, this is Marcus from 18 Cedar Brook. You sent over a mowing plan in April but we never booked. The lawn is looking rough again, the backyard slope is overgrown, and we'd like it sorted before the neighborhood block party in two weeks. Another company dangled $65/week if we lock in bi-weekly service. Could you match that or give us a reason to stay with you?"
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

      // Do not auto-open or auto-close run logs on step start
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
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-orange-500 px-6 py-6 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                  Workflow
                </p>
                <h1 className="text-2xl font-semibold">
                  Lawn Care Inquiry-to-Quote Autopilot
                </h1>
                <p className="text-sm text-white">
                  Watch the workflow revive a price-sensitive mowing lead: consume the signals, lock pricing, and ship a polished follow-up from one console.
                </p>
              </div>
            {/* Buttons removed per request; controls remain in the timeline section below */}
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
                  Guardrails select the revival motion once the offer aligns with targets.
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
                    <Tag className="h-3.5 w-3.5" /> Lawn care
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
                  <span className="font-semibold text-slate-900">%</span>
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
                isLast
                lockedReason={getLockedReason(activeBranchNode)}
                isNext={nextStep?.stepId === activeBranchNode.stepId}
                displayIndex={`${primaryNodes.length + 1}`}
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
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-slate-900">
                  <pre className="whitespace-pre-wrap text-sm">{activeBranchOutput}</pre>
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
