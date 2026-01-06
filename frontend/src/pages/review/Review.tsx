import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Save, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiPanel } from "@/components/chatbot/AiPanel";
import { useMeetingStore } from "@/stores/meeting.store";
import { useUIStore } from "@/stores/ui.store";
import { cn, getConfidenceLevel, formatConfidence } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export default function Review() {
  const navigate = useNavigate();
  const { meeting, summary, actionItems, transcript, syncToServices } = useMeetingStore();
  const { aiPanelOpen, setAiPanelOpen } = useUIStore();

  useEffect(() => {
    if (!summary) navigate(ROUTES.UPLOAD);
  }, [summary, navigate]);

  const handleSync = async () => {
    await syncToServices();
    navigate(ROUTES.RESULT);
  };

  if (!summary) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Review & Confirm</h1>
          <p className="text-muted-foreground">{meeting?.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiPanelOpen(!aiPanelOpen)}>
            <Sparkles className="h-4 w-4 mr-2" />Refine with AI
          </Button>
          <Button variant="outline"><Save className="h-4 w-4 mr-2" />Save Draft</Button>
          <Button onClick={handleSync}><ArrowRight className="h-4 w-4 mr-2" />Prepare to Sync</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Panel */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold">AI Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Themes</h3>
              <ul className="space-y-1">
                {summary.keyThemes.map((theme, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>{theme}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Decisions ({summary.decisions.length})</h3>
              {summary.decisions.map((d) => (
                <div key={d.id} className={cn("p-2 rounded text-sm mb-2", `confidence-${getConfidenceLevel(d.confidence)}`)}>
                  {d.text} <span className="text-muted-foreground">({formatConfidence(d.confidence)})</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Risks</h3>
              {summary.risks.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-warning">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />{r}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm">Overall Confidence: <span className="font-semibold">{summary.overallConfidence}%</span></p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Action Items ({actionItems.length})</h2>
            <Button variant="ghost" size="sm">+ Add manually</Button>
          </div>
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className={cn("p-3 rounded-lg border border-border", `confidence-${getConfidenceLevel(item.confidence)}`)}>
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{item.owner}</span>
                      <Badge variant={`priority-${item.priority}`} className="text-xs">{item.priority}</Badge>
                      <span className="text-xs text-muted-foreground">Due: {item.dueDate}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatConfidence(item.confidence)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-semibold">Transcript</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
            {transcript.map((line, i) => (
              <div key={i} className={cn("text-sm", line.confidence && line.confidence < 0.8 && "bg-warning/10 p-2 rounded")}>
                <span className="font-mono text-xs text-muted-foreground mr-2">{line.timestamp}</span>
                <span className="font-medium">{line.speaker}:</span>
                <span className="text-muted-foreground ml-1">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chatbot Panel */}
      <AiPanel onApply={(changes) => {
        // Handle AI refinement changes
        console.log("Applying AI changes:", changes);
      }} />
    </div>
  );
}
