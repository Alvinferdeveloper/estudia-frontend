import React from "react";
import { DiffChunk } from "./lib/diff";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useDiffHunks } from "./useDiffHunks";

interface DiffViewProps {
  chunks: DiffChunk[];
  onAccept: (index: number) => void;
  onReject: (index: number) => void;
}

export const DiffView: React.FC<DiffViewProps> = ({ chunks, onAccept, onReject }) => {

  const hunks = useDiffHunks(chunks);

  return (
    <div className="flex flex-col bg-card font-sans">
      {hunks.map((hunk, index) => {
        // RENDERING: NORMAL TEXT (No changes or changes already accepted/rejected)
        if (hunk.type === 'unchanged') {
          const combinedText = hunk.items.map(c => c.text).join('\n');
          if (!combinedText.trim()) return null; // Avoid rendering empty blocks
          return (
            <div key={`unchanged-${index}`} className="flow-root opacity-90 transition-opacity">
              <MarkdownRenderer content={combinedText} />
            </div>
          );
        }

        // RENDERING: MODIFIED BLOCK (Pending action)
        const allIndices = hunk.items
          .filter(item => item.accepted === null && item.type !== 'unchanged')
          .map(item => item.originalIndex);

        const hasRemove = hunk.items.some(c => c.type === 'remove');
        const hasAdd = hunk.items.some(c => c.type === 'add');

        const removeText = hunk.items.filter(c => c.type === 'remove' || c.type === 'unchanged').map(c => c.text).join('\n');
        const addText = hunk.items.filter(c => c.type === 'add' || c.type === 'unchanged').map(c => c.text).join('\n');

        return (
          <div key={`hunk-change-${index}`} className="relative group/block bg-card">
            {allIndices.length > 0 && (
              <div className="absolute right-4 top-2 z-20 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200">
                <div className="flex overflow-hidden rounded-lg border border-border shadow-lg text-[12px]">
                  <button onClick={() => allIndices.forEach(onAccept)} className="press-feedback flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors border-r border-border cursor-pointer">
                    Accept <span className="text-primary-foreground/60 text-[10px]">Alt+↵</span>
                  </button>
                  <button onClick={() => allIndices.forEach(onReject)} className="press-feedback flex items-center gap-1.5 px-3 py-1.5 text-foreground/70 hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                    Reject <span className="text-muted-foreground text-[10px]">Shift+Alt+⌫</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              {hasRemove && (
                <div className="flow-root bg-danger/10 line-through decoration-danger/40">
                  <MarkdownRenderer content={removeText} />
                </div>
              )}
              {hasAdd && (
                <div className="flow-root bg-success/10">
                  <MarkdownRenderer content={addText} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};