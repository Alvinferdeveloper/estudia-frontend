"use client";

import { useState } from "react";
import { Sparkles, X, Send, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessageList } from "./ChatMessageList";
import { UIMessage } from "ai";
import { Conversation } from "@/app/types";

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (id: string) => void;
    onRenameConversation: (id: string, title: string) => void;
    messages: UIMessage[];
    input: string;
    selectedText: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onSuggestionSubmit?: (suggestion: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    isOpen,
    onClose,
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onRenameConversation,
    messages,
    input,
    selectedText,
    onInputChange,
    onFormSubmit,
    onSuggestionSubmit,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    if (!isOpen) return null;

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
        <div className="w-96 border-l border-border bg-card flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <h3 className="font-serif font-semibold">AI Assistant</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
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
                        className="h-7 px-2 text-xs"
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
                onSuggestionSubmit={onSuggestionSubmit}
            />

            <div className="p-4 border-t border-border">
                <form onSubmit={onFormSubmit} className="flex gap-2">
                    <Input
                        placeholder={
                            activeConversationId
                                ? "Pregunta sobre el documento..."
                                : "Crea o selecciona una conversación"
                        }
                        value={input}
                        onChange={onInputChange}
                        disabled={!activeConversationId}
                        className="flex-1"
                    />
                    <Button type="submit" size="sm" disabled={!activeConversationId}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
