import { useEffect } from "react";
import type { ChatStatus, UIMessage } from "ai";
import { useStickToBottom } from "@/app/[locale]/document/[id]/hooks/useStickToBottom";
import { getMessageText } from "@/app/[locale]/document/[id]/lib/chat-message";
import { AssistantMessage, AssistantMarkState } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import type { ApiErrorKey } from "@/lib/api-errors";
import { ChatError, MessagesSkeleton, PendingReply } from "./ChatStatus";

interface ChatMessageListProps {
  messages: UIMessage[];
  status: ChatStatus;
  errorKey: ApiErrorKey | null;
  isLoadingHistory: boolean;
  emptyState: React.ReactNode;
  onRetry: () => void;
  onSuggestionSelect: (suggestion: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  status,
  errorKey,
  isLoadingHistory,
  emptyState,
  onRetry,
  onSuggestionSelect,
}) => {
  const { scrollRef, contentRef, scrollToBottom } = useStickToBottom();
  const lastMessage = messages.at(-1);
  const isAwaitingReply =
    status === "submitted" || (status === "streaming" && lastMessage?.role === "user");

  // Sending always brings your own message into view, even if you had scrolled up.
  useEffect(() => {
    if (lastMessage?.role === "user") scrollToBottom();
  }, [lastMessage?.id, lastMessage?.role, scrollToBottom]);

  const getMarkState = (index: number): AssistantMarkState => {
    if (index !== messages.length - 1) return "hidden";
    return status === "streaming" ? "working" : "idle";
  };

  const renderMessages = () => {
    if (isLoadingHistory) return <MessagesSkeleton />;
    if (messages.length === 0 && status === "ready") return emptyState;

    return messages.map((message, index) => {
      const text = getMessageText(message);
      return message.role === "user" ? (
        <UserMessage key={message.id} text={text} />
      ) : (
        <AssistantMessage
          key={message.id}
          text={text}
          markState={getMarkState(index)}
          showSuggestions={index === messages.length - 1 && status === "ready"}
          onSuggestionSelect={onSuggestionSelect}
        />
      );
    });
  };

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div ref={contentRef} className="mx-auto flex min-h-full w-full max-w-[68ch] flex-col gap-6 px-4 py-6">
        {renderMessages()}
        {isAwaitingReply && <PendingReply />}
        {status === "error" && <ChatError errorKey={errorKey} onRetry={onRetry} />}
      </div>
    </div>
  );
};
