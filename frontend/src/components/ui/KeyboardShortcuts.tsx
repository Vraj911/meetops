import { useEffect, useState } from "react";
import { X, Command } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Shortcut {
  category: string;
  shortcuts: { key: string; description: string }[];
}

const shortcuts: Shortcut[] = [
  {
    category: "Navigation",
    shortcuts: [
      { key: "Cmd+K", description: "Open this menu" },
      { key: "Cmd+N", description: "New meeting" },
      { key: "Cmd+,", description: "Settings" },
    ],
  },
  {
    category: "Review Page",
    shortcuts: [
      { key: "Space", description: "Play/pause transcript" },
      { key: "J", description: "Next action item" },
      { key: "K", description: "Previous action item" },
      { key: "E", description: "Edit selected item" },
    ],
  },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      // Escape to close
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const openDialog = () => setOpen(true);

  // Expose openDialog for external triggers
  useEffect(() => {
    (window as any).__openKeyboardShortcuts = openDialog;
    return () => {
      delete (window as any).__openKeyboardShortcuts;
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={openDialog}
        className="hidden md:flex"
      >
        <Command className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-foreground">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

