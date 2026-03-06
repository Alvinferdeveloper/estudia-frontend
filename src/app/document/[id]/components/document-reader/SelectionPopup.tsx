
import { MessageSquare, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div
            className="flex gap-1 bg-background border p-1 rounded-md shadow-md"
            onMouseDown={(e) => e.preventDefault()}
        >
            <Button onClick={onChatClick} size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
            </Button>
            <Button onClick={onCreateNoteClick} size="sm" className="gap-2">
                <StickyNote className="h-4 w-4" />
                Note
            </Button>
        </div>
    );
}
