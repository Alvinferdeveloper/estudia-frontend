"use client";

import { useState } from "react";
import { ArrowLeft, History, SquarePen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseChatSessionReturn } from "@/app/document/[id]/hooks/useChatSession";
import { ChatIconButton } from "./ChatIconButton";
import { ChatPanelHeader } from "./ChatPanelHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatComposer } from "./ChatComposer";
import { ConversationHistory } from "./ConversationHistory";

interface ChatPanelProps {
  session: UseChatSessionReturn;
  onClose: () => void;
}

type PanelView = "chat" | "history";

const viewTransition = "flex min-h-0 flex-1 flex-col animate-in fade-in duration-200 ease-[var(--ease-out)]";

export const ChatPanel: React.FC<ChatPanelProps> = ({ session, onClose }) => {
  const [view, setView] = useState<PanelView>("chat");
  const isBusy = session.status === "submitted" || session.status === "streaming";
  const isEmptyDraft = !session.activeConversation && session.messages.length === 0;

  const startNewConversation = () => {
    session.startNewConversation();
    setView("chat");
  };

  const headerActions = (
    <>
      <ChatIconButton label="Nueva conversación" onClick={startNewConversation} disabled={isEmptyDraft && view === "chat"}>
        <SquarePen />
      </ChatIconButton>
      <ChatIconButton label="Cerrar asistente" onClick={onClose}>
        <X />
      </ChatIconButton>
    </>
  );

  return (
    <section aria-label="Asistente IA" className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {view === "history" ? (
        <div key="history" className={cn(viewTransition, "slide-in-from-left-2")}>
          <ChatPanelHeader
            leading={
              <ChatIconButton label="Volver al chat" onClick={() => setView("chat")}>
                <ArrowLeft />
              </ChatIconButton>
            }
            title="Conversaciones"
            actions={headerActions}
          />
          <ConversationHistory
            conversations={session.conversations}
            isLoading={session.isLoadingConversations}
            activeConversationId={session.activeConversation?.id ?? null}
            onSelect={(id) => {
              session.selectConversation(id);
              setView("chat");
            }}
            onRename={session.renameConversation}
            onDelete={session.deleteConversation}
          />
        </div>
      ) : (
        <div key="chat" className={cn(viewTransition, "slide-in-from-right-2")}>
          <ChatPanelHeader
            leading={
              <ChatIconButton label="Ver conversaciones" onClick={() => setView("history")}>
                <History />
              </ChatIconButton>
            }
            title={session.activeConversation?.title ?? "Nueva conversación"}
            actions={headerActions}
          />
          <ChatMessageList
            key={session.activeConversation?.id ?? "draft"}
            messages={session.messages}
            status={session.status}
            isLoadingHistory={session.isLoadingHistory}
            emptyState={<ChatEmptyState onPromptSelect={session.send} />}
            onRetry={session.retry}
            onSuggestionSelect={session.send}
          />
          <ChatComposer
            isBusy={isBusy}
            context={session.context}
            onSend={session.send}
            onStop={session.stop}
            onClearContext={session.clearContext}
          />
        </div>
      )}
    </section>
  );
};
