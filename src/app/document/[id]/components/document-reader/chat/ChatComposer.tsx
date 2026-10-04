import { useEffect, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { useAutoResizeTextarea } from "@/app/document/[id]/hooks/useAutoResizeTextarea";
import { ChatContext } from "@/app/document/[id]/lib/chat-message";
import { ContextQuote } from "./ContextQuote";

interface ChatComposerProps {
  isBusy: boolean;
  context: ChatContext | null;
  onSend: (question: string) => void;
  onStop: () => void;
  onClearContext: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ isBusy, context, onSend, onStop, onClearContext }) => {
  const [value, setValue] = useState("");
  const textareaRef = useAutoResizeTextarea(value);
  const canSend = value.trim().length > 0 && !isBusy;

  useEffect(() => {
    if (context) textareaRef.current?.focus();
  }, [context, textareaRef]);

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
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
    <div className="shrink-0 px-3 pb-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="mx-auto max-w-[68ch] rounded-2xl border border-sidebar-border bg-background shadow-sm transition-[border-color,box-shadow] duration-150 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring"
      >
        {context && (
          <div className="px-2 pt-2">
            <ContextQuote context={context} onRemove={onClearContext} />
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Mensaje para el asistente"
          placeholder={context ? "Pregunta sobre este fragmento…" : "Pregunta sobre el documento…"}
          className="block max-h-48 w-full resize-none bg-transparent px-3.5 pb-1 pt-3 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="flex justify-end px-2 pb-2">
          {isBusy ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Detener respuesta"
              title="Detener respuesta"
              className="press-feedback flex size-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Square className="size-3 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Enviar mensaje"
              title="Enviar mensaje"
              className="press-feedback flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-muted disabled:text-muted-foreground"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
