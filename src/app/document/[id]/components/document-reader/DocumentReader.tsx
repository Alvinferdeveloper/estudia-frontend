
"use client";

import { useState, useEffect, useMemo } from "react";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useFetchMessages } from '@/app/document/[id]/hooks/useFetchMessages';
import { useCreateMessage } from '@/app/document/[id]/hooks/useCreateMessage';

import { Header } from './Header';
import { PdfControls } from './PdfControls';
import { PdfViewer } from './PdfViewer';
import { ChatSidebar } from './ChatSidebar';
import { SelectionPopup } from './SelectionPopup';
import { DocumentFile } from "../../page";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface DocumentReaderProps {
    document: DocumentFile;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({ document }) => {
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
            <Header fileName={document.fileName} />

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <PdfControls
                        pageNumber={pageNumber}
                        numPages={numPages}
                        scale={scale}
                        isChatOpen={isChatOpen}
                        selectedText={selectedText}
                        onPageChange={setPageNumber}
                        onScaleChange={setScale}
                        onChatToggle={() => setIsChatOpen(!isChatOpen)}
                    />
                    <PdfViewer
                        publicUrl={document.publicUrl}
                        pageNumber={pageNumber}
                        scale={scale}
                        onDocumentLoadSuccess={onDocumentLoadSuccess}
                        onTextSelection={handleTextSelection}
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

            <SelectionPopup
                selectedText={selectedText}
                position={popupPosition}
                onChatClick={handleChatClick}
            />
        </div>
    );
}
