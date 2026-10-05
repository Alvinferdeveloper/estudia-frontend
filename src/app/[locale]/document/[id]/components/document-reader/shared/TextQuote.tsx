"use client";

import { useState } from "react";
import { TextQuote as TextQuoteIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TextQuoteProps {
  text: string;
  caption?: string;
  onRemove?: () => void;
  // Long quotes start clamped and can be opened in place.
  expandable?: boolean;
  className?: string;
}

const LONG_QUOTE_LENGTH = 220;

export const TextQuote: React.FC<TextQuoteProps> = ({ text, caption, onRemove, expandable = false, className }) => {
  const t = useTranslations("reader.quote");
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = expandable && text.length > LONG_QUOTE_LENGTH;

  return (
    <figure className={cn("flex items-start gap-2 rounded-lg bg-muted px-2.5 py-2 text-xs", className)}>
      <TextQuoteIcon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <blockquote
          className={cn(
            "whitespace-pre-wrap leading-relaxed text-foreground/80",
            !isExpanded && "line-clamp-3",
            isExpanded && "max-h-48 overflow-y-auto"
          )}
        >
          {text}
        </blockquote>
        {(caption || canExpand) && (
          <figcaption className="mt-1 flex items-center gap-2 text-muted-foreground">
            {caption}
            {canExpand && (
              <button
                type="button"
                onClick={() => setIsExpanded((open) => !open)}
                className="font-medium text-foreground/70 underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {isExpanded ? t("showLess") : t("showMore")}
              </button>
            )}
          </figcaption>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("remove")}
          title={t("remove")}
          className="-m-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </button>
      )}
    </figure>
  );
};
