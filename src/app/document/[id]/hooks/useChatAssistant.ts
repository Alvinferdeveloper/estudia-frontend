import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatStatus, type UIMessage } from "ai";
import { Message } from "@/app/types";
import { useFetchMessages } from "@/app/document/[id]/hooks/useFetchMessages";
import { useCreateMessage } from "@/app/document/[id]/hooks/useCreateMessage";
import { getMessageText } from "@/app/document/[id]/lib/chat-message";

interface UseChatAssistantOptions {
  documentId: string;
  documentName: string;
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
  documentName,
  conversationId,
}: UseChatAssistantOptions): UseChatAssistantReturn => {
  const history = useFetchMessages(documentId, conversationId);
  const { mutate: saveMessage } = useCreateMessage(documentId);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
        credentials: "include",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, documentId, documentName, conversationId },
        }),
      }),
    [documentId, documentName, conversationId]
  );

  const { messages, sendMessage, setMessages, status, error, regenerate, stop } = useChat({
    id: conversationId ?? DRAFT_CHAT_ID,
    transport,
    onFinish: ({ message, isError }) => {
      const text = getMessageText(message);
      if (isError || !conversationId || !text) return;
      saveMessage({ conversationId, role: "assistant", content: text });
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
      saveMessage({ conversationId, role: "user", content: text });
    },
    [conversationId, sendMessage, saveMessage]
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
