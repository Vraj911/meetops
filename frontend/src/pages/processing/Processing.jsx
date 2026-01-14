import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { useMeetingStore } from "@/stores/meeting.store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
function Processing() {
  const navigate = useNavigate();
  const { meetingId, status, startMeeting, fetchMeeting } = useMeetingStore();
  const [processingError, setProcessingError] = useState(null);
  useEffect(() => {
    if (!meetingId) {
      navigate(ROUTES.UPLOAD);
      return;
    }
    let isMounted = true;
    let pollInterval = null;

    const handleProcessing = async () => {
      try {
        setProcessingError(null);
        // Start the meeting processing
        await startMeeting();
        
        if (!isMounted) return;

        // Poll for status updates every 2 seconds
        pollInterval = setInterval(async () => {
          try {
            await fetchMeeting();
          } catch (err) {
            console.error("Poll error:", err);
          }
        }, 2000);
      } catch (err) {
        if (isMounted) {
          setProcessingError(err.message || "Processing failed");
          console.error("Processing error:", err);
        }
      }
    };

    handleProcessing();

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [meetingId, navigate, startMeeting, fetchMeeting]);

  // Navigate to review when status changes to REVIEW
  useEffect(() => {
    if (status === "REVIEW") {
      navigate(ROUTES.REVIEW);
    }
  }, [status, navigate]);
  return <div className="max-w-2xl mx-auto space-y-8 animate-fade-in"><div className="text-center space-y-2"><h1 className="text-3xl font-semibold">Processing Meeting</h1><p className="text-muted-foreground">Processing meeting transcript</p><p className="text-sm text-muted-foreground">Estimated completion: 1-2 minutes</p>{processingError && <p className="text-sm text-destructive">{processingError}</p>}</div><div className="bg-card border border-border rounded-lg p-6 space-y-6"><div className="flex items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin text-primary" /><p className="text-lg font-medium">Processing your meeting...</p></div></div></div>;
}
export {
  Processing as default
};
