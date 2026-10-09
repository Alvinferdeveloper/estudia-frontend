"use client";

import { useState, useEffect, useRef } from "react";
import { Group, Panel } from "react-resizable-panels";
import { useDocumentViewer } from "@/app/[locale]/document/[id]/hooks/useDocumentViewer";
import { useExamMode } from "@/app/[locale]/document/[id]/hooks/useExamMode";
import { useTextSelection } from "@/app/[locale]/document/[id]/hooks/useTextSelection";
import { useChatSession } from "@/app/[locale]/document/[id]/hooks/useChatSession";
import { useAnnotationActions } from "@/app/[locale]/document/[id]/hooks/useAnnotationActions";
import { useVocabularyActions } from "@/app/[locale]/document/[id]/hooks/useVocabularyActions";
import { useLanguageMode } from "@/app/[locale]/document/[id]/hooks/useLanguageMode";
import { useDocumentImages } from "@/app/[locale]/document/[id]/hooks/useDocumentImages";
import { useVisualQuery } from "@/app/[locale]/document/[id]/hooks/useVisualQuery";
import { useQuickTranslate } from "@/app/[locale]/document/[id]/hooks/useQuickTranslate";
import { useDocumentLanguages } from "@/app/[locale]/document/[id]/hooks/useDocumentLanguages";
import { LiveAnchorTarget } from "@/app/[locale]/document/[id]/hooks/useLiveAnchor";
import { findOverlappingImage } from "@/app/[locale]/document/[id]/lib/region-overlap";
import { ResizeHandle } from "@/components/ui/resize-handle";

import { Header } from "@/app/[locale]/document/[id]/components/document-reader/Header";
import { PdfControls } from "@/app/[locale]/document/[id]/components/document-reader/PdfControls";
import { PdfViewer, PdfHighlightItem, type PdfNavigation } from "@/app/[locale]/document/[id]/components/document-reader/PdfViewer";
import { PageThumbnails } from "@/app/[locale]/document/[id]/components/document-reader/thumbnails/PageThumbnails";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { useStoredBoolean } from "@/hooks/useStoredBoolean";
import { ChatPanel } from "@/app/[locale]/document/[id]/components/document-reader/chat";
import { ExamSetupPanel } from "@/app/[locale]/document/[id]/components/exam/ExamSetupPanel";
import { SelectionPopup } from "@/app/[locale]/document/[id]/components/document-reader/SelectionPopup";
import { QuickTranslateBubble } from "@/app/[locale]/document/[id]/components/document-reader/QuickTranslateBubble";
import { NoteDialog } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import { VocabularyCard } from "@/app/[locale]/document/[id]/components/document-reader/language-ui";
import { VisualQueryPanel } from "@/app/[locale]/document/[id]/components/document-reader/VisualQueryPanel";
import { DocumentFile } from "@/app/[locale]/document/[id]/page";
import { Annotation, VocabularyEntry } from "@/app/types";
import { getApiErrorKey } from "@/lib/api-errors";

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

    const exam = useExamMode();
    const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
    const [isThumbnailsOpen, toggleThumbnails] = useStoredBoolean("reader:thumbnailsOpen");
    const navigationRef = useRef<PdfNavigation>(null);

    // In exam mode a thumbnail also selects its page, like clicking the page itself.
    const handleThumbnailClick = (pageNumber: number) => {
        if (exam.enabled) exam.togglePage(pageNumber);
        navigationRef.current?.goToPage(pageNumber);
    };

    const chat = useChatSession({ documentId: document.id });

    const {
        selectedText,
        selectionRects,
        selectedPage,
        handleTextSelection,
        clearSelection,
    } = useTextSelection();

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

    const handleAskAboutSelection = () => {
        if (selectedText) chat.attachContext({ text: selectedText, page: selectedPage });
        setIsChatOpen(true);
    };

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
    const [vocabularyAnchor, setVocabularyAnchor] = useState<LiveAnchorTarget | null>(null);
    const [readerViewport, setReaderViewport] = useState<HTMLDivElement | null>(null);

    // Anchor to the selected word itself; the popup button is only a fallback if the selection is gone.
    const handleExplainClick = (fallbackAnchor: Element) => {
        const selection = window.getSelection();
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
        setEditingVocabularyEntry(null);
        setVocabularyAnchor(range ?? fallbackAnchor);
        setIsVocabularyCardOpen(true);
    };

    const handleVocabularyEntryClick = (entry: VocabularyEntry, anchor: Element) => {
        setEditingVocabularyEntry(entry);
        setVocabularyAnchor(anchor);
        setIsVocabularyCardOpen(true);
    };

    const handleVocabularyCardClose = () => {
        setIsVocabularyCardOpen(false);
        setEditingVocabularyEntry(null);
        setVocabularyAnchor(null);
        clearSelection();
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

    const handleHighlightClick = (id: string, anchor: Element) => {
        if (languageMode.enabled) {
            const entry = vocabularyEntries.find((e) => e.id === id);
            if (entry) handleVocabularyEntryClick(entry, anchor);
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
                examMode={exam.enabled}
                onToggleExamMode={exam.toggle}
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
                    <Panel minSize="40" className="relative flex">
                        {isThumbnailsOpen && pdfDoc && (
                            <PageThumbnails
                                pdf={pdfDoc}
                                currentPage={currentPage}
                                onPageClick={handleThumbnailClick}
                                selectedPages={exam.enabled ? exam.selectedPages : undefined}
                            />
                        )}
                        <div className="relative flex min-w-0 flex-1 flex-col">
                            <PdfControls
                                pageNumber={currentPage}
                                numPages={numPages}
                                scale={scale}
                                isChatOpen={isChatOpen}
                                selectedText={selectedText}
                                onChatToggle={handleChatToggle}
                                onZoomIn={zoomIn}
                                onZoomOut={zoomOut}
                                isThumbnailsOpen={isThumbnailsOpen}
                                onThumbnailsToggle={toggleThumbnails}
                                examMode={exam.enabled}
                                regionMode={regionMode}
                                onRegionModeToggle={handleToggleRegionMode}
                            />
                            <PdfViewer
                                publicUrl={document.publicUrl}
                                scale={scale}
                                highlights={activeHighlights}
                                setNumPages={setNumPages}
                                onTextSelection={handleTextSelection}
                                onPageChange={setCurrentPage}
                                onHighlightClick={handleHighlightClick}
                                regionMode={regionMode}
                                onRegionSelection={handleRegionSelection}
                                viewportRef={setReaderViewport}
                                selectionTip={
                                    <div>
                                        {selectedText && !exam.enabled && (
                                            <div key={selectedText} className="flex flex-col items-center gap-1.5">
                                                <QuickTranslateBubble
                                                    translation={quickTranslate.translation}
                                                    isLoading={quickTranslate.isLoading}
                                                />
                                                <SelectionPopup
                                                    selectedText={selectedText}
                                                    mode={languageMode.enabled ? "language" : "notes"}
                                                    onChatClick={handleAskAboutSelection}
                                                    onCreateNoteClick={handleNoteDialogOpen}
                                                    onExplainClick={handleExplainClick}
                                                />
                                            </div>
                                        )}
                                    </div>
                                }
                                examMode={exam.enabled}
                                selectedPages={exam.selectedPages}
                                onPageSelect={exam.togglePage}
                                onPdfLoad={setPdfDoc}
                                navigationRef={navigationRef}
                            />
                        </div>
                    </Panel>

                    {exam.enabled ? (
                        <>
                            <ResizeHandle />
                            <Panel defaultSize="28" minSize="22" maxSize="40">
                                <div className="h-full animate-in fade-in slide-in-from-right-4 duration-200 ease-[var(--ease-out)]">
                                    <ExamSetupPanel
                                        documentId={document.id}
                                        documentName={document.fileName}
                                        selectedPages={exam.selectedPages}
                                        pdfDoc={pdfDoc}
                                        onClose={exam.exit}
                                    />
                                </div>
                            </Panel>
                        </>
                    ) : isChatOpen && (
                        <>
                            <ResizeHandle />
                            <Panel defaultSize="30" minSize="22" maxSize="45">
                                <div className="h-full animate-in fade-in slide-in-from-right-4 duration-200 ease-[var(--ease-out)]">
                                    <ChatPanel session={chat} onClose={() => setIsChatOpen(false)} />
                                </div>
                            </Panel>
                        </>
                    )}
                </Group>
            </div>

            <NoteDialog
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
                existingAnnotation={editingAnnotation}
            />

            <VocabularyCard
                isOpen={isVocabularyCardOpen}
                onClose={handleVocabularyCardClose}
                anchor={vocabularyAnchor}
                portalContainer={readerViewport}
                selectedText={editingVocabularyEntry?.selectedText || selectedText || ""}
                wordLanguage={lang.explainWordLanguage}
                explanationLanguage={lang.readerLanguage}
                sourceLanguage={lang.documentLanguage}
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
                errorKey={visualQuery.error && getApiErrorKey(visualQuery.error)}
                onAsk={handleAskVisualQuery}
            />
        </div>
    );
};
