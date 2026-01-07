import { Outlet } from "react-router-dom";
import { MeetOpsLogoLink } from "@/components/ui/MeetOpsLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
function AuthLayout() {
  return <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">{
    /* Header */
  }<header className="relative z-10 flex items-center justify-between px-6 py-4"><MeetOpsLogoLink to="/login" /><ThemeToggle /></header>{
    /* Content */
  }<main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12"><div className="w-full max-w-[400px] animate-fade-in"><Outlet /></div></main>{
    /* Footer */
  }<footer className="relative z-10 py-4 text-center"><p className="text-xs text-muted-foreground">
          © 2024 MeetOps. Enterprise meeting intelligence.
        </p></footer></div>;
}
export {
  AuthLayout
};
