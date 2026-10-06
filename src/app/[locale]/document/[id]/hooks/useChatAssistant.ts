import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatStatus, type UIMessage } from "ai";
import { Message } from "@/app/types";
import { useFetchMessages } from "@/app/[locale]/document/[id]/hooks/useFetchMessages";
import { getMessageText } from "@/app/[locale]/document/[id]/lib/chat-message";
import { apiUrl } from "@/lib/api-client";
import { useRefreshUsage } from "@/app/[locale]/subscription/hooks/useSubscription";

interface UseChatAssistantOptions {
  documentId: string;
  conversationId: string | null;
}

export interface UseChatAssistantReturn {
  messages: UIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  isLoadingHistory: boolean;
  send: (text: string) => void;
  retry: () => void;
  stop: () => void;
}

// useChat builds its Chat (transport + callbacks) once per id, so keying it by conversation keeps them bound to it.
const DRAFT_CHAT_ID = "draft";

const toUIMessage = (message: Message): UIMessage => ({
  id: message.id,
  role: message.role,
  parts: [{ type: "text", text: message.content }],
});

export const useChatAssistant = ({
  documentId,
  conversationId,
}: UseChatAssistantOptions): UseChatAssistantReturn => {
  const history = useFetchMessages(documentId, conversationId);
  const queryClient = useQueryClient();
  const refreshUsage = useRefreshUsage();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiUrl("/ai/chat"),
        credentials: "include",
        // The server keeps the history; send only the message to answer (on retry, the same one again).
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { conversationId, message: getMessageText(messages[messages.length - 1]) },
        }),
      }),
    [conversationId]
  );

  const { messages, sendMessage, setMessages, status, error, regenerate, stop } = useChat({
    id: conversationId ?? DRAFT_CHAT_ID,
    transport,
    // The server stored both turns and charged (or refunded) the reply; refresh what changed.
    onFinish: () => {
      refreshUsage();
      queryClient.invalidateQueries({ queryKey: ["messages", documentId, conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", documentId] });
    },
  });

  const hydratedConversation = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || !history.data || hydratedConversation.current === conversationId) return;
    hydratedConversation.current = conversationId;
    if (messages.length === 0) setMessages(history.data.map(toUIMessage));
  }, [conversationId, history.data, messages.length, setMessages]);

  const send = useCallback(
    (text: string) => {
      if (!conversationId) return;
      sendMessage({ text });
    },
    [conversationId, sendMessage]
  );

  const retry = useCallback(() => {
    regenerate();
  }, [regenerate]);

  return {
    messages,
    status,
    error,
    isLoadingHistory: history.isLoading,
    send,
    retry,
    stop,
  };
};
