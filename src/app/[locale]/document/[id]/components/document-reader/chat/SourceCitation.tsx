import { useTranslations } from "next-intl";
import type { ChatSource } from "@/app/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TextQuote } from "@/app/[locale]/document/[id]/components/document-reader/shared/TextQuote";

interface SourceCitationProps {
  number: number;
  source: ChatSource;
  onSelect: (source: ChatSource) => void;
}

// An inline [n] in a reply: previews its passage on hover or focus, opens it in the PDF on click.
export const SourceCitation: React.FC<SourceCitationProps> = ({ number, source, onSelect }) => {
  const t = useTranslations("chat");

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(source)}
          aria-label={t("assistantMessage.sourceLabel", { number, page: source.pageNumber })}
          className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-1 items-center justify-center rounded-full bg-primary/10 px-1 align-baseline font-mono text-[10px] font-semibold leading-none text-primary transition-colors duration-150 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {number}
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-72 p-1.5">
        <TextQuote text={source.content} caption={t("pageCaption", { page: source.pageNumber })} className="bg-transparent" />
      </HoverCardContent>
    </HoverCard>
  );
};
