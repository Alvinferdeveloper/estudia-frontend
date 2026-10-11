"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BookOpen, Loader2, Download, ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportAnnotations, downloadExport, ExportFormat } from "@/app/[locale]/document/[id]/hooks/useExportAnnotations";
import { ExamHeaderActions } from "@/app/[locale]/document/[id]/components/exam/ExamHeaderActions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LanguageFlag } from "@/app/[locale]/document/[id]/components/document-reader/language-ui";
import { LanguageCode, LanguageOption } from "@/app/types";
import { ROUTES } from "@/config/routes";
import { CreditIndicator } from "@/components/credit-indicator";

interface HeaderProps {
    fileName: string;
    documentId: string;
    examMode: boolean;
    onToggleExamMode: () => void;
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
    examMode,
    onToggleExamMode,
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
                    <ExamHeaderActions
                        documentId={documentId}
                        examMode={examMode}
                        onToggleExamMode={onToggleExamMode}
                    />
                    {!examMode && onToggleLanguageMode && (
                        <>
                            <Separator orientation="vertical" className="mx-1 h-5" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleLanguageMode}
                                aria-pressed={languageModeEnabled}
                                title={t("languageModeHint")}
                            >
                                <Languages />
                                {t("languageMode")}
                            </Button>
                            <div className="flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
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
                                            className="flex w-auto gap-1 rounded-full p-1"
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
                            <IconButton label={t("export.trigger")} disabled={isPending}>
                                {isPending ? <Loader2 className="animate-spin" /> : <Download />}
                            </IconButton>
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
