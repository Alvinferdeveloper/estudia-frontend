import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { computeDiff, DiffChunk, mergeAcceptedChunks, acceptAll, rejectAll } from "./lib/diff";
import { DiffView } from "./DiffView";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

interface NoteEditorProps {
  completion: string;
  isLoading: boolean;
  initialPrompt: string;
  hasError: boolean;
  errorMessage?: string;
  originalNote?: string;
  onRegenerate: () => void;
  onRequestChanges: (prompt: string) => void;
  onStop: () => void;
  onAcceptChanges?: (mergedText: string) => void;
  onOriginalNoteUpdated?: (newOriginalNote: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  completion,
  isLoading,
  hasError,
  errorMessage,
  originalNote,
  onRegenerate,
  onRequestChanges,
  onStop,
  onAcceptChanges,
  onOriginalNoteUpdated,
}) => {
  const [changePrompt, setChangePrompt] = useState("");
  const noteAreaRef = useRef<HTMLDivElement>(null);

  const hasChanges = !!originalNote && completion !== originalNote;
  const isEditMode = !!originalNote;

  const diffChunks: DiffChunk[] = useMemo(() => {
    if (!originalNote || !completion) return [];
    return computeDiff(originalNote, completion, 'lines');
  }, [originalNote, completion]);

  const [chunks, setChunks] = useState<DiffChunk[]>(diffChunks);

  useEffect(() => {
    setChunks(diffChunks);
  }, [diffChunks]);

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

  const handleUpdateStore = (newChunks: DiffChunk[]) => {
    if (onAcceptChanges) {
      const merged = mergeAcceptedChunks(newChunks);
      onAcceptChanges(merged);
    }
    if (onOriginalNoteUpdated) {
      const merged = mergeAcceptedChunks(newChunks);
      onOriginalNoteUpdated(merged);
    }
  };

  const handleAccept = (index: number) => {
    setChunks(prev => {
      const newChunks = prev.map((chunk, i) =>
        i === index ? { ...chunk, accepted: true } : chunk
      );
      handleUpdateStore(newChunks);
      return newChunks;
    });
  };

  const handleReject = (index: number) => {
    setChunks(prev => prev.map((chunk, i) =>
      i === index ? { ...chunk, accepted: false } : chunk
    ));
  };

  const handleApplyChanges = () => {
    if (changePrompt.trim()) {
      onRequestChanges(changePrompt);
      setChangePrompt("");
    }
  };

  const displayContent = completion + (isLoading ? " ▊" : "");
  const baseLineStyles = `px-4 py-3 ${jetbrainsMono.className} text-[14px] leading-relaxed break-words [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:text-[14px]`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
      <div ref={noteAreaRef} className="flex-1 overflow-y-auto py-2 scroll-smooth">
        {isEditMode && hasChanges ? (
          <DiffView
            chunks={chunks}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ) : (
          <div className={baseLineStyles}>
            <MarkdownRenderer content={displayContent} />
          </div>
        )}
      </div>

      <div className="border-t border-[#333] p-3 bg-[#252526] shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Textarea
            placeholder="e.g., Make it shorter, Add more examples..."
            value={changePrompt}
            onChange={(e) => setChangePrompt(e.target.value)}
            className="min-h-[40px] h-[40px] w-full resize-none py-2 text-sm bg-[#1e1e1e] border-[#454545] text-[#cccccc]"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-2 shrink-0 self-end sm:self-auto mt-1 sm:mt-0">
            {isLoading ? (
              <Button variant="outline" className="border-[#454545] text-[#cccccc]" onClick={onStop} size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Stop
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button className="rounded-sm bg-primary hover:bg-primary/80 cursor-pointer text-white" onClick={handleApplyChanges} disabled={!changePrompt.trim()} size="sm">
                  Apply
                </Button>
                <Button variant="outline" className="border-[#454545] cursor-pointer bg-transparent text-[#cccccc] hover:bg-[#333]" onClick={onRegenerate} size="sm" title="Regenerate">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {hasError && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
      </div>
    </div>
  );
};