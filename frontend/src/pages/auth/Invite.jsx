import { useNavigate } from "react-router-dom";
import { Mail, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { useInvite } from "@/hooks/useInvite";
import { ROUTES } from "@/lib/constants";
function Invite() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { inviteData, acceptInvite, declineInvite } = useInvite();
  if (!inviteData) {
    return <div className="text-center space-y-4"><p className="text-muted-foreground">Invalid or expired invitation</p><Button onClick={() => navigate(ROUTES.LOGIN)}>Go to Login</Button></div>;
  }
  return <div className="space-y-6"><div className="text-center space-y-2"><h1 className="text-3xl font-semibold">{isAuthenticated ? "Accept Invitation" : "You've been invited to join"}</h1><p className="text-muted-foreground">Join {inviteData.workspaceName}</p></div><Card className="p-6 space-y-4"><div className="space-y-3"><div><label className="text-sm font-medium text-muted-foreground">Workspace</label><p className="text-lg font-medium">{inviteData.workspaceName}</p></div><div><label className="text-sm font-medium text-muted-foreground">Invited by</label><p className="text-lg">{inviteData.invitedBy}</p><p className="text-sm text-muted-foreground">{inviteData.invitedByEmail}</p></div><div><label className="text-sm font-medium text-muted-foreground">Email</label><div className="relative"><Input
    value={inviteData.email}
    locked
    icon={<Mail className="h-4 w-4" />}
    readOnly
  /></div><p className="text-xs text-muted-foreground mt-1">
              This email is locked and cannot be changed
            </p></div><div><label className="text-sm font-medium text-muted-foreground">Role</label><div className="flex items-center gap-2 mt-1"><UserCheck className="h-4 w-4 text-muted-foreground" /><span className="capitalize">{inviteData.role}</span></div></div></div><div className="flex gap-3 pt-4">{isAuthenticated ? <><Button onClick={acceptInvite} className="flex-1">
                Accept Invitation
              </Button><Button variant="outline" onClick={declineInvite}>
                Decline
              </Button></> : <><Button onClick={() => navigate(ROUTES.SIGNUP)} className="flex-1">
                Sign Up & Accept Invite
              </Button><Button variant="outline" onClick={() => navigate(ROUTES.LOGIN)}>
                Sign In First
              </Button></>}</div></Card></div>;
}
export {
  Invite as default
};
