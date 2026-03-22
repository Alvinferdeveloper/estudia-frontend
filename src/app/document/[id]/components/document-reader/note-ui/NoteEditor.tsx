import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface NoteEditorProps {
  completion: string;
  isLoading: boolean;
  initialPrompt: string;
  hasError: boolean;
  errorMessage?: string;
  onRegenerate: () => void;
  onRequestChanges: (prompt: string) => void;
  onStop: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  completion,
  isLoading,
  hasError,
  errorMessage,
  onRegenerate,
  onRequestChanges,
  onStop,
}) => {
  const [changePrompt, setChangePrompt] = useState("");
  const noteAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (noteAreaRef.current && completion) {
      noteAreaRef.current.scrollTop = noteAreaRef.current.scrollHeight;
    }
  }, [completion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (changePrompt.trim() && !isLoading) {
        onRequestChanges(changePrompt);
        setChangePrompt("");
      }
    }
  };

  const displayContent = completion + (isLoading ? " ▊" : "");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div ref={noteAreaRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <MarkdownRenderer content={displayContent} />
      </div>

      <div className="border-t p-3 bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Textarea
            placeholder="e.g., Make it shorter, Add more examples..."
            value={changePrompt}
            onChange={(e) => setChangePrompt(e.target.value)}
            className="min-h-[40px] h-[40px] w-full resize-none py-2 text-sm"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-row gap-2 shrink-0 self-end sm:self-auto mt-1 sm:mt-0">
            {isLoading ? (
              <Button variant="outline" onClick={onStop} size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stop
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onRegenerate}
                  size="sm"
                  title="Regenerate from initial prompt"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  className="rounded-sm bg-primary"
                  onClick={() => {
                    if (changePrompt.trim()) {
                      onRequestChanges(changePrompt);
                      setChangePrompt("");
                    }
                  }}
                  disabled={!changePrompt.trim()}
                  size="sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Apply
                </Button>
              </>
            )}
          </div>
        </div>
        {hasError && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};