import { useEffect, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/app/document/[id]/hooks/useAutoResizeTextarea";

interface PromptComposerProps {
  label: string;
  placeholder: string;
  isBusy: boolean;
  onSubmit: (text: string) => void;
  onStop: () => void;
  // Rendered above the textarea (e.g. an attached quote).
  header?: React.ReactNode;
  // Rendered on the left of the bottom row, next to the send button.
  leading?: React.ReactNode;
  // Focuses the textarea whenever this value changes to something truthy.
  focusKey?: unknown;
  className?: string;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  label,
  placeholder,
  isBusy,
  onSubmit,
  onStop,
  header,
  leading,
  focusKey,
  className,
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useAutoResizeTextarea(value);
  const canSubmit = value.trim().length > 0 && !isBusy;

  useEffect(() => {
    if (focusKey) textareaRef.current?.focus();
  }, [focusKey, textareaRef]);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing: Enter confirms an IME candidate (accents, CJK) rather than sending.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "rounded-2xl border border-border bg-background shadow-sm transition-[border-color,box-shadow] duration-150 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring",
        className
      )}
    >
      {header && <div className="px-2 pt-2">{header}</div>}
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={label}
        placeholder={placeholder}
        className="block max-h-48 w-full resize-none bg-transparent px-3.5 pb-1 pt-3 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center gap-2 px-2 pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">{leading}</div>
        {isBusy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Detener"
            title="Detener"
            className="press-feedback flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Square className="size-3 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Enviar"
            title="Enviar"
            className="press-feedback flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:text-muted-foreground"
          >
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
};
