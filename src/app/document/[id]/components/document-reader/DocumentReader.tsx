"use client";

import { useState } from "react";
import { useFetchAnnotations, useDeleteAnnotation } from "@/app/document/[id]/hooks/useAnnotations";
import { useDocumentViewer } from "@/app/document/[id]/hooks/useDocumentViewer";
import { useTextSelection } from "@/app/document/[id]/hooks/useTextSelection";
import { useChatAssistant } from "@/app/document/[id]/hooks/useChatAssistant";

import { Header } from "@/app/document/[id]/components/document-reader/Header";
import { PdfControls } from "@/app/document/[id]/components/document-reader/PdfControls";
import { PdfViewer } from "@/app/document/[id]/components/document-reader/PdfViewer";
import { ChatSidebar } from "@/app/document/[id]/components/document-reader/ChatSidebar";
import { SelectionPopup } from "@/app/document/[id]/components/document-reader/SelectionPopup";
import { StreamingNoteDialog } from "@/app/document/[id]/components/document-reader/StreamingNoteDialog";
import { AnnotationPopup } from "@/app/document/[id]/components/document-reader/AnnotationPopup";
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

    const {
        selectedText,
        selectionRects,
        selectedPage,
        handleTextSelection,
        clearSelection,
    } = useTextSelection();

    const {
        messages,
        input,
        handleInputChange,
        handleFormSubmit,
    } = useChatAssistant({ documentId: document.id });

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
    const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

    const { data: annotations = [], refetch: refetchAnnotations } = useFetchAnnotations(document.id);
    const { mutate: deleteAnnotation } = useDeleteAnnotation(document.id);

    const handleChatToggle = () => setIsChatOpen((prev) => !prev);

    const handleNoteDialogOpen = () => setIsNoteDialogOpen(true);

    const handleNoteDialogClose = () => {
        setIsNoteDialogOpen(false);
        clearSelection();
    };

    const handleSaveNote = async (noteData: {
        selectedText: string;
        comment: string;
        aiResponse: string;
        color: string;
    }) => {
        const { selectedText, comment, aiResponse, color } = noteData;

        const rects = selectionRects.map((r) => ({
            x1: r.left,
            y1: r.top,
            x2: r.left + r.width,
            y2: r.top + r.height,
            width: r.pageWidth || 800,
            height: r.pageHeight || 1200,
            pageNumber: selectedPage,
        }));

        const boundingRect = {
            x1: Math.min(...rects.map((r) => r.x1)),
            y1: Math.min(...rects.map((r) => r.y1)),
            x2: Math.max(...rects.map((r) => r.x2)),
            y2: Math.max(...rects.map((r) => r.y2)),
            width: rects[0]?.width || 800,
            height: rects[0]?.height || 1200,
            pageNumber: currentPage,
        };

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/annotations`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedText,
                    comment,
                    aiResponse,
                    color,
                    pageNumber: currentPage,
                    boundingRect,
                    rects,
                }),
            }
        );

        refetchAnnotations();
    };

    const handleAnnotationClick = (annotation: Annotation) => {
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
                    selectedText={selectedText}
                    messages={messages}
                    input={input}
                    onInputChange={handleInputChange}
                    onFormSubmit={handleFormSubmit}
                />
            </div>

            <StreamingNoteDialog
                isOpen={isNoteDialogOpen}
                onClose={handleNoteDialogClose}
                selectedText={selectedText || ""}
                documentFileName={document.fileName}
                onSaveNote={handleSaveNote}
            />

            {selectedAnnotation && (
                <AnnotationPopup
                    annotation={selectedAnnotation}
                    onClose={() => setSelectedAnnotation(null)}
                    onDelete={handleDeleteAnnotation}
                />
            )}
        </div>
    );
};
