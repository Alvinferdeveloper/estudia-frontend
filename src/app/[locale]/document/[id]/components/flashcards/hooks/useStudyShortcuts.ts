import { useEffect } from "react";

const ACTIVATION_KEYS = new Set([" ", "Enter"]);

// Text fields and the tab list keep their keys, and a focused button or link keeps Space/Enter.
const isOwnedByFocusedControl = (event: KeyboardEvent): boolean => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return false;
  if (target.closest("input, textarea, [contenteditable='true'], [role='tablist']")) return true;
  return ACTIVATION_KEYS.has(event.key) && Boolean(target.closest("button, a"));
};

// Page-wide keys while studying cards, mapped by `KeyboardEvent.key`.
export const useStudyShortcuts = (actions: Partial<Record<string, () => void>>, enabled = true): void => {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = actions[event.key];
      if (!action || event.ctrlKey || event.metaKey || event.altKey || isOwnedByFocusedControl(event)) return;
      event.preventDefault();
      action();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, enabled]);
};
