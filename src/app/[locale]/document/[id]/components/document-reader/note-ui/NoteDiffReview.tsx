import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDiffReview } from "@/app/[locale]/document/[id]/hooks/useDiffReview";
import { ChangeHunk, resolveHunk } from "@/app/[locale]/document/[id]/lib/note-diff";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { NoteFooter, NoteScrollArea } from "./NoteLayout";

interface NoteDiffReviewProps {
  original: string;
  proposal: string;
  onResolve: (merged: string) => void;
}

const MarkdownLines: React.FC<{ lines: string[]; className?: string }> = ({ lines, className }) => {
  const content = lines.join("\n");
  if (!content.trim()) return null;
  return <MarkdownRenderer content={content} className={cn("px-0", className)} />;
};

const DIFF_SIDES = {
  removed: {
    sign: "−",
    rowClassName: "bg-danger/10",
    signClassName: "text-danger",
    textClassName: "opacity-70 line-through decoration-danger/50",
  },
  added: {
    sign: "+",
    rowClassName: "bg-success/10",
    signClassName: "text-success",
    textClassName: "",
  },
} as const;

// Editor-style row: full-bleed tint with a +/− gutter, like an inline diff in a code editor.
const DiffRow: React.FC<{ side: keyof typeof DIFF_SIDES; lines: string[] }> = ({ side, lines }) => {
  const t = useTranslations("notes.review");
  const style = DIFF_SIDES[side];
  if (!lines.some((line) => line.trim())) return null;

  return (
    <div className={cn("flex py-1.5 pr-6", style.rowClassName)}>
      <span aria-hidden className={cn("w-6 shrink-0 select-none text-center font-mono text-sm leading-7", style.signClassName)}>
        {style.sign}
      </span>
      <span className="sr-only">{t(side)}:</span>
      <MarkdownLines lines={lines} className={cn("min-w-0 flex-1", style.textClassName)} />
    </div>
  );
};

const Shortcut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="font-sans text-[10px] opacity-60">{children}</kbd>
);

interface DiffHunkProps {
  hunk: ChangeHunk;
  isCurrent: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const DiffHunk = ({ hunk, isCurrent, onAccept, onReject, ref }: DiffHunkProps & { ref: React.Ref<HTMLElement> }) => {
  const t = useTranslations("notes.review");

  return (
    <section ref={ref} aria-label={t("hunkLabel")} aria-current={isCurrent || undefined} className="group/hunk relative -mx-6">
      <DiffRow side="removed" lines={hunk.removed} />
      <DiffRow side="added" lines={hunk.added} />

      <div
        className={cn(
          "absolute right-4 top-1.5 z-10 flex overflow-hidden rounded-lg border border-border bg-card text-xs shadow-md",
          "opacity-0 transition-opacity duration-150 group-hover/hunk:opacity-100 group-focus-within/hunk:opacity-100 [@media(hover:none)]:opacity-100",
          isCurrent && "opacity-100"
        )}
      >
        <button
          type="button"
          onClick={onReject}
          className="flex items-center gap-1.5 px-2.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:outline-none"
        >
          {t("reject")} {isCurrent && <Shortcut>Alt ⌫</Shortcut>}
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex items-center gap-1.5 border-l border-border bg-primary px-2.5 py-1 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          {t("accept")} {isCurrent && <Shortcut>Alt ↵</Shortcut>}
        </button>
      </div>
    </section>
  );
};

export const NoteDiffReview: React.FC<NoteDiffReviewProps> = ({ original, proposal, onResolve }) => {
  const t = useTranslations("notes.review");
  const review = useDiffReview(original, proposal, onResolve);
  const { currentId, decide } = review;
  const hunkElements = useRef(new Map<number, HTMLElement>());

  useEffect(() => {
    if (currentId === undefined) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Enter") {
        event.preventDefault();
        decide(currentId, "accept");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        decide(currentId, "reject");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentId, decide]);

  // Deciding a change moves the review on to the next one.
  useEffect(() => {
    if (currentId === undefined) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hunkElements.current.get(currentId)?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [currentId]);

  return (
    <>
      <NoteScrollArea>
        <div className="flex flex-col gap-2">
          {review.hunks.map((hunk, index) => {
            if (hunk.kind === "same") return <MarkdownLines key={`same-${index}`} lines={hunk.lines} />;

            const decision = review.decisions[hunk.id];
            return decision ? (
              <MarkdownLines
                key={`change-${hunk.id}`}
                lines={resolveHunk(hunk, decision)}
                className="animate-in fade-in duration-200"
              />
            ) : (
              <DiffHunk
                key={`change-${hunk.id}`}
                ref={(element) => {
                  if (element) hunkElements.current.set(hunk.id, element);
                  else hunkElements.current.delete(hunk.id);
                }}
                hunk={hunk}
                isCurrent={hunk.id === currentId}
                onAccept={() => decide(hunk.id, "accept")}
                onReject={() => decide(hunk.id, "reject")}
              />
            );
          })}
        </div>
      </NoteScrollArea>

      <NoteFooter className="flex items-center gap-2 px-6">
        <p aria-live="polite" className="mr-auto text-sm text-muted-foreground">
          {t("pending", { count: review.pendingCount })}
        </p>
        <Button variant="ghost" size="sm" onClick={() => review.decideRemaining("reject")}>
          {t("rejectAll")}
        </Button>
        <Button size="sm" onClick={() => review.decideRemaining("accept")}>
          <Check className="size-4" />
          {t("acceptAll")}
        </Button>
      </NoteFooter>
    </>
  );
};
