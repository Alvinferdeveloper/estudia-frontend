import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { computeDiff, DiffChunk, mergeAcceptedChunks, acceptAll, rejectAll } from "./lib/diff";
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

  const handleAccept = (index: number) => {
    setChunks(prev => {
      const newChunks = prev.map((chunk, i) =>
        i === index ? { ...chunk, accepted: true } : chunk
      );

      if (onAcceptChanges) {
        const merged = mergeAcceptedChunks(newChunks);
        onAcceptChanges(merged);
      }

      if (onOriginalNoteUpdated) {
        const merged = mergeAcceptedChunks(newChunks);
        onOriginalNoteUpdated(merged);
      }

      return newChunks;
    });
  };

  const handleReject = (index: number) => {
    setChunks(prev => prev.map((chunk, i) =>
      i === index ? { ...chunk, accepted: false } : chunk
    ));
  };

  const handleAcceptAll = () => {
    const newChunks = acceptAll(chunks);
    setChunks(newChunks);
    if (onAcceptChanges) {
      const merged = mergeAcceptedChunks(newChunks);
      onAcceptChanges(merged);
    }
    if (onOriginalNoteUpdated) {
      const merged = mergeAcceptedChunks(newChunks);
      onOriginalNoteUpdated(merged);
    }
  };

  const handleRejectAll = () => {
    setChunks(rejectAll(chunks));
  };

  const displayContent = completion + (isLoading ? " ▊" : "");

  const baseLineStyles = `px-4 py-3 ${jetbrainsMono.className} text-[14px] leading-relaxed break-words [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:text-[14px]`;

  const renderChunks = () => {
    const elements = [];
    let i = 0;

    while (i < chunks.length) {
      const chunk = chunks[i];

      // 1. GROUPING: Remove + Add (Replace)
      if (
        chunk.type === 'remove' &&
        chunk.accepted === null &&
        i + 1 < chunks.length &&
        chunks[i + 1].type === 'add' &&
        chunks[i + 1].accepted === null
      ) {
        const addChunk = chunks[i + 1];
        const removeIdx = i;
        const addIdx = i + 1;

        elements.push(
          <div key={`group-${i}`} className="relative">
            <div className="absolute right-4 top-1 z-10 flex overflow-hidden rounded-md border border-[#454545] bg-[#252526] shadow-xl text-[12px] font-sans">
              <button
                onClick={() => { handleAccept(removeIdx); handleAccept(addIdx); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#295c92] hover:bg-[#346baf] text-white transition-colors border-r border-[#454545]"
              >
                Accept <span className="text-white/60 text-[10px]">Alt+↵</span>
              </button>
              <button
                onClick={() => { handleReject(removeIdx); handleReject(addIdx); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] transition-colors"
              >
                Reject <span className="text-[#cccccc]/60 text-[10px]">Shift+Alt+⌫</span>
              </button>
            </div>

            {/* Deleted part */}
            <div className={`${baseLineStyles} bg-[#4b1818]/60 text-red-400 opacity-80 line-through decoration-red-500/40`}>
              <MarkdownRenderer content={chunk.text} />
            </div>
            {/* Added part */}
            <div className={`${baseLineStyles} bg-[#1b3a32] text-[#4ec9b0] shadow-[inset_2px_0_0_0_#4ec9b0]`}>
              <MarkdownRenderer content={addChunk.text} />
            </div>
          </div>
        );
        i += 2;
        continue;
      }

      // 2. Unchanged chunks
      if (chunk.type === 'unchanged') {
        elements.push(
          <div key={`chunk-${i}`} className={`${baseLineStyles} opacity-90 text-foreground`}>
            <MarkdownRenderer content={chunk.text} />
          </div>
        );
        i++;
        continue;
      }

      // 3. Individual changes PENDING
      if (chunk.accepted === null) {
        const isAdd = chunk.type === 'add';
        const currentIdx = i;

        elements.push(
          <div key={`chunk-${i}`} className="relative">
            {/* Floating menu */}
            <div className="absolute right-4 top-1 z-10 flex overflow-hidden rounded-md border border-[#454545] bg-[#252526] shadow-xl text-[12px] font-sans">
              <button
                onClick={() => handleAccept(currentIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#295c92] hover:bg-[#346baf] text-white transition-colors border-r border-[#454545]"
              >
                Accept <span className="text-white/60 text-[10px]">Alt+↵</span>
              </button>
              <button
                onClick={() => handleReject(currentIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] transition-colors"
              >
                Reject <span className="text-[#cccccc]/60 text-[10px]">Shift+Alt+⌫</span>
              </button>
            </div>

            <div className={`${baseLineStyles} ${isAdd
              ? 'bg-[#1b3a32] text-[#4ec9b0] shadow-[inset_2px_0_0_0_#4ec9b0]'
              : 'bg-[#4b1818]/60 text-red-400 opacity-80 line-through decoration-red-500/40'
              }`}>
              <MarkdownRenderer content={chunk.text} />
            </div>
          </div>
        );
        i++;
        continue;
      }

      // 4. Accepted or rejected changes
      const isAccepted = chunk.accepted;
      const isAdd = chunk.type === 'add';

      // If it was a rejected "Add" or an accepted "Remove", it is not rendered (it disappears cleanly)
      if ((isAdd && !isAccepted) || (!isAdd && isAccepted)) {
        i++;
        continue;
      }

      // If it was an accepted "Add" or a rejected "Remove", it is displayed as normal code without animations
      elements.push(
        <div key={`chunk-${i}`} className={`${baseLineStyles} text-foreground transition-colors duration-300`}>
          <MarkdownRenderer content={chunk.text} />
        </div>
      );

      i++;
    }

    return elements;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
      {/* Content with diff or markdown */}
      <div ref={noteAreaRef} className="flex-1 overflow-y-auto py-2 scroll-smooth">
        {isEditMode && hasChanges ? (
          <div className="flex flex-col">
            {renderChunks()}
          </div>
        ) : (
          <div className={baseLineStyles}>
            <MarkdownRenderer content={displayContent} />
          </div>
        )}
      </div>

      {/* Input for changes */}
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
                <Button className="rounded-sm bg-primary hover:bg-primary/80 cursor-pointer text-white" onClick={() => { if (changePrompt.trim()) { onRequestChanges(changePrompt); setChangePrompt(""); } }} disabled={!changePrompt.trim()} size="sm">
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