import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
