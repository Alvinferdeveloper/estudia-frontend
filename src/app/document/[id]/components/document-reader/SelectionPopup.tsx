
import { motion } from "motion/react";
import { MessageSquare, StickyNote } from "lucide-react";

interface SelectionPopupProps {
    selectedText: string | null;
    onChatClick: () => void;
    onCreateNoteClick: () => void;
}

export const SelectionPopup: React.FC<SelectionPopupProps> = ({
    selectedText,
    onChatClick,
    onCreateNoteClick
}) => {
    if (!selectedText) return null;

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
                Chat
            </button>
            <div className="h-4 w-px bg-border" />
            <button
                onClick={onCreateNoteClick}
                className="press-feedback flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-primary/10 hover:text-primary"
            >
                <StickyNote className="h-3.5 w-3.5" />
                Nota
            </button>
        </motion.div>
    );
}
