import { UIMessage } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/app/document/[id]/components/document-reader/note-ui/MarkdownRenderer";

interface ChatMessageListProps {
  messages: UIMessage[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  return (
    <ScrollArea className="flex-1 p-4 overflow-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] py-4 rounded-lg ${message.role === "user"
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
                }`}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  message.role === "assistant" ? (
                    <MarkdownRenderer key={index} content={part.text} compact />
                  ) : (
                    <p key={index} className="text-[15px] px-4 leading-relaxed whitespace-pre-wrap">
                      {part.text}
                    </p>
                  )
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
