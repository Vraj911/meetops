import { ReactNode } from "react";

interface MotionConfigProps {
  children: ReactNode;
  mode?: "wait" | "sync";
}

export function MotionConfig({ children }: MotionConfigProps) {
  // MotionConfig is a wrapper for global motion settings
  // AnimatePresence should only be used for conditional rendering
  // We don't need it here as a wrapper for all children
  return <>{children}</>;
}

