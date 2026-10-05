import { useEffect, useState } from "react";

// Cycles 0..length-1 on an interval; stays put for reduced-motion users.
export const useRotatingIndex = (length: number, intervalMs: number) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => window.clearInterval(timer);
  }, [length, intervalMs]);

  return index;
};
