
import { motion } from "motion/react";
import { MessageSquare, StickyNote, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

interface SelectionPopupProps {
    selectedText: string | null;
    mode?: "notes" | "language";
    onChatClick: () => void;
    onCreateNoteClick: () => void;
    onExplainClick?: (anchor: Element) => void;
}

export const SelectionPopup: React.FC<SelectionPopupProps> = ({
    selectedText,
    mode = "notes",
    onChatClick,
    onCreateNoteClick,
    onExplainClick,
}) => {
    const t = useTranslations("reader.selectionPopup");

    if (!selectedText) return null;

    const isLanguageMode = mode === "language";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="flex items-center gap-0.5 rounded-full border border-border/60 bg-card/95 p-1 shadow-lg shadow-black/10 backdrop-blur-md"
            onMouseDown={(e) => e.preventDefault()}
        >
            <button
                onClick={onChatClick}
                className="press-feedback flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-primary/10 hover:text-primary"
            >
                <MessageSquare className="h-3.5 w-3.5" />
                {t("chat")}
            </button>
            <div className="h-4 w-px bg-border" />
            {isLanguageMode ? (
                <button
                    onClick={(e) => onExplainClick?.(e.currentTarget)}
                    className="press-feedback flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-violet-500/10 hover:text-violet-500"
                >
                    <Languages className="h-3.5 w-3.5" />
                    {t("explain")}
                </button>
            ) : (
                <button
                    onClick={onCreateNoteClick}
                    className="press-feedback flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-primary/10 hover:text-primary"
                >
                    <StickyNote className="h-3.5 w-3.5" />
                    {t("note")}
                </button>
            )}
        </motion.div>
    );
}
