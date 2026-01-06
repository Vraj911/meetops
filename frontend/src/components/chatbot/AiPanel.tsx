import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Check, ChevronRight, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AiPanelProps {
  onApply?: (changes: any) => void;
}

const predefinedPrompts = [
  { id: "find-missing", icon: "🔍", label: "Find missing action items" },
  { id: "adjust-priority", icon: "📊", label: "Adjust priority based on urgency" },
  { id: "clarify-ambiguous", icon: "✏️", label: "Clarify ambiguous items" },
  { id: "merge-similar", icon: "🔗", label: "Merge similar items" },
  { id: "estimate-effort", icon: "⏱️", label: "Estimate effort for each" },
  { id: "suggest-dates", icon: "🗓️", label: "Suggest due dates" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AiPanel({ onApply }: AiPanelProps) {
  const { aiPanelOpen, setAiPanelOpen } = useUIStore();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [canApply, setCanApply] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamedText]);

  const handlePromptSelect = async (promptId: string) => {
    setSelectedPrompt(promptId);
    setIsStreaming(true);
    setStreamedText("");
    setCanApply(false);
    setPreviewData(null);

    // Simulate streaming AI response
    const mockResponse = "Found 2 missing action items from the transcript:\n1. Update deployment docs (mentioned at 14:40)\n2. Schedule follow-up meeting (mentioned at 14:52)";
    const words = mockResponse.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setStreamedText(words.slice(0, i + 1).join(" "));
    }

    // After streaming completes, show preview
    setPreviewData({
      changes: {
        added: 2,
        removed: 0,
        merged: 0,
      },
      confidence_impact: "+12%",
    });
    setIsStreaming(false);
    setCanApply(true);
  };

  const handleApply = () => {
    if (onApply && previewData) {
      onApply(previewData);
      setAiPanelOpen(false);
      setSelectedPrompt(null);
      setStreamedText("");
      setPreviewData(null);
      setCanApply(false);
    }
  };

  return (
    <AnimatePresence>
      {aiPanelOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed top-0 right-0 h-full w-[400px] bg-card border-l border-border z-50",
            "flex flex-col shadow-xl"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Refine Action Items</h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setAiPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="prompts" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="prompts">Quick Actions</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="prompts" className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Predefined Prompts */}
                <div className="space-y-2">
                  {predefinedPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border border-border",
                        "hover:bg-accent hover:border-primary/50 transition-colors",
                        selectedPrompt === prompt.id && "bg-accent border-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{prompt.icon}</span>
                        <span className="text-sm font-medium">{prompt.label}</span>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>

            {/* Streaming Output */}
            {isStreaming && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {streamedText}
                  <span className="animate-pulse">▊</span>
                </p>
              </div>
            )}

            {/* Streamed Output */}
            {!isStreaming && streamedText && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {streamedText}
                </p>
              </div>
            )}

            {/* JSON Preview */}
            {previewData && (
              <div className="mt-6 p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-semibold mb-3">JSON Preview</h3>
                <pre className="text-xs font-mono bg-muted/50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              </div>
            )}
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Ask me anything about refining your action items</p>
                    </div>
                  )}
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isChatStreaming && streamedText && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm">
                          {streamedText}
                          <span className="animate-pulse">▊</span>
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!chatInput.trim() || isChatStreaming) return;

                      const userMessage: ChatMessage = {
                        id: Date.now().toString(),
                        role: "user",
                        content: chatInput,
                        timestamp: new Date(),
                      };

                      setChatMessages((prev) => [...prev, userMessage]);
                      setChatInput("");
                      setIsChatStreaming(true);
                      setStreamedText("");

                      // Simulate AI response
                      const mockResponse = `I understand you want to: "${chatInput}". Let me analyze your action items and suggest improvements...`;
                      const words = mockResponse.split(" ");
                      let accumulated = "";

                      for (let i = 0; i < words.length; i++) {
                        await new Promise((resolve) => setTimeout(resolve, 50));
                        accumulated = words.slice(0, i + 1).join(" ");
                        setStreamedText(accumulated);
                      }

                      const aiMessage: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: accumulated || mockResponse,
                        timestamp: new Date(),
                      };

                      setChatMessages((prev) => [...prev, aiMessage]);
                      setIsChatStreaming(false);
                      setStreamedText("");
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about action items..."
                      disabled={isChatStreaming}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!chatInput.trim() || isChatStreaming}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Actions */}
          {previewData && (
            <div className="p-4 border-t border-border flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPreviewData(null);
                  setStreamedText("");
                  setCanApply(false);
                  setSelectedPrompt(null);
                }}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={handleApply}
                disabled={!canApply}
              >
                <Check className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

