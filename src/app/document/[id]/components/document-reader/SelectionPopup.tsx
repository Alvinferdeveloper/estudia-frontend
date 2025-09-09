
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionPopupProps {
    selectedText: string | null;
    position: { x: number; y: number };
    onChatClick: () => void;
}

export const SelectionPopup: React.FC<SelectionPopupProps> = ({ selectedText, position, onChatClick }) => {
    if (!selectedText) return null;

    return (
        <div style={{ position: 'fixed', top: position.y, left: position.x }}>
            <Button onClick={onChatClick} size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat about this
            </Button>
        </div>
    );
}
