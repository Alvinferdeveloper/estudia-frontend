import { UIMessage } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/app/document/[id]/components/document-reader/note-ui/MarkdownRenderer";
import { Sparkles, ChevronRight } from "lucide-react";

interface ChatMessageListProps {
  messages: UIMessage[];
  onSuggestionSubmit?: (suggestion: string) => void;
}

function extractSuggestions(text: string): string[] {
  const match = text.match(/\[SUGGESTIONS\]([\s\S]*?)$/i);
  if (!match) return [];

  const suggestionsText = match[1];
  const suggestions = suggestionsText
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(line => line.length > 0 && line !== 'NONE');

  return suggestions.slice(0, 3);
}

function cleanMessageText(text: string): string {
  return text.replace(/\[SUGGESTIONS\][\s\S]*$/i, '').trim();
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, onSuggestionSubmit }) => {
  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSubmit?.(suggestion);
  };
  return (
    <ScrollArea className="flex-1 p-4 overflow-auto">
      <div className="space-y-6">
        {messages.map((message) => {
          const textPart = message.parts.find(p => p.type === "text");
          const fullText = textPart?.text || '';
          const suggestions = message.role === "assistant" ? extractSuggestions(fullText) : [];
          const cleanText = cleanMessageText(fullText);

          return (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-2 shadow-sm ${message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                  : "bg-muted/50 text-foreground border border-border/50 rounded-2xl rounded-tl-sm"
                  }`}
              >
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    message.role === "assistant" ? (
                      <div key={index} className="prose prose-sm dark:prose-invert max-w-none">
                        <MarkdownRenderer content={cleanText} compact />
                      </div>
                    ) : (
                      <p key={index} className="text-[15px] px-4 text-foreground leading-relaxed whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  ) : null
                )}

                {suggestions.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/60">
                    <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sugerencias relacionadas</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="group flex items-center justify-between gap-2 text-sm bg-background border border-border hover:border-primary/50 hover:bg-background/80 cursor-pointer text-foreground px-3.5 py-2 rounded-xl transition-all duration-200 text-left shadow-sm active:scale-[0.98]"
                        >
                          <span className="leading-tight">{suggestion}</span>
                          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};