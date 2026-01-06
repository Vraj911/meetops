import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ExternalLink, AlertTriangle, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetingStore } from "@/stores/meeting.store";
import { ROUTES } from "@/lib/constants";
function Result() {
  const navigate = useNavigate();
  const { syncResult, reset } = useMeetingStore();
  useEffect(() => {
    if (!syncResult) navigate(ROUTES.UPLOAD);
  }, [syncResult, navigate]);
  const handleNewMeeting = () => {
    reset();
    navigate(ROUTES.UPLOAD);
  };
  if (!syncResult) return null;
  return <div className="max-w-2xl mx-auto space-y-8 animate-fade-in"><div className="text-center space-y-4"><div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto"><CheckCircle className="h-8 w-8 text-success" /></div><h1 className="text-3xl font-semibold">Meeting Processed Successfully</h1></div>{
    /* Summary */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-3"><h2 className="font-semibold">Summary</h2><ul className="space-y-2 text-sm"><li>• {syncResult.actionItemsCreated} action items created</li><li>• Assigned to {syncResult.teamMembersAssigned} team members</li><li>• {syncResult.calendarEventsCreated} calendar event created</li><li>• Sync completed in {syncResult.syncDuration}</li></ul></div>{
    /* JIRA Tickets */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-4"><h2 className="font-semibold">Created in JIRA</h2>{syncResult.jiraTickets.map((ticket) => <div key={ticket.id} className="flex items-center justify-between p-3 bg-surface-tertiary rounded-lg"><div><p className="font-medium text-sm">{ticket.key}: {ticket.title}</p><p className="text-xs text-muted-foreground">Status: {ticket.status} • Assigned: {ticket.assignee}</p></div><Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button></div>)}</div>{
    /* Calendar Events */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-4"><h2 className="font-semibold">Created in Calendar</h2>{syncResult.calendarEvents.map((event) => <div key={event.id} className="flex items-center justify-between p-3 bg-surface-tertiary rounded-lg"><div><p className="font-medium text-sm">{event.title}</p><p className="text-xs text-muted-foreground">{event.date}, {event.time} • {event.duration}</p></div><Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button></div>)}</div>{
    /* Items Requiring Attention */
  }{syncResult.itemsRequiringAttention.length > 0 && <div className="bg-warning/10 border border-warning/30 rounded-lg p-6 space-y-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /><h2 className="font-semibold">Items Requiring Attention</h2></div>{syncResult.itemsRequiringAttention.map((item, i) => <div key={i} className="text-sm"><p className="font-medium">{item.title}</p><p className="text-muted-foreground">{item.reason}</p></div>)}</div>}{
    /* Actions */
  }<div className="flex gap-4"><Button variant="outline" className="flex-1"><Download className="h-4 w-4 mr-2" />Export Summary</Button><Button className="flex-1" onClick={handleNewMeeting}><RotateCcw className="h-4 w-4 mr-2" />Process Another Meeting</Button></div></div>;
}
export {
  Result as default
};
