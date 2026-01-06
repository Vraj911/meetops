import { StatusDot } from "@/components/ui/status-dot";
import { Button } from "@/components/ui/button";
import { getMockJiraIntegration, getMockCalendarIntegration, getMockApiAccess } from "@/lib/mockData";
function Integrations() {
  const jira = getMockJiraIntegration();
  const calendar = getMockCalendarIntegration();
  const api = getMockApiAccess();
  return <div className="space-y-8 animate-fade-in"><div><h1 className="text-3xl font-semibold">Integrations</h1><p className="text-muted-foreground">Connect your tools for seamless workflow</p></div>{
    /* JIRA */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-4"><h2 className="font-semibold">JIRA Cloud</h2><div className="grid grid-cols-2 gap-4 text-sm"><div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span><StatusDot status={jira.status === "connected" ? "connected" : "disconnected"} /><span>{jira.status === "connected" ? "Connected" : "Not Connected"}</span></div><div><span className="text-muted-foreground">Instance:</span> {jira.instanceUrl}</div><div><span className="text-muted-foreground">Project:</span> {jira.project}</div><div><span className="text-muted-foreground">Last Sync:</span> {jira.lastSync} ({jira.issuesCreated} issues)</div></div><div className="flex gap-2"><Button variant="outline" size="sm">Test Connection</Button><Button variant="outline" size="sm">Reconfigure</Button><Button variant="ghost" size="sm" className="text-destructive">Disconnect</Button></div></div>{
    /* Calendar */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-4"><h2 className="font-semibold">Google Calendar</h2><div className="grid grid-cols-2 gap-4 text-sm"><div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span><StatusDot status="disconnected" /><span>Not Connected</span></div><div><span className="text-muted-foreground">Default:</span> {calendar.defaultCalendar}</div></div><Button>Connect Google Calendar</Button></div>{
    /* API */
  }<div className="bg-card border border-border rounded-lg p-6 space-y-4"><h2 className="font-semibold">API Access (mock)</h2><div className="grid grid-cols-3 gap-4 text-sm"><div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span><StatusDot status="connected" /><span>Available</span></div><div><span className="text-muted-foreground">Webhooks:</span> Enabled</div><div><span className="text-muted-foreground">Rate Limit:</span> {api.rateLimit}</div></div><div className="flex gap-2"><Button variant="outline" size="sm">View API Docs</Button><Button variant="outline" size="sm">Regenerate Key</Button></div></div></div>;
}
export {
  Integrations as default
};
