"use client";

import { useState, useEffect, useMemo } from "react";
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { BookOpen, Upload, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MessageSquare, Send } from "lucide-react";
import { DocumentFile } from '../page';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge";
import { useChat } from "@ai-sdk/react";
import { useFetchMessages } from '../hooks/useFetchMessages';
import { useCreateMessage } from '../hooks/useCreateMessage';
import { DefaultChatTransport } from "ai";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface DocumentClientProps {
    document: DocumentFile;
}

export const DocumentClient: React.FC<DocumentClientProps> = ({ document }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [input, setInput] = useState('');

    const { data: initialMessages } = useFetchMessages(document.id);
    const { mutate: createMessage } = useCreateMessage(document.id);

    const uiInitialMessages = useMemo(() => (initialMessages || []).map((m) => ({
        id: m.id,
        role: m.role,
        parts: [{ type: 'text' as const, text: m.content }],
    })), [initialMessages]);

    const { messages, sendMessage, setMessages } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
        onFinish: (message) => {
            console.log(message);
            message.message.parts.forEach((part) => {
                if (part.type === 'text') {
                    createMessage({ role: 'assistant', content: part.text });
                }
            });
        }
    });

    useEffect(() => {
        if (uiInitialMessages.length > 0 && messages.length === 0) {
            setMessages(uiInitialMessages);
        }
    }, [uiInitialMessages, messages.length, setMessages]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectedText(selection.toString());
            setPopupPosition({ x: rect.left, y: rect.top - 40 });
        } else {
            setSelectedText(null);
        }
    };

    const handleChatClick = () => {
        setIsChatOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input });
        createMessage({ role: 'user', content: input });
        setInput('');
    };

    return (
        <div className="h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-accent" />
                            <h1 className="text-xl font-serif font-bold text-foreground">AI PDF Reader</h1>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <p className="text-sm text-muted-foreground truncate max-w-md">{document.fileName}</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* PDF Viewer */}
                <div className="flex-1 flex flex-col">
                    {/* PDF Controls */}
                    <div className="border-b border-border bg-card px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pageNumber <= 1}
                                        onClick={() => setPageNumber((prev) => prev - 1)}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {pageNumber || 1} of {numPages || "--"}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pageNumber >= (numPages || 0)}
                                        onClick={() => setPageNumber((prev) => prev + 1)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Separator orientation="vertical" className="h-4" />

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}>
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground min-w-12 text-center">{Math.round(scale * 100)}%</span>
                                    <Button variant="outline" size="sm" onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}>
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                variant={isChatOpen ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className="gap-2"
                            >
                                <MessageSquare className="h-4 w-4" />
                                AI Assistant
                                {selectedText && (
                                    <Badge variant="secondary" className="ml-1">
                                        Text Selected
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 overflow-auto bg-muted/30 p-8">
                        <div className="flex justify-center">
                            {document.publicUrl ? (
                                <div onMouseUp={handleTextSelection} className="shadow-2xl rounded-lg overflow-hidden bg-white">
                                    <PDFDocument file={document.publicUrl} onLoadSuccess={onDocumentLoadSuccess} className="max-w-none">
                                        <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer={true} renderTextLayer={true} />
                                    </PDFDocument>
                                </div>
                            ) : (
                                <Card className="p-12 text-center max-w-md">
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-semibold text-lg mb-2">Upload your PDF</h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Drag and drop your PDF here or click to select a file
                                            </p>
                                            <Button asChild>
                                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                                    Select File
                                                </label>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Chat Sidebar */}
                {isChatOpen && (
                    <div className="w-96 border-l border-border bg-card flex flex-col h-full">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-accent" />
                                    <h3 className="font-serif font-semibold">AI Assistant</h3>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
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
                            <form onSubmit={handleFormSubmit} className="flex gap-2">
                                <Input
                                    placeholder="Ask about the document..."
                                    value={input}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                                <Button type="submit" size="sm">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {selectedText && (
                <div style={{ position: 'fixed', top: popupPosition.y, left: popupPosition.x }}>
                    <Button onClick={handleChatClick} size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat about this
                    </Button>
                </div>
            )}
        </div>
    );
}
