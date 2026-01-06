import { MeetOpsLogo } from "@/components/ui/MeetOpsLogo";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Preparing workspace..." }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-6 animate-pulse-subtle">
        <MeetOpsLogo size="lg" showText={true} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoader({ size = 'md', className }: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-6 w-6 border-3',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}
