import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ancestorIds,
  findCurrentSectionId,
  type OutlineItem,
} from "@/app/[locale]/document/[id]/lib/pdf-outline";

interface OutlineListProps {
  items: OutlineItem[];
  currentPage: number;
  onSelect: (item: OutlineItem) => void;
}

const INDENT_PX = 12;

// The PDF's table of contents: nested sections that fold, with the one being read marked and kept in view.
export const OutlineList: React.FC<OutlineListProps> = ({ items, currentPage, onSelect }) => {
  const t = useTranslations("reader.sidebar.outline");
  const listRef = useRef<HTMLDivElement>(null);
  const currentId = useMemo(() => findCurrentSectionId(items, currentPage), [items, currentPage]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  // Opens the branch of the section being read without folding what the user opened.
  useEffect(() => {
    if (!currentId) return;
    setExpanded((prev) => new Set([...prev, ...ancestorIds(currentId)]));
  }, [currentId]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-current="location"]')?.scrollIntoView({ block: "nearest" });
  }, [currentId]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderBranch = (branch: OutlineItem[], depth: number) => (
    <ul>
      {branch.map((item) => {
        const hasChildren = item.children.length > 0;
        const isOpen = expanded.has(item.id);
        const isCurrent = item.id === currentId;
        return (
          <li key={item.id}>
            <div className="flex items-start" style={{ paddingLeft: depth * INDENT_PX }}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-label={t(isOpen ? "collapse" : "expand", { title: item.title })}
                  className="press-feedback mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight
                    className={cn("size-3.5 transition-transform duration-150 ease-[var(--ease-out)]", isOpen && "rotate-90")}
                  />
                </button>
              ) : (
                <span aria-hidden className="size-6 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => onSelect(item)}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  "press-feedback flex min-w-0 flex-1 items-baseline gap-2 rounded-md px-1.5 py-1.5 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCurrent ? "font-medium text-primary" : depth > 0 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                <span className="line-clamp-2 min-w-0 flex-1 leading-snug">{item.title}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{item.pageNumber}</span>
              </button>
            </div>
            {hasChildren && isOpen && renderBranch(item.children, depth + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={listRef} className="h-full overflow-y-auto scrollbar-thin px-1 pb-2">
      <nav aria-label={t("label")}>{renderBranch(items, 0)}</nav>
    </div>
  );
};
