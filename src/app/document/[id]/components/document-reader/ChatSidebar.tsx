"use client";

import { useState } from "react";
import { Sparkles, X, Send, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessageList } from "./ChatMessageList";
import { UIMessage } from "ai";
import { Conversation } from "@/app/types";

interface ChatSidebarProps {
    onClose: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (id: string) => void;
    onRenameConversation: (id: string, title: string) => void;
    messages: UIMessage[];
    isLoading?: boolean;
    input: string;
    selectedText: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onSuggestionSubmit?: (suggestion: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    onClose,
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onRenameConversation,
    messages,
    isLoading,
    input,
    selectedText,
    onInputChange,
    onFormSubmit,
    onSuggestionSubmit,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    const startRename = (conv: Conversation) => {
        setEditingId(conv.id);
        setEditingTitle(conv.title);
    };

    const commitRename = () => {
        if (editingId && editingTitle.trim()) {
            onRenameConversation(editingId, editingTitle.trim());
        }
        setEditingId(null);
        setEditingTitle("");
    };

    return (
        <div className="w-full h-full border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold tracking-tight">Asistente IA</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="press-feedback" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        Conversaciones
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="press-feedback h-7 px-2 text-xs"
                        onClick={onNewConversation}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Nueva
                    </Button>
                </div>

                <div className="mt-2 max-h-44 overflow-y-auto flex flex-col gap-1">
                    {conversations.length === 0 && (
                        <p className="text-xs text-muted-foreground px-1 py-2">
                            Aún no hay conversaciones.
                        </p>
                    )}
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`group flex items-center gap-1 rounded-md px-2 py-1.5 cursor-pointer ${
                                conv.id === activeConversationId
                                    ? "bg-accent/20"
                                    : "hover:bg-accent/10"
                            }`}
                            onClick={() => onSelectConversation(conv.id)}
                            onDoubleClick={() => startRename(conv)}
                        >
                            {editingId === conv.id ? (
                                <Input
                                    autoFocus
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onBlur={commitRename}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") commitRename();
                                        if (e.key === "Escape") setEditingId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-7 text-sm"
                                />
                            ) : (
                                <>
                                    <span className="flex-1 truncate text-sm">
                                        {conv.title}
                                    </span>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startRename(conv);
                                        }}
                                        title="Renombrar"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteConversation(conv.id);
                                        }}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ChatMessageList
                messages={messages}
                isLoading={isLoading}
                onSuggestionSubmit={onSuggestionSubmit}
            />

            <div className="p-4 border-t border-border">
                <form
                    onSubmit={onFormSubmit}
                    className="flex items-center gap-1 rounded-full border border-border bg-background pl-4 pr-1.5 py-1.5 transition-colors duration-150 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
                >
                    <Input
                        placeholder={
                            activeConversationId
                                ? "Pregunta sobre el documento..."
                                : "Crea o selecciona una conversación"
                        }
                        value={input}
                        onChange={onInputChange}
                        disabled={!activeConversationId}
                        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 h-8 px-0"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!activeConversationId || !input.trim()}
                        className="press-feedback h-8 w-8 shrink-0 rounded-full"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
