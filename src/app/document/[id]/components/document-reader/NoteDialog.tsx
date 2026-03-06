"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

const COLORS = [
    { name: "Yellow", value: "#FFEB3B" },
    { name: "Green", value: "#A5D6A7" },
    { name: "Blue", value: "#90CAF9" },
    { name: "Pink", value: "#F48FB1" },
    { name: "Orange", value: "#FFCC80" },
    { name: "Purple", value: "#CE93D8" },
];

interface NoteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedText: string;
    onGenerate: (prompt: string, color: string) => Promise<void>;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({
    isOpen,
    onClose,
    selectedText,
    onGenerate,
}) => {
    const [prompt, setPrompt] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            await onGenerate(prompt, selectedColor);
            handleClose();
        } catch {
            setError("Failed to generate note. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClose = () => {
        setPrompt("");
        setSelectedColor(COLORS[0].value);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create AI Note</DialogTitle>
                    <DialogDescription>
                        Generate an AI note for the selected text. Choose a color to highlight it.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Selected Text</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md text-sm text-muted-foreground max-h-20 overflow-y-auto">
                            {selectedText.length > 200 ? selectedText.substring(0, 200) + "..." : selectedText}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="prompt">What would you like the AI to do?</Label>
                        <Textarea
                            id="prompt"
                            placeholder="e.g., Summarize this, Explain this in simple terms, Create a quiz question from this..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mt-1"
                            rows={3}
                        />
                        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                    </div>

                    <div>
                        <Label>Highlight Color</Label>
                        <div className="flex gap-2 mt-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                        selectedColor === color.value
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Note
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
