"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, RefreshCw, Save } from "lucide-react";
import { useStreamingNote } from "@/app/document/[id]/hooks/useStreamingNote";

const COLORS = [
  { name: "Yellow", value: "#FFEB3B" },
  { name: "Green", value: "#A5D6A7" },
  { name: "Blue", value: "#90CAF9" },
  { name: "Pink", value: "#F48FB1" },
  { name: "Orange", value: "#FFCC80" },
  { name: "Purple", value: "#CE93D8" },
];

type DialogStep = "input" | "editing";

interface StreamingNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentFileName: string;
  onSaveNote: (content: { selectedText: string; comment: string; aiResponse: string; color: string }) => Promise<void>;
}

export const StreamingNoteDialog: React.FC<StreamingNoteDialogProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentFileName,
  onSaveNote,
}) => {
  const [step, setStep] = useState<DialogStep>("input");
  const [prompt, setPrompt] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [changePrompt, setChangePrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialPromptRef = useRef("");

  const {
    completion,
    isLoading,
    error,
    complete,
    stop,
    setCompletion,
  } = useStreamingNote();

  const handleReset = useCallback(() => {
    setStep("input");
    setPrompt("");
    setChangePrompt("");
    setSaveError(null);
    setCompletion("");
    initialPromptRef.current = "";
  }, [setCompletion]);

  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen, handleReset]);

  useEffect(() => {
    if (contentRef.current && completion) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [completion]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    initialPromptRef.current = prompt;
    setStep("editing");
    await complete(prompt, {
      selectedText,
      prompt,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleRegenerate = async () => {
    setCompletion("");
    await complete(initialPromptRef.current, {
      selectedText,
      prompt: initialPromptRef.current,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleRequestChanges = async () => {
    if (!changePrompt.trim()) return;
    const combinedPrompt = `${initialPromptRef.current}. Also: ${changePrompt}`;
    setChangePrompt("");
    setCompletion("");
    await complete(combinedPrompt, {
      selectedText,
      prompt: combinedPrompt,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleStop = () => {
    stop();
    setStep("input");
  };

  const handleSave = async () => {
    if (!completion.trim()) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSaveNote({
        selectedText,
        comment: initialPromptRef.current,
        aiResponse: completion,
        color: selectedColor,
      });
      handleClose();
    } catch (err) {
      console.error("Error saving note:", err);
      setSaveError("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isLoading) {
      stop();
    }
    handleReset();
    onClose();
  };

  const isReady = completion.trim().length > 0 && !isLoading;
  const hasError = error !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create AI Study Note</DialogTitle>
          <DialogDescription>
            Generate interactive notes from the selected text. You can request changes until you&apos;re satisfied.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <div>
            <Label>Selected Text</Label>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm text-muted-foreground max-h-20 overflow-y-auto">
              {selectedText.length > 200 ? selectedText.substring(0, 200) + "..." : selectedText}
            </div>
          </div>

          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt-input">What would you like the AI to do?</Label>
                <Textarea
                  id="prompt-input"
                  placeholder="e.g., Summarize this, Explain this in simple terms, Create a quiz question from this..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Highlight Color</Label>
                <div className="flex gap-2 mt-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === color.value
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent"
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {hasError && <p className="text-sm text-red-500">{error.message}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Generated Note</Label>
                <ScrollArea className="mt-1 h-48 rounded-md border p-3 bg-muted/50">
                  <div ref={contentRef} className="text-sm whitespace-pre-wrap">
                    {completion}
                    {isLoading && <span className="animate-pulse">▊</span>}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <Label htmlFor="change-prompt">Request Changes</Label>
                <Textarea
                  id="change-prompt"
                  placeholder="e.g., Make it shorter, Add more details, Use simpler language..."
                  value={changePrompt}
                  onChange={(e) => setChangePrompt(e.target.value)}
                  className="mt-1"
                  rows={2}
                  disabled={isLoading}
                />
              </div>

              {hasError && <p className="text-sm text-red-500">{error.message}</p>}
              {saveError && <p className="text-sm text-red-500">{saveError}</p>}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          {step === "input" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
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
            </>
          ) : (
            <>
              <div className="flex gap-2">
                {isLoading ? (
                  <Button variant="outline" onClick={handleStop}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Stop
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleRegenerate}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRequestChanges}
                      disabled={!changePrompt.trim()}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Apply Changes
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={handleSave} disabled={isSaving || !isReady}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
