import { useCallback, useEffect, useRef } from "react";

const NEAR_BOTTOM_PX = 80;

// Follows growing content only while the reader is already at the bottom, so scrolling back through history isn't interrupted.
export const useStickToBottom = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const scrollToBottom = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
    isNearBottom.current = true;
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!enabled || !scroller || !content) return;

    const handleScroll = () => {
      isNearBottom.current =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < NEAR_BOTTOM_PX;
    };
    const observer = new ResizeObserver(() => {
      if (isNearBottom.current) scroller.scrollTop = scroller.scrollHeight;
    });

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(content);
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [enabled]);

  return { scrollRef, contentRef, scrollToBottom };
};
