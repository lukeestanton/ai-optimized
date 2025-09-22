"use client";

export default function BranchPlaceholder({ guardrailsCompleted }: { guardrailsCompleted: boolean }) {
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
          ? "Guardrails picked a path. Trigger the automation to send the revival note."
          : "Guardrails will route this lead to a buy-now push, value reassurance, nurture step, or referral."}
      </div>
    </div>
  );
}

