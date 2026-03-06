
import { ZoomIn, ZoomOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PdfControlsProps {
    pageNumber: number;
    numPages: number | null;
    scale: number;
    isChatOpen: boolean;
    selectedText: string | null;
    onChatToggle: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export const PdfControls: React.FC<PdfControlsProps> = ({ 
    pageNumber, 
    numPages, 
    scale, 
    isChatOpen, 
    selectedText, 
    onChatToggle,
    onZoomIn,
    onZoomOut,
}) => (
    <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Page {pageNumber || 1} of {numPages || "--"}
                    </span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-12 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={onZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Button
                variant={isChatOpen ? "default" : "outline"}
                size="sm"
                onClick={onChatToggle}
                className="gap-2"
            >
                <MessageSquare className="h-4 w-4" />
                AI Assistant
                {selectedText && (
                    <Badge variant="secondary" className="ml-1">
                        Text Selected
                    </Badge>
                )}
            </Button>
        </div>
    </div>
);
