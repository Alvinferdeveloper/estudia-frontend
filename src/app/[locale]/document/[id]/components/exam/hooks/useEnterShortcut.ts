import { useEffect, useRef } from "react";
import { QUESTION_TYPES, type Question } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

// Written answers need Enter for new lines, so they take Ctrl/Cmd + Enter instead.
export const needsModifierEnter = (question: Question) =>
  question.type !== QUESTION_TYPES.MULTIPLE_CHOICE && question.type !== QUESTION_TYPES.TRUE_FALSE;

// Runs the step's primary action on Enter (or Ctrl/Cmd + Enter when `withModifier`).
export const useEnterShortcut = (action: () => void, { enabled, withModifier }: { enabled: boolean; withModifier: boolean }) => {
  const actionRef = useRef(action);
  useEffect(() => {
    actionRef.current = action;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      if (withModifier && !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      actionRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, withModifier]);
};
