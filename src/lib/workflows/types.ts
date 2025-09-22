export type WorkflowPromptContext = {
  customerMessage: string;
  previousStepOutput?: string;
};

export interface WorkflowStepLayoutHints {
  position: { x: number; y: number };
  lane?: string;
}

export interface WorkflowStepDefinition {
  title: string;
  description?: string;
  system?: string;
  promptTemplate: (input: WorkflowPromptContext) => string;
  dependsOn?: string[];
  requiredPath?: string;
  layout?: WorkflowStepLayoutHints;
}

export interface WorkflowBranchDefinition {
  label: string;
  resultStepId: string;
}

export interface WorkflowDefinition {
  entryStepId: string;
  branchDecisionStepId: string;
  stepOrder: string[];
  steps: Record<string, WorkflowStepDefinition>;
  branches: Record<string, WorkflowBranchDefinition>;
}
