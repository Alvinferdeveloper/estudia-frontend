import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatStatus } from "ai";
import { Conversation } from "@/app/types";
import { useConversations } from "@/app/[locale]/document/[id]/hooks/useConversations";
import { useChatAssistant } from "@/app/[locale]/document/[id]/hooks/useChatAssistant";
import { ChatContext, type ChatUIMessage, composeChatMessage } from "@/app/[locale]/document/[id]/lib/chat-message";
import { toConversationTitle } from "@/app/[locale]/document/[id]/lib/conversation-groups";
import { type ApiErrorKey, getApiErrorKey } from "@/lib/api-errors";

interface UseChatSessionOptions {
  documentId: string;
}

interface PendingMessage {
  text: string;
  title: string;
}

export interface UseChatSessionReturn {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  activeConversation: Conversation | null;
  messages: ChatUIMessage[];
  status: ChatStatus;
  errorKey: ApiErrorKey | null;
  isLoadingHistory: boolean;
  context: ChatContext | null;
  attachContext: (context: ChatContext) => void;
  clearContext: () => void;
  send: (question: string) => void;
  retry: () => void;
  stop: () => void;
  selectConversation: (id: string) => void;
  startNewConversation: () => void;
  renameConversation: (id: string, title: string) => Promise<unknown>;
  deleteConversation: (id: string) => Promise<void>;
}

export const useChatSession = ({ documentId }: UseChatSessionOptions): UseChatSessionReturn => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [context, setContext] = useState<ChatContext | null>(null);
  const [draftError, setDraftError] = useState<Error | null>(null);
  const pendingMessage = useRef<PendingMessage | null>(null);
  const hasRestoredLatest = useRef(false);

  const { list, create, rename, remove } = useConversations(documentId);
  const { mutateAsync: createConversation } = create;
  const { mutateAsync: renameMutation } = rename;
  const { mutateAsync: removeConversation } = remove;
  const assistant = useChatAssistant({ documentId, conversationId });
  const { send: sendToConversation, retry: retryAssistant } = assistant;
  const conversations = list.data ?? [];

  // Reopen the latest conversation once on load; afterwards an empty selection means a fresh draft.
  useEffect(() => {
    if (hasRestoredLatest.current || !list.data) return;
    hasRestoredLatest.current = true;
    if (list.data[0]) setConversationId(list.data[0].id);
  }, [list.data]);

  // A draft's first message waits until its conversation exists and the chat has rebound to it.
  useEffect(() => {
    if (!conversationId || !pendingMessage.current) return;
    sendToConversation(pendingMessage.current.text);
    pendingMessage.current = null;
  }, [conversationId, sendToConversation]);

  const startConversation = useCallback(
    async (pending: PendingMessage) => {
      pendingMessage.current = pending;
      setDraftError(null);
      try {
        const conversation = await createConversation({ title: pending.title });
        setConversationId(conversation.id);
      } catch (error) {
        setDraftError(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [createConversation]
  );

  const send = useCallback(
    (question: string) => {
      const text = composeChatMessage(question, context);
      setContext(null);
      if (conversationId) {
        sendToConversation(text);
        return;
      }
      startConversation({ text, title: toConversationTitle(question) });
    },
    [context, conversationId, sendToConversation, startConversation]
  );

  const retry = useCallback(() => {
    if (draftError && pendingMessage.current) {
      startConversation(pendingMessage.current);
      return;
    }
    retryAssistant();
  }, [draftError, startConversation, retryAssistant]);

  const selectConversation = useCallback((id: string) => {
    setDraftError(null);
    setConversationId(id);
  }, []);

  const startNewConversation = useCallback(() => {
    pendingMessage.current = null;
    setDraftError(null);
    setConversationId(null);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      await removeConversation(id);
      if (id === conversationId) startNewConversation();
    },
    [removeConversation, conversationId, startNewConversation]
  );

  const renameConversation = useCallback(
    (id: string, title: string) => renameMutation({ id, title }),
    [renameMutation]
  );

  const clearContext = useCallback(() => setContext(null), []);

  const getStatus = (): ChatStatus => {
    if (create.isPending) return "submitted";
    if (draftError) return "error";
    return assistant.status;
  };

  const error = draftError ?? assistant.error;

  return {
    conversations,
    isLoadingConversations: list.isLoading,
    activeConversation: conversations.find((c) => c.id === conversationId) ?? null,
    messages: assistant.messages,
    status: getStatus(),
    errorKey: error ? getApiErrorKey(error) : null,
    isLoadingHistory: assistant.isLoadingHistory,
    context,
    attachContext: setContext,
    clearContext,
    send,
    retry,
    stop: assistant.stop,
    selectConversation,
    startNewConversation,
    renameConversation,
    deleteConversation,
  };
};
