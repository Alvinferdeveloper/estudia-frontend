import { UIMessage } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";

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
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? <span key={index}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
