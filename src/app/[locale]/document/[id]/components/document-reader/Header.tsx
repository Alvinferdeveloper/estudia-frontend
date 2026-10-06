"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BookOpen, Loader2, Download, ArrowLeft, Languages } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportAnnotations, downloadExport, ExportFormat } from "@/app/[locale]/document/[id]/hooks/useExportAnnotations";
import { ExamMode } from "@/app/[locale]/document/[id]/components/exam/ExamMode";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LanguageFlag } from "@/app/[locale]/document/[id]/components/document-reader/language-ui";
import { DocumentFile } from "@/app/[locale]/document/[id]/page";
import { LanguageCode, LanguageOption } from "@/app/types";
import { ROUTES } from "@/config/routes";
import { CreditIndicator } from "@/components/credit-indicator";

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
    languageModeEnabled?: boolean;
    wordLanguage?: LanguageCode;
    explanationLanguage?: LanguageCode;
    onToggleLanguageMode?: () => void;
    isTargetEditable?: boolean;
    availableTargets?: LanguageOption[];
    onTargetChange?: (code: LanguageCode) => void;
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
    languageModeEnabled = false,
    wordLanguage = "en",
    explanationLanguage = "es",
    onToggleLanguageMode,
    isTargetEditable = false,
    availableTargets = [],
    onTargetChange,
}) => {
    const t = useTranslations("reader.header");
    const tLanguages = useTranslations("vocabulary.languages");
    const [isTargetPickerOpen, setIsTargetPickerOpen] = useState(false);
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
                    <Link
                        href={ROUTES.workspace}
                        className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                        title={t("backToWorkspace")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-accent" />
                        <h1 className="text-xl font-bold tracking-tight text-foreground">{t("title")}</h1>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <p className="text-sm text-muted-foreground truncate max-w-md">{fileName}</p>
                </div>
                <div className="flex items-center gap-1">
                    <CreditIndicator />
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <ExamMode
                        document={document}
                        numPages={numPages}
                        examMode={examMode}
                        selectedPages={selectedPages}
                        pdfDoc={pdfDoc}
                        onEnableExamMode={onEnableExamMode || (() => {})}
                        onDisableExamMode={onDisableExamMode || (() => {})}
                    />
                    {!examMode && onToggleLanguageMode && (
                        <>
                            <Separator orientation="vertical" className="mx-1 h-5" />
                            <button
                                onClick={onToggleLanguageMode}
                                title={t("languageModeHint")}
                                className={`press-feedback flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                                    languageModeEnabled
                                        ? "bg-violet-500/15 text-violet-500"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                            >
                                <Languages className="h-4 w-4" />
                                {t("languageMode")}
                            </button>
                            <div className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-500">
                                <LanguageFlag code={wordLanguage} />
                                <span>→</span>
                                {isTargetEditable ? (
                                    <Popover open={isTargetPickerOpen} onOpenChange={setIsTargetPickerOpen}>
                                        <PopoverTrigger asChild>
                                            <button title={t("changeTargetLanguage")} className="press-feedback">
                                                <LanguageFlag code={explanationLanguage} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            align="end"
                                            className="flex w-auto gap-1 rounded-full border border-violet-500/30 bg-card p-1 shadow-lg"
                                        >
                                            {availableTargets.map((option) => (
                                                <button
                                                    key={option.code}
                                                    onClick={() => {
                                                        onTargetChange?.(option.code);
                                                        setIsTargetPickerOpen(false);
                                                    }}
                                                    title={tLanguages(option.code)}
                                                    className="press-feedback flex h-6 w-8 items-center justify-center rounded-full hover:bg-accent"
                                                >
                                                    <LanguageFlag code={option.code} className="h-full w-full" />
                                                </button>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <LanguageFlag code={explanationLanguage} />
                                )}
                            </div>
                        </>
                    )}
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                title={t("export.trigger")}
                                disabled={isPending}
                                className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            </button>
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
                                {t("export.anki")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport("anki")} className="text-xs text-muted-foreground">
                                {t("export.importToAnki")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
