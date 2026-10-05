import { ZocratisMark } from "@/components/brand/ZocratisMark";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui/MarkdownRenderer";
import { splitAssistantText } from "@/app/[locale]/document/[id]/lib/chat-message";
import { PromptList } from "./PromptList";

// Only the latest reply carries the mark: animated while it's being written, still once it's done.
export type AssistantMarkState = "hidden" | "idle" | "working";

interface AssistantMessageProps {
  text: string;
  markState: AssistantMarkState;
  showSuggestions: boolean;
  onSuggestionSelect: (suggestion: string) => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  text,
  markState,
  showSuggestions,
  onSuggestionSelect,
}) => {
  const { content, suggestions } = splitAssistantText(text);

  return (
    <article className="min-w-0">
      <MarkdownRenderer content={content} className="px-0" />
      {markState !== "hidden" && (
        <ZocratisMark animated={markState === "working"} className="mt-3 size-6 text-primary" />
      )}
      {showSuggestions && suggestions.length > 0 && (
        <PromptList
          label="Preguntas sugeridas"
          prompts={suggestions}
          onSelect={onSuggestionSelect}
          className="-mx-2 mt-4 border-t border-sidebar-border pt-3"
        />
      )}
    </article>
  );
};
