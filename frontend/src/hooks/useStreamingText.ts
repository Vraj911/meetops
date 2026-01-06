import { useState, useEffect, useCallback } from "react";

interface UseStreamingTextOptions {
  text: string;
  speed?: number; // milliseconds per word
  onComplete?: () => void;
}

export function useStreamingText({ text, speed = 50, onComplete }: UseStreamingTextOptions) {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const start = useCallback(() => {
    if (!text) return;
    
    setIsStreaming(true);
    setStreamedText("");
    const words = text.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamedText(prev => {
          const newText = currentIndex === 0 
            ? words[currentIndex]
            : prev + " " + words[currentIndex];
          currentIndex++;
          return newText;
        });
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const reset = useCallback(() => {
    setStreamedText("");
    setIsStreaming(false);
  }, []);

  return {
    streamedText,
    isStreaming,
    start,
    reset,
  };
}

