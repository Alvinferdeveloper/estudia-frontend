"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, CheckCheck, ArrowRightLeft, RotateCcw } from "lucide-react";
import { DiffChunk, mergeAcceptedChunks, acceptAll, rejectAll, computeDiff } from "@/app/document/[id]/components/document-reader/note-ui/lib/diff";

interface NoteDiffViewerProps {
  originalText: string;
  newText: string;
  onApply: (mergedText: string) => void;
  onCancel: () => void;
}

export const NoteDiffViewer: React.FC<NoteDiffViewerProps> = ({
  originalText,
  newText,
  onApply,
  onCancel,
}) => {

  const [chunks, setChunks] = useState<DiffChunk[]>(() =>
    computeDiff(originalText, newText, 'lines')
  );

  const handleAccept = (index: number) => {
    setChunks(prev => prev.map((chunk, i) =>
      i === index ? { ...chunk, accepted: true } : chunk
    ));
  };

  const handleReject = (index: number) => {
    setChunks(prev => prev.map((chunk, i) =>
      i === index ? { ...chunk, accepted: false } : chunk
    ));
  };

  const handleAcceptAll = () => {
    setChunks(acceptAll(chunks));
  };

  const handleRejectAll = () => {
    setChunks(rejectAll(chunks));
  };

  const mergedText = useMemo(() => mergeAcceptedChunks(chunks), [chunks]);

  const hasChanges = chunks.some(c => c.type !== 'unchanged');
  const pendingCount = chunks.filter(c => c.type !== 'unchanged' && c.accepted === null).length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Changes</span>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectAll}
            disabled={!hasChanges}
          >
            <X className="w-3 h-3 mr-1" />
            Keep Original
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcceptAll}
            disabled={!hasChanges}
          >
            <CheckCheck className="w-3 h-3 mr-1" />
            Accept All
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {chunks.map((chunk, index) => (
          <div
            key={index}
            className={`
              relative flex items-start gap-2 p-2 rounded text-sm transition-all
              ${chunk.type === 'add' ? (
                chunk.accepted === true
                  ? 'bg-green-50 border-l-4 border-l-green-500'
                  : chunk.accepted === false
                    ? 'opacity-50 bg-muted line-through'
                    : 'bg-green-50/50 border-l-4 border-l-green-400 hover:bg-green-100'
              ) : chunk.type === 'remove' ? (
                chunk.accepted === false
                  ? 'bg-red-50 border-l-4 border-l-red-500'
                  : chunk.accepted === true
                    ? 'opacity-50 bg-muted line-through'
                    : 'bg-red-50/50 border-l-4 border-l-red-400 hover:bg-red-100'
              ) : 'bg-transparent border-l-4 border-l-transparent'}
            `}
          >
            {chunk.type !== 'unchanged' && chunk.accepted === null && (
              <div className="flex gap-1 mt-0.5">
                <button
                  onClick={() => handleAccept(index)}
                  className="p-1 hover:bg-green-200 rounded text-green-600"
                  title="Accept this change"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleReject(index)}
                  className="p-1 hover:bg-red-200 rounded text-red-600"
                  title="Reject this change"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <span className="flex-1 whitespace-pre-wrap">{chunk.text}</span>

            <span className="text-xs text-muted-foreground shrink-0 mt-1">
              {chunk.type === 'add' && '+'}
              {chunk.type === 'remove' && '-'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-muted/20">
        <div className="text-xs text-muted-foreground mb-2">Result Preview:</div>
        <div className="p-3 bg-background rounded border text-sm whitespace-pre-wrap min-h-[60px]">
          {mergedText || '(No content)'}
        </div>
      </div>

      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        <Button onClick={() => onApply(mergedText)}>
          <Check className="w-3 h-3 mr-1" />
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
