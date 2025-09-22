export type StepRunState = "idle" | "running" | "done" | "error";

export type StepUIState = {
  status: StepRunState; // reflects the lifecycle in the UI
  output?: string;      // text returned from /api/ai
  error?: string;       // error message if it failed
  expanded?: boolean;   // for your "peek panel" toggle
};
