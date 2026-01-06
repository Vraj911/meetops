import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef(
  ({ className, type, error, icon, locked, disabled, ...props }, ref) => {
    return <div className="relative">{icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}<input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-border bg-surface-tertiary px-4 py-3 text-sm text-foreground transition-colors duration-150",
        "placeholder:text-muted-foreground",
        "hover:border-border/80",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive/50 ring-2 ring-destructive/10",
        icon && "pl-10",
        locked && "pr-10 bg-muted cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled || locked}
      {...props}
    />{locked && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    ><path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    /></svg></div>}</div>;
  }
);
Input.displayName = "Input";
export {
  Input
};
