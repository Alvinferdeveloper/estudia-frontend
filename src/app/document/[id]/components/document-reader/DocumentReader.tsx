
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useFetchMessages } from '@/app/document/[id]/hooks/useFetchMessages';
import { useCreateMessage } from '@/app/document/[id]/hooks/useCreateMessage';
import { useFetchAnnotations, useCreateAnnotation, useDeleteAnnotation } from '@/app/document/[id]/hooks/useAnnotations';

import { Header } from '@/app/document/[id]/components/document-reader/Header';
import { PdfControls } from '@/app/document/[id]/components/document-reader/PdfControls';
import { PdfViewer } from '@/app/document/[id]/components/document-reader/PdfViewer';
import { ChatSidebar } from '@/app/document/[id]/components/document-reader/ChatSidebar';
import { SelectionPopup } from '@/app/document/[id]/components/document-reader/SelectionPopup';
import { NoteDialog } from '@/app/document/[id]/components/document-reader/NoteDialog';
import { DocumentFile } from "@/app/document/[id]/page";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface DocumentReaderProps {
    document: DocumentFile;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({ document }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [selectionRects, setSelectionRects] = useState<{ top: number; left: number; width: number; height: number; pageWidth?: number; pageHeight?: number }[]>([]);
    const [input, setInput] = useState('');
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [isGeneratingNote, setIsGeneratingNote] = useState(false);
    const [selectedAnnotation, setSelectedAnnotation] = useState<any>(null);

    const { data: initialMessages } = useFetchMessages(document.id);
    const { mutate: createMessage } = useCreateMessage(document.id);
    const { data: annotations = [], refetch: refetchAnnotations } = useFetchAnnotations(document.id);
    const { mutate: createAnnotation } = useCreateAnnotation(document.id);
    const { mutate: deleteAnnotation } = useDeleteAnnotation(document.id);

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

    const handleTextSelection = useCallback((selection: { text: string; rects: { top: number; left: number; width: number; height: number; pageWidth?: number; pageHeight?: number }[]; pageNumber: number }) => {
        setSelectedText(selection.text);
        setSelectionRects(selection.rects);
        setSelectedPage(selection.pageNumber);
    }, []);

    const handleChatClick = () => {
        setIsChatOpen(true);
    };

    const handleCreateNoteClick = () => {
        setIsNoteDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input });
        createMessage({ role: 'user', content: input });
        setInput('');
    };

    const handleGenerateNote = async (prompt: string, color: string) => {
        if (!selectedText) return;

        setIsGeneratingNote(true);

        try {
            const response = await axios.post(
                `/api/generate-note`,
                {
                    selectedText,
                    prompt,
                    documentContext: `Document: ${document.fileName}`,
                }
            );

            const generatedContent = response.data.content;

            const rects = selectionRects.map(r => ({
                x1: r.left,
                y1: r.top,
                x2: r.left + r.width,
                y2: r.top + r.height,
                width: r.pageWidth || 800,
                height: r.pageHeight || 1200,
                pageNumber: selectedPage,
            }));

            const boundingRect = {
                x1: Math.min(...rects.map(r => r.x1)),
                y1: Math.min(...rects.map(r => r.y1)),
                x2: Math.max(...rects.map(r => r.x2)),
                y2: Math.max(...rects.map(r => r.y2)),
                width: rects[0]?.width || 800,
                height: rects[0]?.height || 1200,
                pageNumber: currentPage,
            };

            createAnnotation(
                {
                    selectedText,
                    comment: prompt,
                    aiResponse: generatedContent,
                    color,
                    pageNumber: currentPage,
                    boundingRect,
                    rects,
                },
                {
                    onSuccess: () => {
                        refetchAnnotations();
                    },
                }
            );
        } catch (error) {
            console.error("Error generating note:", error);
            throw error;
        } finally {
            setIsGeneratingNote(false);
        }
    };

    const handleAnnotationClick = (annotation: any) => {
        console.log('Annotation clicked:', annotation);
        setSelectedAnnotation(annotation);
    };

    const handleDeleteAnnotation = (annotationId: string) => {
        deleteAnnotation(annotationId, {
            onSuccess: () => {
                setSelectedAnnotation(null);
                refetchAnnotations();
            },
        });
    };

    return (
        <div className="h-screen bg-background flex flex-col">
            <Header fileName={document.fileName} />

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <PdfControls
                        pageNumber={currentPage}
                        numPages={numPages}
                        scale={scale}
                        isChatOpen={isChatOpen}
                        selectedText={selectedText}
                        onScaleChange={setScale}
                        onChatToggle={() => setIsChatOpen(!isChatOpen)}
                    />
                    <PdfViewer
                        publicUrl={document.publicUrl}
                        scale={scale}
                        annotations={annotations}
                        setNumPages={setNumPages}
                        onTextSelection={handleTextSelection}
                        onPageChange={setCurrentPage}
                        onAnnotationClick={handleAnnotationClick}
                        onAnnotationCreate={() => { }}
                        selectionTip={
                            <SelectionPopup
                                selectedText={selectedText}
                                onChatClick={handleChatClick}
                                onCreateNoteClick={handleCreateNoteClick}
                            />
                        }
                    />
                </div>

                <ChatSidebar
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    selectedText={selectedText}
                    messages={messages}
                    input={input}
                    onInputChange={handleInputChange}
                    onFormSubmit={handleFormSubmit}
                />
            </div>

            <NoteDialog
                isOpen={isNoteDialogOpen}
                onClose={() => setIsNoteDialogOpen(false)}
                selectedText={selectedText || ""}
                onGenerate={handleGenerateNote}
            />

            {selectedAnnotation && (
                <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-md z-50">
                    <div className="flex justify-between items-start mb-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: selectedAnnotation.color }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAnnotation(null)}
                        >
                            ×
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                        "{selectedAnnotation.selectedText}"
                    </p>
                    {selectedAnnotation.comment && (
                        <p className="text-xs text-muted-foreground mb-2">
                            Note: {selectedAnnotation.comment}
                        </p>
                    )}
                    {selectedAnnotation.aiResponse && (
                        <p className="text-sm">{selectedAnnotation.aiResponse}</p>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        className="mt-3"
                        onClick={() => handleDeleteAnnotation(selectedAnnotation.id)}
                    >
                        Delete Note
                    </Button>
                </div>
            )}
        </div>
    );
}
