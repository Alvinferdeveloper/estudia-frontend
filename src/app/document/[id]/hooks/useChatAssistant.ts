import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatTransport } from "ai";
import { UIMessage } from "ai";
import { Message } from "@/app/types";
import { useFetchMessages } from "@/app/document/[id]/hooks/useFetchMessages";
import { useCreateMessage } from "@/app/document/[id]/hooks/useCreateMessage";

interface UseChatAssistantOptions {
  documentId: string;
  documentName: string;
  conversationId: string | null;
}

interface UseChatAssistantReturn {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setInput: (input: string) => void;
  setMessages: (messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void;
}

export const useChatAssistant = ({
  documentId,
  documentName,
  conversationId,
}: UseChatAssistantOptions): UseChatAssistantReturn => {
  const [input, setInput] = useState("");

  const { data: initialMessages } = useFetchMessages(documentId, conversationId);
  const { mutate: createMessage } = useCreateMessage(documentId, conversationId);

  const uiInitialMessages = useMemo(
    () =>
      (initialMessages || []).map((m: Message) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: "text" as const, text: m.content }],
      })),
    [initialMessages]
  );

  const { messages, sendMessage, setMessages, status, } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
      credentials: 'include',
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            messages,
            documentId,
            documentName,
            conversationId,
          },
        };
      },
    }),
    onFinish: (message) => {
      message.message.parts.forEach((part) => {
        if (part.type === "text") {
          createMessage({ role: "assistant", content: part.text });
        }
      });
    },
  });

  useEffect(() => {
    if (uiInitialMessages.length > 0 && messages.length === 0) {
      setMessages(uiInitialMessages);
    }
  }, [uiInitialMessages, messages.length, setMessages]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim() && conversationId) {
        sendMessage({ parts: [{ type: "text" as const, text: input, }] });
        createMessage({ role: "user", content: input });
        setInput("");
      }
    },
    [input, sendMessage, createMessage, conversationId]
  );

  const prevConversation = useRef(conversationId);
  useEffect(() => {
    if (prevConversation.current !== conversationId) {
      prevConversation.current = conversationId;
      setMessages([]);
    }
  }, [conversationId, setMessages]);

  return {
    messages,
    input,
    isLoading: status === 'streaming',
    handleInputChange,
    handleFormSubmit,
    setInput,
    setMessages,
  };
};
