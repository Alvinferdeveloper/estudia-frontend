import { useEffect, useMemo, useRef } from "react";

export type LiveAnchorTarget = Element | Range;

interface VirtualAnchor {
  getBoundingClientRect: () => DOMRect;
  contextElement?: Element;
}

const getAnchorElement = (target: LiveAnchorTarget): Element | null => {
  if (target instanceof Element) return target;
  const node = target.startContainer;
  return node instanceof Element ? node : node.parentElement;
};

const getScrollContainer = (element: Element | null): Element | null => {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(node);
    if (/auto|scroll/.test(overflowX + overflowY)) return node;
  }
  return null;
};

const isConnected = (target: LiveAnchorTarget): boolean =>
  target instanceof Element ? target.isConnected : target.startContainer.isConnected;

const isFullyOutside = (rect: DOMRect, container: Element): boolean => {
  const bounds = container.getBoundingClientRect();
  return (
    rect.bottom <= bounds.top ||
    rect.top >= bounds.bottom ||
    rect.right <= bounds.left ||
    rect.left >= bounds.right
  );
};

// Anchors a Radix popover to a live element/range; calls onLeaveView once it scrolls fully out of its container.
export const useLiveAnchor = (target: LiveAnchorTarget | null, onLeaveView?: () => void) => {
  // Radix re-checks the anchor on every render and loops on a new object, so it must be stable.
  const anchor = useMemo(() => {
    if (!target) return null;
    const element = getAnchorElement(target);
    const virtualAnchor: VirtualAnchor = {
      getBoundingClientRect: () => target.getBoundingClientRect(),
      contextElement: element ?? undefined,
    };
    return { virtualRef: { current: virtualAnchor }, scrollContainer: getScrollContainer(element) };
  }, [target]);

  const onLeaveViewRef = useRef(onLeaveView);
  useEffect(() => {
    onLeaveViewRef.current = onLeaveView;
  }, [onLeaveView]);

  // Measure the target's own box: a Range can't be observed, and its surrounding pdf.js span isn't the word.
  useEffect(() => {
    const container = anchor?.scrollContainer;
    if (!target || !container) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!isConnected(target) || isFullyOutside(target.getBoundingClientRect(), container)) {
          onLeaveViewRef.current?.();
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [target, anchor]);

  return {
    virtualRef: anchor?.virtualRef ?? null,
    boundary: anchor?.scrollContainer ?? null,
  };
};
