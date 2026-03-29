"use client";

import { useState } from "react";
import { useDocumentViewer } from "@/app/document/[id]/hooks/useDocumentViewer";
import { useTextSelection } from "@/app/document/[id]/hooks/useTextSelection";
import { useChatAssistant } from "@/app/document/[id]/hooks/useChatAssistant";
import { useCreateMessage } from "@/app/document/[id]/hooks/useCreateMessage";
import { useAnnotationActions } from "@/app/document/[id]/hooks/useAnnotationActions";
import { UIMessage } from "ai";

import { Header } from "@/app/document/[id]/components/document-reader/Header";
import { PdfControls } from "@/app/document/[id]/components/document-reader/PdfControls";
import { PdfViewer } from "@/app/document/[id]/components/document-reader/PdfViewer";
import { ChatSidebar } from "@/app/document/[id]/components/document-reader/ChatSidebar";
import { SelectionPopup } from "@/app/document/[id]/components/document-reader/SelectionPopup";
import { StreamingNoteDialog } from "@/app/document/[id]/components/document-reader/StreamingNoteDialog";
import { DocumentFile } from "@/app/document/[id]/page";
import { Annotation } from "@/app/types";

interface DocumentReaderProps {
    document: DocumentFile;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({ document }) => {
    const {
        currentPage,
        numPages,
        scale,
        setCurrentPage,
        setNumPages,
        zoomIn,
        zoomOut,
    } = useDocumentViewer();

    const { mutate: createMessage } = useCreateMessage(document.id);

    const {
        messages,
        input,
        handleInputChange,
        handleFormSubmit,
        setMessages,
    } = useChatAssistant({ documentId: document.id, documentName: document.fileName });

    const addContextMessage = (text: string, page: number) => {
        const content = `📌 Texto seleccionado (pág. ${page}):\n\n"${text}"\n\nPregunta lo que quieras sobre este fragmento.`;
        const contextMessage: UIMessage = {
            id: `context-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text" as const, text: content }],
        };
        setMessages((msgs) => {
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg?.role === "assistant" && lastMsg.id.startsWith("context-")) {
                return msgs;
            }
            return [...msgs, contextMessage];
        });
        createMessage({ role: "assistant", content });
    };

    const {
        selectedText,
        selectionRects,
        selectedPage,
        handleTextSelection,
        clearSelection,
    } = useTextSelection({ onTextSelected: addContextMessage });

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);

    const {
        annotations,
        handleAnnotationUpdated,
        handleColorChange,
        handleSaveNote,
        handleDeleteNote,
    } = useAnnotationActions({
        documentId: document.id,
        currentPage,
        selectionRects,
        selectedPage,
    });

    const handleChatToggle = () => setIsChatOpen((prev) => !prev);

    const handleNoteDialogOpen = () => {
        setEditingAnnotation(null);
        setIsNoteDialogOpen(true);
    };

    const handleAnnotationClick = (annotation: Annotation) => {
        setEditingAnnotation(annotation);
        setIsNoteDialogOpen(true);
    };

    const handleNoteDialogClose = () => {
        setIsNoteDialogOpen(false);
        setEditingAnnotation(null);
        clearSelection();
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
                        onChatToggle={handleChatToggle}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                    />
                    <PdfViewer
                        publicUrl={document.publicUrl}
                        scale={scale}
                        annotations={annotations}
                        setNumPages={setNumPages}
                        onTextSelection={handleTextSelection}
                        onPageChange={setCurrentPage}
                        onAnnotationClick={handleAnnotationClick}
                        selectionTip={
                            selectedText && (
                                <SelectionPopup
                                    selectedText={selectedText}
                                    onChatClick={handleChatToggle}
                                    onCreateNoteClick={handleNoteDialogOpen}
                                />
                            )
                        }
                    />
                </div>

                <ChatSidebar
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    messages={messages}
                    selectedText={selectedText || ''}
                    input={input}
                    onInputChange={handleInputChange}
                    onFormSubmit={handleFormSubmit}
                />
            </div>

            <StreamingNoteDialog
                isOpen={isNoteDialogOpen}
                onClose={handleNoteDialogClose}
                selectedText={editingAnnotation?.selectedText || selectedText || ""}
                documentFileName={document.fileName}
                onSaveNote={(noteData) => handleSaveNote(noteData, editingAnnotation)}
                onDeleteNote={handleDeleteNote}
                onColorChange={(color) =>
                    editingAnnotation
                        ? handleColorChange(editingAnnotation.id, color)
                        : Promise.resolve()
                }
                onAnnotationUpdated={handleAnnotationUpdated}
                existingAnnotation={editingAnnotation}
            />
        </div>
    );
};
