import { useState, useCallback, MutableRefObject, useEffect } from "react";
import axios from "axios";
import { useStreamingNote } from "@/app/document/[id]/hooks/useStreamingNote";
import { Annotation } from "@/app/types";

interface UseNoteActionsOptions {
  isOpen: boolean;
  documentFileName: string;
  selectedText: string;
  existingAnnotation?: Annotation | null;
  onSaveNote: (noteData: {
    selectedText: string;
    comment: string;
    aiResponse: string;
    color: string;
  }) => Promise<void>;
  onDeleteNote?: (id: string) => Promise<void>;
  onAnnotationUpdated?: (updatedAnnotation: Annotation) => void;
  onClose: () => void;
  // State refs from useNoteDialog
  prompt: string;
  selectedColor: string;
  initialPromptRef: MutableRefObject<string>;
  originalCompletionRef: MutableRefObject<string>;
  setIsExpanded: (expanded: boolean) => void;
  setSaveError: (error: string | null) => void;
  setLocalOriginalNote: (note: string) => void;
}

export const useNoteActions = ({
  isOpen,
  documentFileName,
  selectedText,
  existingAnnotation,
  onSaveNote,
  onDeleteNote,
  onAnnotationUpdated,
  onClose,
  prompt,
  selectedColor,
  initialPromptRef,
  originalCompletionRef,
  setIsExpanded,
  setSaveError,
  setLocalOriginalNote,
}: UseNoteActionsOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAcceptingChanges, setIsAcceptingChanges] = useState(false);

  const {
    completion,
    isLoading,
    error,
    complete,
    stop,
    setCompletion,
  } = useStreamingNote();

  useEffect(() => {
    if (isOpen) {
      if (existingAnnotation) {
        setCompletion(existingAnnotation.aiResponse || "");
      } else {
        setCompletion("");
      }
    }
  }, [isOpen, existingAnnotation, setCompletion]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    initialPromptRef.current = prompt;
    setIsExpanded(true);
    await complete(prompt, {
      selectedText,
      prompt,
      documentContext: `Document: ${documentFileName}`,
      originalNote: !!existingAnnotation ? originalCompletionRef.current : undefined,
    });
  }, [prompt, selectedText, documentFileName, existingAnnotation, complete, initialPromptRef, originalCompletionRef, setIsExpanded, setLocalOriginalNote]);

  const handleRegenerate = useCallback(async () => {
    if (!initialPromptRef.current) return;
    setLocalOriginalNote(completion);
    setCompletion("");

    if (existingAnnotation) {
      const { data } = await axios.post(`/api/generate-note`, {
        selectedText,
        prompt: initialPromptRef.current,
        documentContext: `Document: ${documentFileName}`,
        originalNote: completion,
      });
      setCompletion(data.content);
    } else {
      await complete(initialPromptRef.current, {
        selectedText,
        prompt: initialPromptRef.current,
        documentContext: `Document: ${documentFileName}`,
      });
    }
  }, [selectedText, documentFileName, existingAnnotation, completion, complete, setCompletion, initialPromptRef, setLocalOriginalNote]);

  const handleRequestChanges = useCallback(async (changePrompt: string) => {
    if (!changePrompt.trim()) return;
    const combinedPrompt = `${initialPromptRef.current}. Also: ${changePrompt}`;
    setLocalOriginalNote(completion);
    setCompletion("");

    if (existingAnnotation) {
      const { data } = await axios.post(`/api/generate-note`, {
        selectedText,
        prompt: combinedPrompt,
        documentContext: `Document: ${documentFileName}`,
        originalNote: completion,
      });
      setCompletion(data.content);
    } else {
      await complete(combinedPrompt, {
        selectedText,
        prompt: combinedPrompt,
        documentContext: `Document: ${documentFileName}`,
      });
    }
  }, [selectedText, documentFileName, existingAnnotation, completion, complete, setCompletion, initialPromptRef, setLocalOriginalNote]);

  const handleAcceptChanges = useCallback(async (mergedText: string) => {
    if (!existingAnnotation) return;

    setIsAcceptingChanges(true);
    setSaveError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/annotations/${existingAnnotation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comment: initialPromptRef.current,
            aiResponse: mergedText,
            color: selectedColor,
          }),
          credentials: "include",
        }
      );
      const updatedAnnotation = await response.json();

      if (onAnnotationUpdated) {
        onAnnotationUpdated(updatedAnnotation);
      }
    } catch (err) {
      console.error(`[handleAcceptChanges] Network error:`, err);
      setSaveError(`Network error: ${err}`);
    } finally {
      setIsAcceptingChanges(false);
    }
  }, [existingAnnotation, initialPromptRef, selectedColor, onAnnotationUpdated, setSaveError]);

  const handleSave = useCallback(async () => {
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
      onClose();
    } catch (err) {
      console.error("Error saving note:", err);
      setSaveError("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [completion, selectedText, selectedColor, initialPromptRef, onSaveNote, onClose, setSaveError]);

  const handleDelete = useCallback(async () => {
    if (!existingAnnotation || !onDeleteNote) return;

    setIsDeleting(true);
    try {
      await onDeleteNote(existingAnnotation.id);
      onClose();
    } catch (err) {
      console.error("Error deleting note:", err);
      setSaveError("Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [existingAnnotation, onDeleteNote, onClose, setSaveError]);

  return {
    completion,
    isLoading,
    error,
    isSaving,
    isDeleting,
    isAcceptingChanges,
    handleGenerate,
    handleRegenerate,
    handleRequestChanges,
    handleAcceptChanges,
    handleSave,
    handleDelete,
    stop,
    setCompletion,
  };
};
