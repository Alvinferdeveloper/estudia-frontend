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
    <div className="flex flex-col bg-[#1e1e1e] font-sans">
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
          <div key={`hunk-change-${index}`} className="relative group/block bg-[#1e1e1e]">
            {allIndices.length > 0 && (
              <div className="absolute right-4 top-2 z-20 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200">
                <div className="flex overflow-hidden rounded border border-[#454545] bg-[#252526] shadow-xl text-[12px]">
                  <button onClick={() => allIndices.forEach(onAccept)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#295c92] hover:bg-[#346baf] text-white transition-colors border-r border-[#454545] cursor-pointer">
                    Accept <span className="text-white/50 text-[10px]">Alt+↵</span>
                  </button>
                  <button onClick={() => allIndices.forEach(onReject)} className="flex items-center gap-1.5 px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] transition-colors cursor-pointer">
                    Reject <span className="text-[#cccccc]/50 text-[10px]">Shift+Alt+⌫</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              {hasRemove && (
                <div className="flow-root bg-[#4b1818]/50 line-through decoration-red-500/40">
                  <MarkdownRenderer content={removeText} />
                </div>
              )}
              {hasAdd && (
                <div className="flow-root bg-[#083a20]/50">
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