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
}: UseChatAssistantOptions): UseChatAssistantReturn => {
  const [input, setInput] = useState("");

  const { data: initialMessages } = useFetchMessages(documentId);
  const { mutate: createMessage } = useCreateMessage(documentId);

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
      api: "/api/chat", prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            messages,
            documentId,
            documentName,
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
      if (input.trim()) {
        sendMessage({ parts: [{ type: "text" as const, text: input, }] });
        createMessage({ role: "user", content: input });
        setInput("");
      }
    },
    [input, sendMessage, createMessage]
  );

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
