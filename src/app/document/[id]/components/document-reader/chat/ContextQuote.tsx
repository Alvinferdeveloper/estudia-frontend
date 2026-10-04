import { TextQuote, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatContext } from "@/app/document/[id]/lib/chat-message";

interface ContextQuoteProps {
  context: ChatContext;
  onRemove?: () => void;
  className?: string;
}

export const ContextQuote: React.FC<ContextQuoteProps> = ({ context, onRemove, className }) => (
  <figure className={cn("flex items-start gap-2 rounded-lg bg-muted px-2.5 py-2 text-xs", className)}>
    <TextQuote aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
    <div className="min-w-0 flex-1">
      <blockquote className="line-clamp-3 leading-relaxed text-foreground/80">{context.text}</blockquote>
      <figcaption className="mt-1 text-muted-foreground">Pág. {context.page}</figcaption>
    </div>
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar fragmento"
        title="Quitar fragmento"
        className="-m-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-3.5" />
      </button>
    )}
  </figure>
);
