import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { ZocratisMark } from "@/components/brand/ZocratisMark";
import type { NoteSession } from "@/app/[locale]/document/[id]/hooks/useNoteSession";
import { PromptComposer } from "@/app/[locale]/document/[id]/components/document-reader/shared/PromptComposer";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { NoteColorPicker } from "./NoteColorPicker";
import { NoteError, NoteFooter, NoteScrollArea, NoteStatus } from "./NoteLayout";

// Generating, viewing and revising share one surface so the note never leaves the screen between them.
export const NoteReader: React.FC<{ session: NoteSession }> = ({ session }) => {
  const isGenerating = session.phase === "generating";
  const isRevising = session.phase === "revising";
  const text = isGenerating ? session.streamingText : session.note;

  return (
    <>
      <NoteScrollArea follow={isGenerating}>
        {isRevising && <NoteStatus label="Reescribiendo la nota…" className="mb-4" />}
        {isGenerating && !text ? (
          <NoteStatus label="Escribiendo tu nota…" />
        ) : (
          <article className={cn("transition-opacity duration-200 ease-[var(--ease-out)]", isRevising && "opacity-45")}>
            <MarkdownRenderer content={text} className="px-0" />
            {/* Same signature as the chat: carving while it writes, still once the note is done. */}
            {!isRevising && <ZocratisMark animated={isGenerating} className="mt-4 size-6 text-primary" />}
          </article>
        )}
      </NoteScrollArea>

      <NoteFooter>
        <NoteError message={session.error} className="mb-2 px-1 text-xs" />
        <PromptComposer
          label="Pedir un cambio a la nota"
          placeholder="Pide un cambio: más corta, con un ejemplo…"
          isBusy={session.isBusy}
          onSubmit={session.revise}
          onStop={session.stop}
          leading={
            <>
              <NoteColorPicker
                selectedColor={session.color}
                onColorChange={session.changeColor}
                className="px-1.5 text-foreground"
              />
              <span aria-hidden className="mx-1 h-4 w-px bg-border" />
              <IconButton label="Generar otra versión" onClick={() => session.revise()} disabled={session.isBusy}>
                <RefreshCw />
              </IconButton>
            </>
          }
        />
      </NoteFooter>
    </>
  );
};
