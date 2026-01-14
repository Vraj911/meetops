import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMeetingStore } from "@/stores/meeting.store";
import { ROUTES } from "@/lib/constants";

const workflowSteps = [
  { path: ROUTES.UPLOAD, label: "Upload", step: 1 },
  { path: ROUTES.PROCESSING, label: "Processing", step: 2 },
  { path: ROUTES.REVIEW, label: "Review", step: 3 },
  { path: ROUTES.RESULT, label: "Result", step: 4 }
];

/**
 * Enforce meeting workflow based on meeting status
 * 
 * Rules:
 * - No meetingId → redirect to /upload
 * - status === DRAFTED → allow only /upload or /processing
 * - status === UPLOADED → allow only /processing
 * - status === PROCESSING → allow only /processing
 * - status === REVIEW → allow only /review
 * - status === APPROVED → allow /result
 */
function useWorkflowStep() {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingId, status } = useMeetingStore();

  const currentStep = workflowSteps.find((step) => step.path === location.pathname);
  const currentStepIndex = currentStep ? currentStep.step - 1 : -1;
  const totalSteps = workflowSteps.length;
  const isInWorkflow = currentStep !== void 0;
  const nextStep = currentStepIndex < totalSteps - 1 ? workflowSteps[currentStepIndex + 1] : null;
  const prevStep = currentStepIndex > 0 ? workflowSteps[currentStepIndex - 1] : null;

  // Enforce workflow rules
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If no meetingId, must be at upload page
    if (!meetingId && currentPath !== ROUTES.UPLOAD) {
      navigate(ROUTES.UPLOAD);
      return;
    }

    // Skip enforcement if at upload page with no meetingId
    if (!meetingId && currentPath === ROUTES.UPLOAD) {
      return;
    }

    // Enforce status-based access rules
    switch (status) {
      case "DRAFT":
      case "UPLOADED":
        // Allow only processing page
        if (currentPath !== ROUTES.PROCESSING) {
          navigate(ROUTES.PROCESSING);
        }
        break;

      case "PROCESSING":
        // Allow only processing page
        if (currentPath !== ROUTES.PROCESSING) {
          navigate(ROUTES.PROCESSING);
        }
        break;

      case "REVIEW":
        // Allow only review page
        if (currentPath !== ROUTES.REVIEW) {
          navigate(ROUTES.REVIEW);
        }
        break;

      case "APPROVED":
        // Allow result page
        if (currentPath !== ROUTES.RESULT && currentPath !== ROUTES.REVIEW) {
          navigate(ROUTES.RESULT);
        }
        break;

      default:
        break;
    }
  }, [meetingId, status, location.pathname, navigate]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isInWorkflow,
    nextStep,
    prevStep,
    workflowSteps
  };
}
export {
  useWorkflowStep
};
