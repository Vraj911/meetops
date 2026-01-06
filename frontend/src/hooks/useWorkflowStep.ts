import { useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/constants";

const workflowSteps = [
  { path: ROUTES.UPLOAD, label: "Upload", step: 1 },
  { path: ROUTES.PROCESSING, label: "Processing", step: 2 },
  { path: ROUTES.REVIEW, label: "Review", step: 3 },
  { path: ROUTES.RESULT, label: "Result", step: 4 },
];

export function useWorkflowStep() {
  const location = useLocation();
  const currentStep = workflowSteps.find(step => step.path === location.pathname);
  const currentStepIndex = currentStep ? currentStep.step - 1 : -1;
  const totalSteps = workflowSteps.length;

  const isInWorkflow = currentStep !== undefined;
  const nextStep = currentStepIndex < totalSteps - 1 ? workflowSteps[currentStepIndex + 1] : null;
  const prevStep = currentStepIndex > 0 ? workflowSteps[currentStepIndex - 1] : null;

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isInWorkflow,
    nextStep,
    prevStep,
    workflowSteps,
  };
}

