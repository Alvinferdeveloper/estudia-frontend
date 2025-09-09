
import { Sparkles, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UIMessage } from "ai";

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedText: string | null;
    messages: UIMessage[];
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, selectedText, messages, input, onInputChange, onFormSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="w-96 border-l border-border bg-card flex flex-col h-full">
            {/* Chat Header */}
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
                        <p className="text-sm text-foreground line-clamp-3">"{selectedText}"</p>
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
                <form onSubmit={onFormSubmit} className="flex gap-2">
                    <Input
                        placeholder="Ask about the document..."
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
}
