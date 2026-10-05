"use client";

import { useState } from "react";
import { ArrowLeft, History, SquarePen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseChatSessionReturn } from "@/app/[locale]/document/[id]/hooks/useChatSession";
import { IconButton } from "@/components/ui/icon-button";
import { TextQuote } from "@/app/[locale]/document/[id]/components/document-reader/shared/TextQuote";
import { PromptComposer } from "@/app/[locale]/document/[id]/components/document-reader/shared/PromptComposer";
import { ChatPanelHeader } from "./ChatPanelHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatEmptyState } from "./ChatEmptyState";
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
      <IconButton label="Nueva conversación" onClick={startNewConversation} disabled={isEmptyDraft && view === "chat"}>
        <SquarePen />
      </IconButton>
      <IconButton label="Cerrar asistente" onClick={onClose}>
        <X />
      </IconButton>
    </>
  );

  return (
    <section aria-label="Asistente IA" className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {view === "history" ? (
        <div key="history" className={cn(viewTransition, "slide-in-from-left-2")}>
          <ChatPanelHeader
            leading={
              <IconButton label="Volver al chat" onClick={() => setView("chat")}>
                <ArrowLeft />
              </IconButton>
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
              <IconButton label="Ver conversaciones" onClick={() => setView("history")}>
                <History />
              </IconButton>
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
          <div className="shrink-0 px-3 pb-3">
            <PromptComposer
              label="Mensaje para el asistente"
              placeholder={session.context ? "Pregunta sobre este fragmento…" : "Pregunta sobre el documento…"}
              isBusy={isBusy}
              onSubmit={session.send}
              onStop={session.stop}
              focusKey={session.context}
              header={
                session.context && (
                  <TextQuote
                    text={session.context.text}
                    caption={`Pág. ${session.context.page}`}
                    onRemove={session.clearContext}
                  />
                )
              }
              className="mx-auto max-w-[68ch]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
