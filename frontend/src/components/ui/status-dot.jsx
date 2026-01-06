import { cn } from "@/lib/utils";
function StatusDot({ status, className }) {
  return <span
    className={cn(
      "inline-block h-2 w-2 rounded-full",
      status === "connected" && "bg-success",
      status === "connecting" && "bg-primary animate-pulse",
      status === "disconnected" && "bg-muted-foreground",
      status === "error" && "bg-destructive",
      className
    )}
  />;
}
export {
  StatusDot
};
