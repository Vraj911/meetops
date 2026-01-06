import { MeetOpsLogo } from "@/components/ui/MeetOpsLogo";
function GlobalLoader({ message = "Preparing workspace..." }) {
  return <div className="fixed inset-0 bg-background flex items-center justify-center z-50"><div className="flex flex-col items-center gap-4"><MeetOpsLogo size="lg" showText={true} /><p className="text-sm text-muted-foreground animate-pulse-subtle">{message}</p></div></div>;
}
export {
  GlobalLoader
};
