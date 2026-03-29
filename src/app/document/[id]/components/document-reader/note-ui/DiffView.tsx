import React from "react";
import { DiffChunk } from "./lib/diff";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

interface DiffViewProps {
  chunks: DiffChunk[];
  onAccept: (index: number) => void;
  onReject: (index: number) => void;
}

export const DiffView: React.FC<DiffViewProps> = ({ chunks, onAccept, onReject }) => {
  const baseLineStyles = `px-4 py-1.5 text-[14px] leading-relaxed break-words [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:text-[14px]`;

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
          <div key={`group-${i}`} className="relative border-b border-zinc-800/20 last:border-0 font-sans">
            <div className="absolute right-4 top-1.5 z-20 flex overflow-hidden rounded-md border border-[#454545] bg-[#252526] shadow-xl text-[12px]">
              <button
                onClick={() => { onAccept(removeIdx); onAccept(addIdx); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#295c92] hover:bg-[#346baf] text-white transition-colors border-r border-[#454545] cursor-pointer"
              >
                Accept <span className="text-white/60 text-[10px]">Alt+↵</span>
              </button>
              <button
                onClick={() => { onReject(removeIdx); onReject(addIdx); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] transition-colors cursor-pointer"
              >
                Reject <span className="text-[#cccccc]/60 text-[10px]">Shift+Alt+⌫</span>
              </button>
            </div>

            {/* Deleted part */}
            <div className={`${baseLineStyles} bg-[#4b1818]/40 text-red-400 opacity-80 line-through decoration-red-500/40 py-2`}>
              <MarkdownRenderer content={chunk.text} compact className="!px-0" />
            </div>
            {/* Added part */}
            <div className={`${baseLineStyles} bg-[#1b3a32]/60 text-[#4ec9b0] shadow-[inset_2px_0_0_0_#4ec9b0] py-2`}>
              <MarkdownRenderer content={addChunk.text} compact className="!px-0" />
            </div>
          </div>
        );
        i += 2;
        continue;
      }

      // 2. Unchanged chunks
      if (chunk.type === 'unchanged') {
        elements.push(
          <div key={`chunk-${i}`} className={`${baseLineStyles} opacity-90 text-foreground py-1`}>
            <MarkdownRenderer content={chunk.text} compact className="!px-0 font-sans" />
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
          <div key={`chunk-${i}`} className="relative border-b border-zinc-800/20 last:border-0 font-sans">
            <div className="absolute right-4 top-1.5 z-20 flex overflow-hidden rounded-md border border-[#454545] bg-[#252526] shadow-xl text-[12px]">
              <button
                onClick={() => onAccept(currentIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#295c92] hover:bg-[#346baf] text-white transition-colors border-r border-[#454545] cursor-pointer"
              >
                Accept <span className="text-white/60 text-[10px]">Alt+↵</span>
              </button>
              <button
                onClick={() => onReject(currentIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#3c3c3c] transition-colors cursor-pointer"
              >
                Reject <span className="text-[#cccccc]/60 text-[10px]">Shift+Alt+⌫</span>
              </button>
            </div>

            <div className={`${baseLineStyles} py-2 ${isAdd
              ? 'bg-[#1b3a32]/60 text-[#4ec9b0] shadow-[inset_2px_0_0_0_#4ec9b0]'
              : 'bg-[#4b1818]/40 text-red-400 opacity-80 line-through decoration-red-500/40'
              }`}>
              <MarkdownRenderer content={chunk.text} compact className="!px-0" />
            </div>
          </div>
        );
        i++;
        continue;
      }

      // 4. Accepted or rejected changes
      const isAccepted = chunk.accepted;
      const isAdd = chunk.type === 'add';

      if ((isAdd && !isAccepted) || (!isAdd && isAccepted)) {
        i++;
        continue;
      }

      elements.push(
        <div key={`chunk-${i}`} className={`${baseLineStyles} text-foreground transition-colors duration-300 py-1`}>
          <MarkdownRenderer content={chunk.text} compact className="!px-0 font-sans" />
        </div>
      );

      i++;
    }

    return elements;
  };

  return <div className="flex flex-col bg-[#1e1e1e] font-sans">{renderChunks()}</div>;
};
