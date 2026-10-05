import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePdfVirtualizationOptions {
    numPages: number;
    onPageChange: (page: number) => void;
}

export const usePdfVirtualization = ({ numPages, onPageChange }: UsePdfVirtualizationOptions) => {
    const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Initialize visible pages when document loads
    useEffect(() => {
        if (numPages > 0) {
            setVisiblePages(new Set([1, 2, 3].filter(p => p <= numPages)));
        }
    }, [numPages]);

    // Intersection Observer for virtualization
    useEffect(() => {
        if (!containerRef.current || numPages === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const pageNum = parseInt(entry.target.getAttribute('data-page-number') || '0');

                    if (entry.isIntersecting) {
                        setVisiblePages(prev => {
                            const newSet = new Set(prev);
                            // Add current page and neighbors for smooth scrolling
                            newSet.add(pageNum);
                            if (pageNum > 1) newSet.add(pageNum - 1);
                            if (pageNum < numPages) newSet.add(pageNum + 1);
                            return newSet;
                        });
                    }
                });

                // Find the most visible page for the page indicator
                const visibleEntries = entries.filter(e => e.isIntersecting);
                if (visibleEntries.length > 0) {
                    const mostVisible = visibleEntries.reduce((prev, current) =>
                        current.intersectionRatio > prev.intersectionRatio ? current : prev
                    );
                    const pageNum = parseInt(mostVisible.target.getAttribute('data-page-number') || '1');
                    onPageChange(pageNum);
                }
            },
            {
                root: containerRef.current,
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: '100px 0px' // Preload pages 100px before they come into view
            }
        );

        pageRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [numPages, onPageChange]);

    const setPageRef = useCallback((pageNum: number) => (el: HTMLDivElement | null) => {
        if (el) {
            pageRefs.current.set(pageNum, el);
        } else {
            pageRefs.current.delete(pageNum);
        }
    }, []);

    return {
        visiblePages,
        containerRef,
        setPageRef
    };
};
