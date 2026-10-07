import { useCallback, useState } from "react";

// The reader's exam mode: while on, clicking a page adds it to (or removes it from) the exam.
export const useExamMode = () => {
  const [enabled, setEnabled] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const toggle = useCallback(() => {
    setEnabled((on) => !on);
    setSelectedPages([]);
  }, []);

  const exit = useCallback(() => {
    setEnabled(false);
    setSelectedPages([]);
  }, []);

  const togglePage = useCallback((pageNumber: number) => {
    setSelectedPages((pages) =>
      pages.includes(pageNumber) ? pages.filter((p) => p !== pageNumber) : [...pages, pageNumber]
    );
  }, []);

  return { enabled, selectedPages, toggle, exit, togglePage };
};
