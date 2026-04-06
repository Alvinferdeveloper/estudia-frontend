"use client";

import { BookOpen, Loader2, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportAnnotations, downloadExport, ExportFormat } from "@/app/document/[id]/hooks/useExportAnnotations";
import { ExamMode } from "@/app/document/[id]/components/exam/ExamMode";
import { DocumentFile } from "@/app/document/[id]/page";

interface HeaderProps {
    fileName: string;
    documentId: string;
    numPages: number;
    document: DocumentFile;
    examMode?: boolean;
    selectedPages?: number[];
    pdfDoc?: any;
    onEnableExamMode?: () => void;
    onDisableExamMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    fileName, 
    documentId, 
    numPages, 
    document,
    examMode = false,
    selectedPages = [],
    pdfDoc,
    onEnableExamMode,
    onDisableExamMode,
}) => {
    const { mutate: exportNotes, isPending } = useExportAnnotations(documentId);

    const handleExport = (format: ExportFormat) => {
        exportNotes(format, {
            onSuccess: (data) => {
                downloadExport(data);
            },
        });
    };

    return (
        <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-accent" />
                        <h1 className="text-xl font-serif font-bold text-foreground">AI PDF Reader</h1>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <p className="text-sm text-muted-foreground truncate max-w-md">{fileName}</p>
                </div>
                <div className="flex items-center gap-2">
                    <ExamMode 
                        document={document} 
                        numPages={numPages}
                        examMode={examMode}
                        selectedPages={selectedPages}
                        pdfDoc={pdfDoc}
                        onEnableExamMode={onEnableExamMode || (() => {})}
                        onDisableExamMode={onDisableExamMode || (() => {})}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                Export Notes
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport("markdown")}>
                                Markdown (.md)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("pdf")}>
                                PDF (.pdf)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("json")}>
                                JSON (.json)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                CSV (.csv)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("anki")}>
                                Anki Flashcards (.apkg)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport("anki")} className="text-xs text-muted-foreground">
                                Import to Anki app
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
