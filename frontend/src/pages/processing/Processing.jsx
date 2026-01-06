import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { useMeetingStore } from "@/stores/meeting.store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
function Processing() {
  const navigate = useNavigate();
  const { meeting, processingSteps, isProcessing, startProcessing } = useMeetingStore();
  useEffect(() => {
    if (!meeting) {
      navigate(ROUTES.UPLOAD);
      return;
    }
    let isMounted = true;
    startProcessing().then(() => {
      if (isMounted) {
        setTimeout(() => navigate(ROUTES.REVIEW), 500);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [meeting, navigate, startProcessing]);
  return <div className="max-w-2xl mx-auto space-y-8 animate-fade-in"><div className="text-center space-y-2"><h1 className="text-3xl font-semibold">Processing Meeting</h1><p className="text-muted-foreground">{meeting?.title} • {meeting?.duration} • {meeting?.participants?.length || 5} participants</p><p className="text-sm text-muted-foreground">Estimated completion: 1-2 minutes</p></div><div className="bg-card border border-border rounded-lg p-6 space-y-6">{processingSteps.map((step, index) => <div key={step.id} className="flex items-start gap-4"><div className={cn(
    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
    step.status === "complete" && "bg-success text-success-foreground",
    step.status === "processing" && "bg-primary text-primary-foreground",
    step.status === "pending" && "bg-muted text-muted-foreground"
  )}>{step.status === "complete" ? <Check className="h-4 w-4" /> : step.status === "processing" ? <Loader2 className="h-4 w-4 animate-spin" /> : index + 1}</div><div className="flex-1 space-y-2"><div className="flex items-center justify-between"><span className={cn("font-medium", step.status === "pending" && "text-muted-foreground")}>{step.name}</span>{step.status !== "pending" && <span className="text-sm text-muted-foreground">{step.progress}%</span>}</div>{step.status === "processing" && <><div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${step.progress}%` }} /></div><p className="text-sm text-muted-foreground">{step.description}</p></>}</div></div>)}</div></div>;
}
export {
  Processing as default
};
