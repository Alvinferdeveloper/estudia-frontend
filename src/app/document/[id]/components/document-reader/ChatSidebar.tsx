"use client";

import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessageList } from "./ChatMessageList";
import { UIMessage } from "ai";

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
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
    messages,
    input,
    selectedText,
    onInputChange,
    onFormSubmit,
    onSuggestionSubmit,
}) => {
    if (!isOpen) return null;

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
                {selectedText && (
                    <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Selected Text:</p>
                        <p className="text-sm text-foreground line-clamp-3">&quot;{selectedText}&quot;</p>
                    </div>
                )}
            </div>

            <ChatMessageList
                messages={messages}
                onSuggestionSubmit={onSuggestionSubmit}
            />

            <div className="p-4 border-t border-border">
                <form onSubmit={onFormSubmit} className="flex gap-2">
                    <Input
                        placeholder="Pregunta sobre el documento..."
                        value={input}
                        onChange={onInputChange}
                        className="flex-1"
                    />
                    <Button type="submit" size="sm">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
