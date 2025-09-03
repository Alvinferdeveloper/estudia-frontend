"use client";

import { useState } from "react";
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
    const [inputMessage, setInputMessage] = useState<string>("")
    const [messages, setMessages] = useState([
        {
            id: "1",
            text: "¡Hola! Soy tu asistente de estudio con IA. Selecciona cualquier texto del PDF y pregúntame lo que necesites saber.",
            isUser: false,
            timestamp: new Date(),
        },
    ])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            console.log("Selected Text:", selection.toString());
            // Future: Send this text to LLM
        }
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

            <div className="flex-1 flex">
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
                                        Página {pageNumber || 1} de {numPages || "--"}
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
                                Asistente IA
                                {selectedText && (
                                    <Badge variant="secondary" className="ml-1">
                                        Texto seleccionado
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
                                            <h3 className="font-serif font-semibold text-lg mb-2">Sube tu documento PDF</h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionar
                                            </p>
                                            <Button asChild>
                                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                                    Seleccionar archivo
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
                    <div className="w-96 border-l border-border bg-card flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-accent" />
                                    <h3 className="font-serif font-semibold">Asistente IA</h3>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {selectedText && (
                                <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Texto seleccionado:</p>
                                    <p className="text-sm text-foreground line-clamp-3">"{selectedText}"</p>
                                </div>
                            )}
                        </div>

                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${message.isUser ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <p className="text-sm">{message.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Pregunta sobre el documento..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    className="flex-1"
                                />
                                <Button size="sm">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
