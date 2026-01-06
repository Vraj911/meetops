import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MoreVertical, Upload, Users, FileText, Settings, HelpCircle, LogOut, Keyboard, Link2, Zap, Clock } from "lucide-react";
import { MeetOpsLogoLink } from "@/components/ui/MeetOpsLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useMeetingStore } from "@/stores/meeting.store";
import { useWorkspaceStore } from "@/stores/workspace.store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { workspace } = useWorkspaceStore();
  const { meeting, processingSteps } = useMeetingStore();

  const isWorkflowPage = ['/processing', '/review', '/result'].includes(location.pathname);
  const currentStep = processingSteps.find(s => s.status === 'processing');
  const overallProgress = processingSteps.length > 0
    ? Math.round(processingSteps.filter(s => s.status === 'complete').length / processingSteps.length * 100)
    : 0;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { to: ROUTES.UPLOAD, label: 'Upload', icon: Upload },
    { to: ROUTES.WORKSPACE, label: 'Workspace', icon: Users },
    { to: ROUTES.DOCS, label: 'Docs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Left: Logo + Workspace */}
          <div className="flex items-center gap-4">
            <MeetOpsLogoLink to={ROUTES.UPLOAD} size="sm" />
            {workspace && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{workspace.name}</span>
              </>
            )}
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <KeyboardShortcuts />
            
            {user && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
            )}

            {/* Kebab menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate(ROUTES.UPLOAD)}>
                  <Upload className="h-4 w-4 mr-2" />
                  New Meeting
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  View Recent
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="h-4 w-4 mr-2" />
                  Sync Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.INTEGRATIONS)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.SETTINGS)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.DOCS)}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Docs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // Trigger keyboard shortcuts dialog
                  if ((window as any).__openKeyboardShortcuts) {
                    (window as any).__openKeyboardShortcuts();
                  }
                }}>
                  <Keyboard className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Context bar for workflow pages */}
        {isWorkflowPage && meeting && (
          <div className="flex items-center justify-between h-10 px-6 border-t border-border bg-surface-secondary">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Processing:</span>
              <span className="text-foreground font-medium">{meeting.title}</span>
              <span className="text-muted-foreground">
                ({meeting.duration} • {meeting.participants.length} participants)
              </span>
            </div>
            {location.pathname === '/processing' && (
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{overallProgress}%</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="page-container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
