export type StepRunState = "idle" | "running" | "done" | "error";

export type StepUIState = {
  status: StepRunState;
  output?: string;
  error?: string;
  expanded?: boolean;
};
