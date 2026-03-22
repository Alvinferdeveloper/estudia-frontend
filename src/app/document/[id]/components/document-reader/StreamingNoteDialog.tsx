"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, RefreshCw, Save, MessageSquare, FileText, Edit3, Trash2 } from "lucide-react";
import { useStreamingNote } from "@/app/document/[id]/hooks/useStreamingNote";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Annotation } from "@/app/types";

const COLORS = [
  { name: "Yellow", value: "#FFEB3B" },
  { name: "Green", value: "#A5D6A7" },
  { name: "Blue", value: "#90CAF9" },
  { name: "Pink", value: "#F48FB1" },
  { name: "Orange", value: "#FFCC80" },
  { name: "Purple", value: "#CE93D8" },
];

interface StreamingNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentFileName: string;
  onSaveNote: (content: { selectedText: string; comment: string; aiResponse: string; color: string }) => Promise<void>;
  onDeleteNote?: (id: string) => Promise<void>;
  existingAnnotation?: Annotation | null;
}

export const StreamingNoteDialog: React.FC<StreamingNoteDialogProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentFileName,
  onSaveNote,
  onDeleteNote,
  existingAnnotation,
}) => {
  const [prompt, setPrompt] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [changePrompt, setChangePrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const noteAreaRef = useRef<HTMLDivElement>(null);
  const initialPromptRef = useRef("");
  const initialCompletionRef = useRef("");

  const {
    completion,
    isLoading,
    error,
    complete,
    stop,
    setCompletion,
  } = useStreamingNote();

  const isEditMode = !!existingAnnotation;

  const handleReset = useCallback(() => {
    setPrompt("");
    setChangePrompt("");
    setSaveError(null);
    setCompletion("");
    setIsExpanded(false);
    initialPromptRef.current = "";
    initialCompletionRef.current = "";
  }, [setCompletion]);

  useEffect(() => {
    if (isOpen) {
      if (existingAnnotation) {
        setPrompt(existingAnnotation.comment || "");
        setSelectedColor(existingAnnotation.color);
        setCompletion(existingAnnotation.aiResponse || "");
        initialPromptRef.current = existingAnnotation.comment || "";
        initialCompletionRef.current = existingAnnotation.aiResponse || "";
        setIsExpanded(true);
      } else {
        handleReset();
      }
    }
  }, [isOpen, existingAnnotation, handleReset]);

  useEffect(() => {
    if (noteAreaRef.current && completion) {
      noteAreaRef.current.scrollTop = noteAreaRef.current.scrollHeight;
    }
  }, [completion]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    initialPromptRef.current = prompt;
    setIsExpanded(true);
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

  const handleDelete = async () => {
    if (!existingAnnotation || !onDeleteNote) return;

    setIsDeleting(true);
    try {
      await onDeleteNote(existingAnnotation.id);
      handleClose();
    } catch (err) {
      console.error("Error deleting note:", err);
      setSaveError("Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
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
  const showGeneratedNote = isExpanded && completion;
  const hasChanges = completion !== initialCompletionRef.current;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`
    ${showGeneratedNote
            ? 'h-[95vh]'
            : 'max-h-[95vh]'
          }
        w-[80vw]
        max-w-[85vw]
        flex flex-col p-0 gap-0
  `}
        style={{
          maxWidth: '85vw'
        }}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <p className="text-xs text-muted-foreground">{documentFileName}</p>
              </div>
            </div>
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive mr-6 cursor-pointer hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {showGeneratedNote ? (
            <div className="flex-1 flex flex-col overflow-hidden">

              <div className="border-b bg-muted/30 shrink-0">
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                    <FileText className="w-3 h-3" />
                    Selected Text
                  </div>
                  <div className="max-h-24 overflow-y-auto w-full">
                    <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap pr-4">
                      {selectedText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-3 border-b bg-gradient-to-r from-primary to-primary/70 dark:from-primary/30 dark:to-primary/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">
                        {isEditMode ? "Current Note" : "Generated Note"}
                      </span>
                    </div>
                    <span className="text-xs text-white truncate max-w-[200px]" title={initialPromptRef.current}>
                      {initialPromptRef.current}
                    </span>
                  </div>
                </div>

                <div ref={noteAreaRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4 text-foreground mt-6 first:mt-0">{children}</h1>,
                        h2: ({ children }: any) => <h2 className="text-xl font-semibold mb-3 text-foreground mt-6">{children}</h2>,
                        h3: ({ children }: any) => <h3 className="text-lg font-medium mb-2 text-foreground mt-4">{children}</h3>,
                        p: ({ children }: any) => <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>,
                        ul: ({ children }: any) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }: any) => <li className="text-foreground/90">{children}</li>,
                        code: ({ className, children, ...props }: any) => {
                          const isInline = !className;
                          if (isInline) {
                            return <code className="px-1.5 py-0.5 rounded bg-muted text-purple-600 dark:text-purple-400 text-sm font-mono" {...props}>{children}</code>;
                          }
                          return <code className={className} {...props}>{children}</code>;
                        },
                        pre: ({ children }: any) => <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 border">{children}</pre>,
                        blockquote: ({ children }: any) => <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-50 dark:bg-purple-950/30 italic">{children}</blockquote>,
                        strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
                        em: ({ children }: any) => <em className="italic">{children}</em>,
                        hr: () => <hr className="my-6 border-muted" />,
                        table: ({ children }: any) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse border border-border">{children}</table></div>,
                        th: ({ children }: any) => <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">{children}</th>,
                        td: ({ children }: any) => <td className="border border-border px-3 py-2">{children}</td>,
                      }}
                    >
                      {completion + (isLoading ? " ▊" : "")}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="border-t p-3 bg-muted/30 shrink-0">

                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <Textarea
                    id="change-prompt"
                    placeholder="e.g., Make it shorter, Add more examples..."
                    value={changePrompt}
                    onChange={(e) => setChangePrompt(e.target.value)}
                    className="min-h-[40px] h-[40px] w-full resize-none py-2 text-sm"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (changePrompt.trim() && !isLoading) handleRequestChanges();
                      }
                    }}
                  />
                  <div className="flex flex-row gap-2 shrink-0 self-end sm:self-auto mt-1 sm:mt-0">
                    {isLoading ? (
                      <Button variant="outline" onClick={handleStop} size="sm">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Stop
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleRegenerate} size="sm" title="Regenerate from initial prompt">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          className="rounded-sm bg-primary cursor-pointer"
                          onClick={handleRequestChanges}
                          disabled={!changePrompt.trim()}
                          size="sm"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Apply
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {(hasError || saveError) && (
                  <p className="text-xs text-red-500 mt-1">{hasError ? error?.message : saveError}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Selected Text
                </Label>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {selectedText.length > 300 ? selectedText.substring(0, 300) + "..." : selectedText}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt-input" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  What would you like the AI to do?
                </Label>
                <Textarea
                  id="prompt-input"
                  placeholder="e.g., Summarize this, Explain this in simple terms, Create a quiz question..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Highlight Color</Label>
                <div className="flex gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color.value
                        ? "border-primary ring-2 ring-primary/30 ring-offset-2"
                        : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {hasError && <p className="text-sm text-red-500">{hasError}</p>}
            </div>
          )}
        </div>

        <div className="border-t p-4 flex items-center justify-between shrink-0 bg-background">
          {showGeneratedNote ? (
            <>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Highlight Color:</Label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color.value
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent"
                        }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-sm cursor-pointer" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !isReady}
                  className={'bg-primary cursor-pointer rounded-sm'}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditMode && !hasChanges ? (
                    <>

                      Update Color
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "Save Changes" : "Save Note"}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" className="rounded-sm cursor-pointer" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="bg-primary cursor-pointer rounded-sm"
              >
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
