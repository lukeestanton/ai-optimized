// Original complex workflow backed up in ./backup/inquiryToQuote.ts

import { WorkflowDefinition } from "./types";

// TODO: Implement your new workflow logic here
export const inquiryToQuoteWorkflow: WorkflowDefinition = {
  entryStepId: "placeholder",
  branchDecisionStepId: "placeholder",
  stepOrder: ["placeholder"],
  steps: {
    placeholder: {
      title: "Placeholder Step",
      description: "Replace this with your new workflow logic",
      system: "You are a helpful assistant.",
      promptTemplate: ({ customerMessage }) => 
        `Process this message: ${customerMessage}`,
      badges: ["TODO"],
      gradientClass: "from-gray-400 to-gray-500",
    },
  },
  branches: {},
};