import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

// Grows the textarea with its content; cap the height with a max-h class and it scrolls past that.
export const useAutoResizeTextarea = (value: string) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useLayoutEffect(resize, [value, resize]);

  // Text reflows when the width changes (e.g. a resizable panel settling on mount), so re-measure then too.
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    let width = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === width) return;
      width = textarea.clientWidth;
      resize();
    });

    observer.observe(textarea);
    return () => observer.disconnect();
  }, [resize]);

  return ref;
};
