"use client";

import Header from "./header";
import { useState, useCallback, useMemo } from "react";
import { inquiryBranchDemoSteps } from "@/lib/workflows/inquiryToQuote";
import ReactMarkdown from "react-markdown";
import {
  Mail,
  Clock,
  Tag,
  ShieldAlert,
  ChevronDown,
  Play,
} from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// --- Fetch helper for your /api/ai route ---
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

// Custom node component for workflow steps
function StepNode({ data }: { data: any }) {
  const { stepIndex, stepConfig, stepStatus, stepOutput, stepError, peekOpen, onRunStep, onTogglePeek, canRunStep } = data;
  
  const statusColors = {
    idle: "bg-slate-100 text-slate-700",
    running: "bg-sky-100 text-sky-700", 
    done: "bg-emerald-100 text-emerald-700",
    error: "bg-rose-100 text-rose-700"
  };

  const gradientColors = [
    "from-blue-500 to-orange-500",
    "from-green-500 to-blue-500", 
    "from-purple-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500"
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 min-w-[300px] relative">
      {/* Target handle - where edges come IN (top of node) */}
      {stepIndex > 1 && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#555' }}
        />
      )}
      
      {/* Source handle - where edges go OUT (bottom of node) */}
      {stepIndex < 5 && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-md bg-gradient-to-r ${gradientColors[stepIndex - 1]}`}></div>
          <div className="font-bold text-slate-900">{stepConfig.title}</div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[stepStatus[stepIndex] as keyof typeof statusColors] || statusColors.idle}`}>
            {stepStatus[stepIndex]?.toUpperCase() || "IDLE"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRunStep(stepIndex)}
            disabled={stepStatus[stepIndex] === "running" || !canRunStep(stepIndex)}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-md disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />{" "}
            {stepStatus[stepIndex] === "running"
              ? "Running…"
              : stepStatus[stepIndex] === "done"
              ? "Completed"
              : !canRunStep(stepIndex)
              ? `Complete Step ${stepIndex - 1} First`
              : "Run with AI"}
          </button>
          <div className="text-xs text-slate-600">
            {stepStatus[stepIndex] === "done"
              ? "✓"
              : stepStatus[stepIndex] === "error"
              ? "!"
              : "—"}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {stepIndex === 1 && ["LLM", "Pricebook"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        {stepIndex === 2 && ["LLM", "Address API"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        {stepIndex === 3 && ["LLM", "Pricing Engine"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        {stepIndex === 4 && ["LLM", "Pricing Engine"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        {stepIndex === 5 && ["LLM", "Guardrails"].map((t) => (
          <span key={t} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          aria-expanded={!!peekOpen[stepIndex]}
          onClick={() => onTogglePeek(stepIndex)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              peekOpen[stepIndex] ? "rotate-180" : ""
            }`}
          />{" "}
          Peek
        </button>

        {peekOpen[stepIndex] && (
          <div className="mt-2 text-xs text-slate-700">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">
                  Constraints
                </div>
                <div className="space-y-1 text-xs">
                  {stepIndex === 1 && (
                    <>
                      <div>• Extract key facts from customer inquiry</div>
                      <div>• Identify who, what, quantities, deadlines</div>
                      <div>• Be concise and robust to typos</div>
                      <div>• Return bullet list format</div>
                      <div>• Note missing information</div>
                    </>
                  )}
                  {stepIndex === 2 && (
                    <>
                      <div>• Validate address format and existence</div>
                      <div>• Check for typos and suggest corrections</div>
                      <div>• Verify service area coverage</div>
                      <div>• Return validation status and details</div>
                    </>
                  )}
                  {stepIndex === 3 && (
                    <>
                      <div>• Estimate project scope and complexity</div>
                      <div>• Calculate time requirements</div>
                      <div>• Consider equipment and labor needs</div>
                      <div>• Account for travel and setup time</div>
                    </>
                  )}
                  {stepIndex === 4 && (
                    <>
                      <div>• Create itemized pricing breakdown</div>
                      <div>• Estimate internal costs (labor, chemicals, travel)</div>
                      <div>• Calculate margin percentage</div>
                      <div>• Include pricing notes and assumptions</div>
                    </>
                  )}
                  {stepIndex === 5 && (
                    <>
                      <div>• Enforce margin ≥ 22% guardrail</div>
                      <div>• Flag jobs requiring human review</div>
                      <div>• Compose customer-ready Markdown quote</div>
                      <div>• Suggest pricing adjustments if needed</div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-2">
                  Outputs
                </div>

                {stepStatus[stepIndex] === "error" ? (
                  <div className="text-rose-700 bg-rose-50 rounded-md p-2">
                    {stepError[stepIndex] || "Step failed."}
                  </div>
                ) : stepStatus[stepIndex] === "running" ? (
                  <div className="text-slate-600 bg-slate-50 rounded-md p-2">
                    Running AI step...
                  </div>
                ) : stepOutput[stepIndex] ? (
                  <div className="bg-slate-50 rounded-md p-2 prose prose-sm max-w-none text-slate-900">
                    <ReactMarkdown>
                      {stepOutput[stepIndex]}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-slate-500 bg-slate-50 rounded-md p-2">
                    No output yet. Click &quot;Run with AI&quot;.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  stepNode: StepNode,
};

export default function QuoteToOrderAutopilotDemo() {
  // Peek panel toggles by visual step index (1..5)
  const [peekOpen, setPeekOpen] = useState<Record<number, boolean>>({});
  const togglePeek = useCallback((stepIndex: number) =>
    setPeekOpen((prev) => ({ ...prev, [stepIndex]: !prev[stepIndex] })), []);

  // Intake dropdown toggle
  const [intakeOpen, setIntakeOpen] = useState(true);

  // Intake text that feeds Step 1's promptTemplate
  const [customerMessage, setCustomerMessage] = useState<string>(
    "I spilled 200 gallons of expired barbecue sauce across my driveway during a tailgate experiment gone wrong. Can you blast it clean by this Friday? The raccoons won't leave."
  );

  // Per-step run status/output/error keyed by visual step index
  const [stepStatus, setStepStatus] = useState<Record<number, RunState>>({});
  const [stepOutput, setStepOutput] = useState<Record<number, string>>({});
  const [stepError, setStepError] = useState<Record<number, string>>({});

  // Data-driven graph spec (indexes map to UI state keys)
  type RequiredPath = "quote_now" | "need_photos" | "needs_human" | undefined;
  const graphSpec: Array<{
    idx: number;
    stepId: string;
    dependsOn: number[]; // indexes this node depends on
    requiredPath?: RequiredPath; // branch gating
    position: { x: number; y: number };
  }> = [
    { idx: 1, stepId: "extract-features", dependsOn: [], position: { x: 50, y: 50 } },
    { idx: 2, stepId: "decide-path", dependsOn: [1], position: { x: 50, y: 300 } },
    { idx: 3, stepId: "estimate-scope", dependsOn: [2], position: { x: 50, y: 550 } },
    { idx: 4, stepId: "price-job", dependsOn: [3], position: { x: 50, y: 800 } },
    { idx: 5, stepId: "guardrails-present", dependsOn: [4], position: { x: 50, y: 1050 } },
    { idx: 6, stepId: "compose-quote", dependsOn: [5], requiredPath: "quote_now", position: { x: 350, y: 1250 } },
    { idx: 7, stepId: "compose-photo-request", dependsOn: [5], requiredPath: "need_photos", position: { x: 50, y: 1250 } },
    { idx: 8, stepId: "compose-human-summary", dependsOn: [5], requiredPath: "needs_human", position: { x: -250, y: 1250 } },
  ];

  // Visual index -> workflow config
  const stepConfigs: Record<number, (typeof inquiryBranchDemoSteps)[number] | undefined> = graphSpec.reduce((acc, node) => {
    acc[node.idx] = inquiryBranchDemoSteps.find((s) => s.id === node.stepId);
    return acc;
  }, {} as Record<number, (typeof inquiryBranchDemoSteps)[number] | undefined>);

  // Determine selected path from step 5 output (guardrails-present)
  const selectedPath = useMemo<"quote_now" | "need_photos" | "needs_human" | undefined>(() => {
    const raw = stepOutput[5];
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return (parsed.pathEcho || parsed.path) as any;
    } catch {
      return undefined;
    }
  }, [stepOutput[5]]);

  // Check if a step can be run (previous step must be completed, and step itself must not be completed)
  const canRunStep = useCallback((stepIndex: number): boolean => {
    // If step is already completed, it can't be run again
    if (stepStatus[stepIndex] === "done") return false;
    
    const spec = graphSpec.find((n) => n.idx === stepIndex);
    if (!spec) return false;

    // Branch gating
    if (spec.requiredPath) {
      if (stepStatus[5] !== "done") return false;
      if (!selectedPath || selectedPath !== spec.requiredPath) return false;
    }

    // All dependencies must be done
    for (const dep of spec.dependsOn) {
      if (stepStatus[dep] !== "done") return false;
    }
    return true;
  }, [stepStatus, selectedPath]);

  // Single-step runner
  const runStep = useCallback(async (stepIndex: number) => {
    const cfg = stepConfigs[stepIndex];
    if (!cfg) return;

    // Check if step can be run
    if (!canRunStep(stepIndex)) {
      setStepError((p) => ({
        ...p,
        [stepIndex]: "Previous step must be completed first",
      }));
      return;
    }

    // Open peek panel immediately so user can see progress
    setPeekOpen((prev) => ({ ...prev, [stepIndex]: true }));
    
    setStepStatus((p) => ({ ...p, [stepIndex]: "running" }));
    setStepError((p) => ({ ...p, [stepIndex]: "" }));

    try {
      // Get previous step's output for chaining
      let previousStepOutput: string | undefined = undefined;
      if (stepIndex > 1) {
        if (stepIndex >= 6 && stepIndex <= 8) {
          previousStepOutput = stepOutput[5];
        } else {
          previousStepOutput = stepOutput[stepIndex - 1];
        }
      }
      
      const prompt = cfg.promptTemplate({ 
        customerMessage, 
        previousStepOutput 
      });
      const output = await callAI({ system: cfg.system, prompt });
      setStepOutput((p) => ({ ...p, [stepIndex]: output }));
      setStepStatus((p) => ({ ...p, [stepIndex]: "done" }));
    } catch (err: unknown) {
      setStepError((p) => ({
        ...p,
        [stepIndex]: err instanceof Error ? err.message : "Unknown error",
      }));
      setStepStatus((p) => ({ ...p, [stepIndex]: "error" }));
    }
  }, [stepConfigs, canRunStep, customerMessage, stepOutput, setPeekOpen, setStepStatus, setStepError, setStepOutput]);

  // Run all steps sequentially, chaining outputs internally
  const runAllSteps = useCallback(async () => {
    // Reset statuses for a fresh run
    setStepStatus({});
    setStepError({});
    setStepOutput({});

    let previousOutput: string | undefined = undefined;
    // Run 1..5
    for (let idx = 1; idx <= 5; idx++) {
      const cfg = stepConfigs[idx];
      if (!cfg) continue;

      // Open peek and set running state
      setPeekOpen((prev) => ({ ...prev, [idx]: true }));
      setStepStatus((p) => ({ ...p, [idx]: "running" }));
      setStepError((p) => ({ ...p, [idx]: "" }));

      try {
        const prompt = cfg.promptTemplate({
          customerMessage,
          previousStepOutput: previousOutput,
        });
        const output = await callAI({ system: cfg.system, prompt });
        previousOutput = output;
        setStepOutput((p) => ({ ...p, [idx]: output }));
        setStepStatus((p) => ({ ...p, [idx]: "done" }));
      } catch (err: unknown) {
        setStepError((p) => ({
          ...p,
          [idx]: err instanceof Error ? err.message : "Unknown error",
        }));
        setStepStatus((p) => ({ ...p, [idx]: "error" }));
        // Stop the chain on error
        break;
      }
    }

    // Determine branch and run only the applicable compose step
    let path: "quote_now" | "need_photos" | "needs_human" | undefined;
    if (previousOutput) {
      try {
        const parsed = JSON.parse(previousOutput);
        path = (parsed.pathEcho || parsed.path) as any;
      } catch {}
    }
    const branchIdx = graphSpec.find((n) => n.requiredPath && n.requiredPath === path)?.idx;
    if (branchIdx) {
      const cfg = stepConfigs[branchIdx];
      if (cfg) {
        const idx = branchIdx;
        setPeekOpen((prev) => ({ ...prev, [idx]: true }));
        setStepStatus((p) => ({ ...p, [idx]: "running" }));
        setStepError((p) => ({ ...p, [idx]: "" }));
        try {
          const prompt = cfg.promptTemplate({
            customerMessage,
            previousStepOutput: previousOutput,
          });
          const output = await callAI({ system: cfg.system, prompt });
          setStepOutput((p) => ({ ...p, [idx]: output }));
          setStepStatus((p) => ({ ...p, [idx]: "done" }));
        } catch (err: unknown) {
          setStepError((p) => ({
            ...p,
            [idx]: err instanceof Error ? err.message : "Unknown error",
          }));
          setStepStatus((p) => ({ ...p, [idx]: "error" }));
        }
      }
    }
  }, [customerMessage, setPeekOpen, setStepError, setStepOutput, setStepStatus, stepConfigs]);

  // ReactFlow setup from graphSpec
  const initialNodes: Node[] = graphSpec.map((n) => ({
    id: String(n.idx),
    type: "stepNode",
    position: n.position,
    data: {
      stepIndex: n.idx,
      stepConfig: stepConfigs[n.idx],
      stepStatus,
      stepOutput,
      stepError,
      peekOpen,
      onRunStep: runStep,
      onTogglePeek: togglePeek,
      canRunStep,
    },
  }));

  const initialEdges: Edge[] = graphSpec.flatMap((n) =>
    n.dependsOn.map((dep) => ({ id: `e${dep}-${n.idx}`, source: String(dep), target: String(n.idx), animated: true }))
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when state changes
  const updatedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        stepStatus,
        stepOutput,
        stepError,
        peekOpen,
        canRunStep,
      },
    }));
  }, [nodes, stepStatus, stepOutput, stepError, peekOpen, canRunStep]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Needs Action Strip */}
      <div className="bg-orange-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="font-century-gothic-black text-slate-800">
              Needs Action
            </div>
            <div className="text-xs text-slate-600">
              Steps awaiting review — not blocked by output
            </div>
          </div>
        </div>
      </div>

      {/* Main Console */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Intake Queue (25%) */}
          <section className="col-span-12 lg:col-span-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-century-gothic-black text-slate-900">
                  Intake Queue
                </h2>
                <span className="text-xs text-slate-500">1 queued</span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-2 py-1">
                  <Mail className="h-3.5 w-3.5" /> Source
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-2 py-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Confidence
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-2 py-1">
                  <Clock className="h-3.5 w-3.5" /> SLA
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full px-2 py-1">
                  <Tag className="h-3.5 w-3.5" /> Tag
                </span>
              </div>

              {/* Guardrails line */}
              <div className="text-[11px] text-slate-600 mb-3">
                Guardrails: margin ≥ 22% requires review • travel &gt; 20mi requires review
              </div>

              {/* Queue List */}
              <div className="space-y-3">
                {[
                  {
                    id: "EML-4812",
                    source: "email",
                    sender: "John Doe",
                    received: "2:15 PM",
                    message: customerMessage,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md flex items-center justify-center bg-blue-50 text-blue-600">
                            <Mail className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">
                              {item.sender}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.id} • {item.received}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIntakeOpen(!intakeOpen)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              intakeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {intakeOpen && (
                      <div className="border-t border-slate-100 p-3">
                        <div className="text-[11px] uppercase text-slate-500 font-bold mb-2">
                          Message Details
                        </div>
                        <textarea
                          id="customerMessage"
                          name="customerMessage"
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900 resize-none"
                          rows={4}
                          value={customerMessage}
                          onChange={(e) => setCustomerMessage(e.target.value)}
                          placeholder="Edit the customer message here..."
                        />
                        <div className="mt-1 text-[11px] text-slate-500">
                          This message will be passed to the workflow steps.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Center: Steps Timeline (75%) */}
          <section className="col-span-12 lg:col-span-9">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-century-gothic-black text-slate-900">
              Steps
            </h2>
                      <button
                onClick={runAllSteps}
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md"
                      type="button"
              >
                <Play className="h-3.5 w-3.5" /> Run All
                    </button>
                            </div>
            <div className="h-[800px] w-full">
              <ReactFlow
                nodes={updatedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50"
              >
                <Controls />
                <Background />
              </ReactFlow>
                    </div>
          </section>
                  </div>

        {/* Final Output Section - Below Steps */}
        <section className="mt-8">
            <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
              <button className="font-century-gothic-black text-slate-900 border-b-2 border-blue-500 -mb-px py-2 px-1">
                Completed Jobs
                    </button>
                          </div>

            {(stepStatus[6] === "done" && stepOutput[6]) ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[11px] uppercase text-slate-500 font-bold mb-3">
                  Final Output
                            </div>
                <div className="prose prose-sm max-w-none text-slate-900">
                                <ReactMarkdown>
                    {stepOutput[6]}
                                </ReactMarkdown>
                              </div>
                              </div>
            ) : (stepStatus[7] === "done" && stepOutput[7]) ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[11px] uppercase text-slate-500 font-bold mb-3">
                  Final Output
                          </div>
                <div className="prose prose-sm max-w-none text-slate-900">
                                <ReactMarkdown>
                    {stepOutput[7]}
                                </ReactMarkdown>
                              </div>
                              </div>
            ) : (stepStatus[8] === "done" && stepOutput[8]) ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[11px] uppercase text-slate-500 font-bold mb-3">
                  Final Output
                          </div>
                <div className="prose prose-sm max-w-none text-slate-900">
                                <ReactMarkdown>
                    {stepOutput[8]}
                                </ReactMarkdown>
                              </div>
                              </div>
            ) : (stepStatus[5] === "done" && stepOutput[5]) ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[11px] uppercase text-slate-500 font-bold mb-3">
                  Decision
                </div>
                <div className="prose prose-sm max-w-none text-slate-900">
                  <ReactMarkdown>
                    {stepOutput[5]}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center">
                <div className="text-slate-500 text-sm">
                  {stepStatus[5] === "running" 
                    ? "Generating final quote..." 
                    : "Complete all steps to see final quote here."}
                </div>
              </div>
            )}
          </section>
      </main>
    </div>
  );
}
