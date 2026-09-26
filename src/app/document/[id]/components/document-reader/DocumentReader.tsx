"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useDocumentViewer } from "@/app/document/[id]/hooks/useDocumentViewer";
import { useTextSelection } from "@/app/document/[id]/hooks/useTextSelection";
import { useChatAssistant } from "@/app/document/[id]/hooks/useChatAssistant";
import { useCreateMessage } from "@/app/document/[id]/hooks/useCreateMessage";
import { useConversations } from "@/app/document/[id]/hooks/useConversations";
import { useAnnotationActions } from "@/app/document/[id]/hooks/useAnnotationActions";
import { useVocabularyActions } from "@/app/document/[id]/hooks/useVocabularyActions";
import { useLanguageMode } from "@/app/document/[id]/hooks/useLanguageMode";
import { useDocumentImages } from "@/app/document/[id]/hooks/useDocumentImages";
import { useVisualQuery } from "@/app/document/[id]/hooks/useVisualQuery";
import { useQuickTranslate } from "@/app/document/[id]/hooks/useQuickTranslate";
import { useDocumentLanguages } from "@/app/document/[id]/hooks/useDocumentLanguages";
import { findOverlappingImage } from "@/app/document/[id]/lib/region-overlap";
import { UIMessage } from "ai";

import { Header } from "@/app/document/[id]/components/document-reader/Header";
import { PdfControls } from "@/app/document/[id]/components/document-reader/PdfControls";
import { PdfViewer, PdfHighlightItem } from "@/app/document/[id]/components/document-reader/PdfViewer";
import { ChatSidebar } from "@/app/document/[id]/components/document-reader/ChatSidebar";
import { SelectionPopup } from "@/app/document/[id]/components/document-reader/SelectionPopup";
import { QuickTranslateBubble } from "@/app/document/[id]/components/document-reader/QuickTranslateBubble";
import { StreamingNoteDialog } from "@/app/document/[id]/components/document-reader/StreamingNoteDialog";
import { VocabularyCard } from "@/app/document/[id]/components/document-reader/language-ui";
import { VisualQueryPanel } from "@/app/document/[id]/components/document-reader/VisualQueryPanel";
import { DocumentFile } from "@/app/document/[id]/page";
import { Annotation, VocabularyEntry } from "@/app/types";

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

    const [examMode, setExamMode] = useState(false);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const {
        list: conversations,
        create: createConversation,
        remove: deleteConversation,
        rename: renameConversation,
    } = useConversations(document.id);

    const { mutate: createMessage } = useCreateMessage(document.id, conversationId);

    const {
        messages,
        input,
        isLoading: isChatLoading,
        handleInputChange,
        handleFormSubmit,
        setMessages,
        setInput,
    } = useChatAssistant({
        documentId: document.id,
        documentName: document.fileName,
        conversationId,
    });

    useEffect(() => {
        if (
            !conversationId &&
            conversations.data &&
            conversations.data.length > 0
        ) {
            setConversationId(conversations.data[0].id);
        }
    }, [conversations.data, conversationId]);

    const handleNewConversation = async () => {
        const conv = await createConversation.mutateAsync({});
        setConversationId(conv.id);
    };

    const handleSelectConversation = (id: string) => setConversationId(id);

    const handleDeleteConversation = async (id: string) => {
        await deleteConversation.mutateAsync(id);
        if (id === conversationId) setConversationId(null);
    };

    const handleRenameConversation = (id: string, title: string) =>
        renameConversation.mutateAsync({ id, title });

    const handleTogglePage = (pageNumber: number) => {
        setSelectedPages(prev => {
            if (prev.includes(pageNumber)) {
                return prev.filter(p => p !== pageNumber);
            }
            return [...prev, pageNumber];
        });
    };

    const handleEnableExamMode = () => {
        setExamMode(true);
    };

    const handleDisableExamMode = () => {
        setExamMode(false);
        setSelectedPages([]);
    };

    const handleSuggestionSubmit = (suggestion: string) => {
        setInput(suggestion);
        setIsChatOpen(true);
        setTimeout(() => {
            const form = window.document.querySelector('form') as HTMLFormElement;
            if (form) {
                form.requestSubmit();
            }
        }, 100);
    };

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
        if (conversationId) {
            createMessage({ role: "assistant", content });
        }
    };

    const {
        selectedText,
        selectionRects,
        selectedPage,
        handleTextSelection,
        clearSelection,
    } = useTextSelection({ onTextSelected: addContextMessage });

    const languageMode = useLanguageMode(document.id);

    // Instant translation popup on any selection, any mode.
    const quickTranslate = useQuickTranslate();
    const lang = useDocumentLanguages(selectedText, quickTranslate);

    useEffect(() => {
        if (selectedText) {
            quickTranslate.translate(selectedText, lang.target);
        } else {
            quickTranslate.clear();
        }
        // Only the selected text / target should re-trigger a translation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedText, lang.target]);

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

    // ─── Language Mode (vocabulary study) ───────────────────────────────
    const {
        vocabularyEntries,
        handleColorChange: handleVocabularyColorChange,
        handleSaveEntry,
        handleDeleteEntry,
    } = useVocabularyActions({
        documentId: document.id,
        currentPage,
        selectionRects,
        selectedPage,
    });

    const [isVocabularyCardOpen, setIsVocabularyCardOpen] = useState(false);
    const [editingVocabularyEntry, setEditingVocabularyEntry] = useState<VocabularyEntry | null>(null);
    const [vocabularyAnchorRect, setVocabularyAnchorRect] = useState<DOMRect | null>(null);

    const handleExplainClick = (anchorRect: DOMRect) => {
        setEditingVocabularyEntry(null);
        setVocabularyAnchorRect(anchorRect);
        setIsVocabularyCardOpen(true);
    };

    const handleVocabularyEntryClick = (entry: VocabularyEntry, anchorRect: DOMRect) => {
        setEditingVocabularyEntry(entry);
        setVocabularyAnchorRect(anchorRect);
        setIsVocabularyCardOpen(true);
    };

    const handleVocabularyCardClose = () => {
        setIsVocabularyCardOpen(false);
        setEditingVocabularyEntry(null);
        setVocabularyAnchorRect(null);
        clearSelection();
    };

    // A page change invalidates the anchored position, so close the card rather than leave it floating over stale content.
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (isVocabularyCardOpen) handleVocabularyCardClose();
    };

    const activeHighlights: PdfHighlightItem[] = languageMode.enabled
        ? vocabularyEntries.map((entry) => ({
              id: entry.id,
              color: entry.color,
              selectedText: entry.selectedText,
              pageNumber: entry.pageNumber,
              boundingRect: entry.boundingRect,
              rects: entry.rects,
          }))
        : annotations.map((annotation) => ({
              id: annotation.id,
              color: annotation.color,
              selectedText: annotation.selectedText,
              pageNumber: annotation.pageNumber,
              boundingRect: annotation.boundingRect,
              rects: annotation.rects,
          }));

    const handleHighlightClick = (id: string, anchorRect: DOMRect) => {
        if (languageMode.enabled) {
            const entry = vocabularyEntries.find((e) => e.id === id);
            if (entry) handleVocabularyEntryClick(entry, anchorRect);
        } else {
            const annotation = annotations.find((a) => a.id === id);
            if (annotation) handleAnnotationClick(annotation);
        }
    };

    // ─── Visual query (images/formulas on-demand) ──────────────────────
    const [regionMode, setRegionMode] = useState(false);
    const [isVisualQueryOpen, setIsVisualQueryOpen] = useState(false);
    const [pendingRegion, setPendingRegion] = useState<{
        pageNumber: number;
        imageBase64?: string;
        imageXref?: number;
    } | null>(null);

    const { data: documentImages = [] } = useDocumentImages(document.id);
    const visualQuery = useVisualQuery(document.id);

    const handleToggleRegionMode = () => setRegionMode((prev) => !prev);

    const handleRegionSelection = (region: {
        imageBase64: string;
        pageNumber: number;
        boundingRect: { x1: number; y1: number; x2: number; y2: number };
    }) => {
        const matchedImage = findOverlappingImage(
            region.boundingRect,
            region.pageNumber,
            documentImages
        );

        setPendingRegion({
            pageNumber: region.pageNumber,
            imageBase64: region.imageBase64,
            imageXref: matchedImage?.xref,
        });
        setIsVisualQueryOpen(true);
        visualQuery.reset();
    };

    const handleAskVisualQuery = (question: string) => {
        if (!pendingRegion) return;
        visualQuery.mutate({
            question,
            imageXref: pendingRegion.imageXref,
            pageNumber: pendingRegion.pageNumber,
            // Always send the canvas crop too when there's no xref match;
            // when there is a match, the backend re-extracts the original
            // binary from the PDF via the xref instead of using this.
            imageBase64: pendingRegion.imageXref
                ? undefined
                : pendingRegion.imageBase64,
        });
    };

    const handleVisualQueryClose = () => {
        setIsVisualQueryOpen(false);
        setPendingRegion(null);
        visualQuery.reset();
    };

    return (
        <div className="h-screen bg-background flex flex-col">
            <Header
                fileName={document.fileName}
                documentId={document.id}
                numPages={numPages || 0}
                document={document}
                examMode={examMode}
                selectedPages={selectedPages}
                pdfDoc={pdfDoc}
                onEnableExamMode={handleEnableExamMode}
                onDisableExamMode={handleDisableExamMode}
                languageModeEnabled={languageMode.enabled}
                wordLanguage={lang.documentLanguage}
                explanationLanguage={lang.target}
                onToggleLanguageMode={languageMode.toggle}
                isTargetEditable={lang.isFallbackActive}
                availableTargets={lang.availableFallbackTargets}
                onTargetChange={lang.setFallbackTarget}
            />

            <div className="flex-1 overflow-hidden">
                <Group orientation="horizontal" className="h-full">
                    <Panel minSize="40" className="flex flex-col relative">
                        <PdfControls
                            pageNumber={currentPage}
                            numPages={numPages}
                            scale={scale}
                            isChatOpen={isChatOpen}
                            selectedText={selectedText}
                            onChatToggle={handleChatToggle}
                            onZoomIn={zoomIn}
                            onZoomOut={zoomOut}
                            examMode={examMode}
                            selectedPages={selectedPages}
                            onPageSelect={handleTogglePage}
                            regionMode={regionMode}
                            onRegionModeToggle={handleToggleRegionMode}
                        />
                        <PdfViewer
                            publicUrl={document.publicUrl}
                            scale={scale}
                            highlights={activeHighlights}
                            setNumPages={setNumPages}
                            onTextSelection={handleTextSelection}
                            onPageChange={handlePageChange}
                            onHighlightClick={handleHighlightClick}
                            regionMode={regionMode}
                            onRegionSelection={handleRegionSelection}
                            selectionTip={
                                selectedText && !examMode && (
                                    <div className="flex flex-col items-center gap-1.5">
                                        <QuickTranslateBubble
                                            translation={quickTranslate.translation}
                                            isLoading={quickTranslate.isLoading}
                                        />
                                        <SelectionPopup
                                            selectedText={selectedText}
                                            mode={languageMode.enabled ? "language" : "notes"}
                                            onChatClick={handleChatToggle}
                                            onCreateNoteClick={handleNoteDialogOpen}
                                            onExplainClick={handleExplainClick}
                                        />
                                    </div>
                                )
                            }
                            examMode={examMode}
                            selectedPages={selectedPages}
                            onPageSelect={handleTogglePage}
                            onPdfLoad={setPdfDoc}
                        />
                    </Panel>

                    <AnimatePresence>
                        {isChatOpen && (
                            <>
                                <Separator className="group relative w-2.5 shrink-0 cursor-col-resize outline-none">
                                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors duration-150 group-hover:bg-primary/50 group-active:bg-primary" />
                                </Separator>
                                <Panel defaultSize="30" minSize="22" maxSize="45">
                                    <motion.div
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 24 }}
                                        transition={{ type: "spring", stiffness: 340, damping: 38 }}
                                        className="h-full"
                                    >
                                        <ChatSidebar
                                            onClose={() => setIsChatOpen(false)}
                                            conversations={conversations.data ?? []}
                                            activeConversationId={conversationId}
                                            onSelectConversation={handleSelectConversation}
                                            onNewConversation={handleNewConversation}
                                            onDeleteConversation={handleDeleteConversation}
                                            onRenameConversation={handleRenameConversation}
                                            messages={messages}
                                            isLoading={isChatLoading}
                                            selectedText={selectedText || ''}
                                            input={input}
                                            onInputChange={handleInputChange}
                                            onFormSubmit={handleFormSubmit}
                                            onSuggestionSubmit={handleSuggestionSubmit}
                                        />
                                    </motion.div>
                                </Panel>
                            </>
                        )}
                    </AnimatePresence>
                </Group>
            </div>

            <StreamingNoteDialog
                isOpen={isNoteDialogOpen}
                onClose={handleNoteDialogClose}
                selectedText={editingAnnotation?.selectedText || selectedText || ""}
                documentFileName={document.fileName}
                onSaveNote={async (noteData) => {
                    const saved = await handleSaveNote(noteData, editingAnnotation);
                    setEditingAnnotation(saved);
                    return saved;
                }}
                onDeleteNote={handleDeleteNote}
                onColorChange={(color) =>
                    editingAnnotation
                        ? handleColorChange(editingAnnotation.id, color)
                        : Promise.resolve()
                }
                onAnnotationUpdated={handleAnnotationUpdated}
                existingAnnotation={editingAnnotation}
            />

            <VocabularyCard
                isOpen={isVocabularyCardOpen}
                onClose={handleVocabularyCardClose}
                anchorRect={vocabularyAnchorRect}
                selectedText={editingVocabularyEntry?.selectedText || selectedText || ""}
                wordLanguage={lang.explainWordLanguage}
                explanationLanguage={lang.readerLanguage}
                documentFileName={document.fileName}
                onSaveEntry={handleSaveEntry}
                onDeleteEntry={handleDeleteEntry}
                onColorChange={handleVocabularyColorChange}
                onEntryUpdated={setEditingVocabularyEntry}
                existingEntry={editingVocabularyEntry}
            />

            <VisualQueryPanel
                isOpen={isVisualQueryOpen}
                onClose={handleVisualQueryClose}
                previewImage={pendingRegion?.imageBase64 ?? null}
                isLoading={visualQuery.isPending}
                answer={visualQuery.data ?? null}
                error={visualQuery.error?.message ?? null}
                onAsk={handleAskVisualQuery}
            />
        </div>
    );
};
