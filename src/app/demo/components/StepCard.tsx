"use client";

import ReactMarkdown from "react-markdown";
import { ChevronDown, Play } from "lucide-react";
import type { WorkflowStepDefinition } from "@/lib/workflows/types";

type RunState = "idle" | "running" | "done" | "error";

type GraphNode = {
  idx: number;
  stepId: string;
  dependsOn: string[];
  stage: string;
  requiredPath?: "buy_now" | "value" | "hesitant" | "disqualify";
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

const PATH_LABELS: Record<"buy_now" | "value" | "hesitant" | "disqualify", string> = {
  buy_now: "Buy-now recovery",
  value: "Value reassurance",
  hesitant: "Hesitant nurture",
  disqualify: "Decline & referral",
};

export type StepCardProps = {
  node: GraphNode;
  config?: WorkflowStepDefinition;
  status?: RunState;
  output?: string;
  error?: string;
  peekOpen: boolean;
  onTogglePeek: (stepId: string) => void;
  onRunStep: (stepId: string) => Promise<{ success: boolean; output?: string }>;
  canRun: boolean;
  isLast: boolean;
  lockedReason?: string;
  isNext: boolean;
  displayIndex: string;
};

export default function StepCard({
  node,
  config,
  status,
  output,
  error,
  peekOpen,
  onTogglePeek,
  onRunStep,
  canRun,
  isLast,
  lockedReason,
  isNext,
  displayIndex,
}: StepCardProps) {
  const safeStatus: RunState = status ?? "idle";
  const highlight = isNext && safeStatus !== "done" && safeStatus !== "running";
  const badges = config?.badges ?? [];
  const constraints = config?.constraints ?? [];
  const gradientClass = config?.gradientClass ?? "from-slate-200 via-slate-300 to-slate-400";

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
            <span
              className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradientClass} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-sm`}
            >
              {node.stage}
            </span>
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
              <div className="flex gap-2 flex-nowrap overflow-x-auto max-w-full">
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
              <button
                type="button"
                onClick={() => {
                  void onRunStep(node.stepId);
                }}
                disabled={
                  safeStatus === "running" || safeStatus === "done" || !canRun
                }
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-300"
              >
                <Play className="h-4 w-4" />
                {safeStatus === "running"
                  ? "Running…"
                  : safeStatus === "done"
                  ? "Completed"
                  : canRun
                  ? "Run Step"
                  : "Locked"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
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
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                STATUS_STYLES[safeStatus]
              }`}
            >
              {STATUS_LABELS[safeStatus]}
            </span>
          </div>

          {peekOpen && (
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Guardrails
                </p>
                {constraints.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    {constraints.map((item) => (
                      <li key={item} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No guardrails documented.</p>
                )}
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
