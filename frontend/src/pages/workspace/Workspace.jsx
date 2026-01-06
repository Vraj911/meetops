import { useEffect } from "react";
import { Users, Mail, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/stores/workspace.store";
import { useUIStore } from "@/stores/ui.store";
import { getInitials } from "@/lib/utils";
function Workspace() {
  const { workspace, teamMembers, pendingInvites, stats, loadWorkspace, isLoading } = useWorkspaceStore();
  const { setInviteModalOpen } = useUIStore();
  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);
  if (isLoading || !workspace) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/3" /><div className="h-64 bg-muted rounded" /></div>;
  }
  return <div className="space-y-8 animate-fade-in"><div><h1 className="text-3xl font-semibold">Workspace & Team</h1></div>{
    /* Workspace Details */
  }<div className="bg-card border border-border rounded-lg p-6"><h2 className="font-semibold mb-4">Workspace Details</h2><dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{workspace.name}</dd></div><div><dt className="text-muted-foreground">Owner</dt><dd className="font-medium">{workspace.owner}</dd></div><div><dt className="text-muted-foreground">Created</dt><dd className="font-medium">{workspace.createdAt}</dd></div><div><dt className="text-muted-foreground">Plan</dt><dd className="font-medium capitalize">{workspace.plan} • Unlimited meetings</dd></div></dl>{stats && <div className="mt-6 pt-4 border-t border-border"><h3 className="text-sm font-medium text-muted-foreground mb-3">Usage (this month)</h3><div className="flex gap-8 text-sm"><div>• {stats.meetingsProcessed} meetings processed</div><div>• {stats.actionItemsCreated} action items created</div><div>• {stats.syncSuccessRate}% sync success rate</div></div></div>}</div>{
    /* Team Members */
  }<div className="bg-card border border-border rounded-lg p-6"><div className="flex items-center justify-between mb-4"><h2 className="font-semibold">Team Members ({teamMembers.length})</h2><Button size="sm" onClick={() => setInviteModalOpen(true)}><Users className="h-4 w-4 mr-2" />Invite Members</Button></div><div className="divide-y divide-border">{teamMembers.map((member) => <div key={member.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">{getInitials(member.name)}</div><div><p className="font-medium text-sm">{member.name}</p><p className="text-xs text-muted-foreground">{member.email}</p></div></div><div className="flex items-center gap-4"><Badge variant={member.role === "owner" ? "default" : "secondary"} className="capitalize">{member.role}</Badge><span className="text-xs text-muted-foreground">{member.lastActive}</span>{member.role !== "owner" && <Button variant="ghost" size="icon-sm"><Trash2 className="h-4 w-4" /></Button>}</div></div>)}</div></div>{
    /* Pending Invites */
  }{pendingInvites.length > 0 && <div className="bg-card border border-border rounded-lg p-6"><h2 className="font-semibold mb-4">Pending Invites ({pendingInvites.length})</h2><div className="divide-y divide-border">{pendingInvites.map((invite) => <div key={invite.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-muted-foreground" /><div><p className="font-medium text-sm">{invite.email}</p><p className="text-xs text-muted-foreground">Sent {invite.invitedAt}</p></div></div><div className="flex items-center gap-2"><Badge variant="secondary" className="capitalize">{invite.role}</Badge><Button variant="ghost" size="sm">Revoke</Button><Button variant="ghost" size="sm"><Send className="h-4 w-4 mr-1" />Resend</Button></div></div>)}</div></div>}</div>;
}
export {
  Workspace as default
};
