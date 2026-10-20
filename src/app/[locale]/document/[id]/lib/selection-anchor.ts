import type { LiveAnchorTarget } from "@/app/[locale]/document/[id]/hooks/useLiveAnchor";

// Anchor to the selected text itself; the clicked element is only a fallback if the selection is gone.
export const getSelectionAnchor = (fallback: Element): LiveAnchorTarget => {
  const selection = window.getSelection();
  return selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : fallback;
};
