import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ApiErrorMessage } from "@/components/api-error-message";
import { cn } from "@/lib/utils";
import { getApiErrorKey } from "@/lib/api-errors";
import { groupByPage } from "@/app/[locale]/document/[id]/lib/sidebar-highlights";
import type { ReaderSearch, SearchMode } from "@/app/[locale]/document/[id]/hooks/useReaderSearch";
import type { TextSearchResult } from "@/app/[locale]/document/[id]/hooks/useDocumentTextSearch";
import type { SemanticPassage } from "@/app/[locale]/document/[id]/hooks/useSemanticSearch";

interface SearchPanelProps {
  search: ReaderSearch;
  currentPage: number;
  // Changes when Ctrl/Cmd+F asks for the search field.
  focusRequest: number;
  onResultSelect: (result: TextSearchResult) => void;
  onPassageSelect: (passage: SemanticPassage) => void;
}

const PageHeading: React.FC<{ pageNumber: number; isCurrent: boolean }> = ({ pageNumber, isCurrent }) => {
  const t = useTranslations("reader.sidebar");
  return (
    <p
      className={cn(
        "sticky top-0 z-10 bg-sidebar px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.08em]",
        isCurrent ? "text-primary" : "text-muted-foreground"
      )}
    >
      {t("page", { page: pageNumber })}
    </p>
  );
};

const resultButtonClass =
  "press-feedback block w-full rounded-md px-2 py-2 text-left text-sm leading-snug hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Exact search with a match counter and Enter to step through, or search by meaning over the indexed document.
export const SearchPanel: React.FC<SearchPanelProps> = ({
  search,
  currentPage,
  focusRequest,
  onResultSelect,
  onPassageSelect,
}) => {
  const t = useTranslations("reader.sidebar.search");
  const tSidebar = useTranslations("reader.sidebar");
  const inputRef = useRef<HTMLInputElement>(null);
  const { mode, query, text, activeResultId } = search;
  const results = text.results;
  const activeIndex = results.findIndex((result) => result.id === activeResultId);
  const groups = useMemo(() => groupByPage(results), [results]);
  const isScanning = search.exactQuery.length > 0 && text.scannedPages < text.totalPages;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusRequest]);

  const step = (direction: 1 | -1) => {
    if (results.length === 0) return;
    const from = activeIndex === -1 ? (direction === 1 ? -1 : 0) : activeIndex;
    onResultSelect(results[(from + direction + results.length) % results.length]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (mode === "semantic") search.submitSemantic();
    else step(event.shiftKey ? -1 : 1);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 px-2 pb-1">
        <SegmentedControl<SearchMode>
          size="sm"
          aria-label={t("modeLabel")}
          value={mode}
          onChange={search.setMode}
          options={[
            { value: "exact", label: t("modes.exact") },
            { value: "semantic", label: t("modes.semantic") },
          ]}
        />
        <div className="relative">
          <Input
            ref={inputRef}
            data-reader-search
            type="search"
            value={query}
            onChange={(event) => search.setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(`placeholder.${mode}`)}
            aria-label={t(`placeholder.${mode}`)}
            className={cn("h-8 text-sm md:text-sm", mode === "exact" && results.length > 0 && "pr-28")}
          />
          {mode === "exact" && results.length > 0 && (
            <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
              <span aria-live="polite" className="px-1 text-xs tabular-nums text-muted-foreground">
                {activeIndex === -1
                  ? t("count", { total: results.length })
                  : t("position", { current: activeIndex + 1, total: results.length })}
              </span>
              <IconButton size="icon-sm" label={t("previous")} onClick={() => step(-1)} className="size-6">
                <ChevronUp className="size-3.5" />
              </IconButton>
              <IconButton size="icon-sm" label={t("next")} onClick={() => step(1)} className="size-6">
                <ChevronDown className="size-3.5" />
              </IconButton>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        {mode === "exact" ? (
          <>
            {isScanning && (
              <p className="flex items-center gap-1.5 px-2 py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                {t("scanning", { scanned: text.scannedPages, total: text.totalPages })}
              </p>
            )}
            {search.exactQuery && !isScanning && results.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">{tSidebar("noResults")}</p>
            )}
            <ol>
              {groups.map(([pageNumber, pageResults]) => (
                <li key={pageNumber}>
                  <PageHeading pageNumber={pageNumber} isCurrent={pageNumber === currentPage} />
                  <ul>
                    {pageResults.map((result) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => onResultSelect(result)}
                          aria-current={result.id === activeResultId ? "true" : undefined}
                          className={cn(resultButtonClass, result.id === activeResultId && "bg-accent")}
                        >
                          <span className="text-muted-foreground">{result.snippet.before}</span>
                          <mark className="rounded-sm bg-selection/20 px-0.5 text-foreground">{result.snippet.match}</mark>
                          <span className="text-muted-foreground">{result.snippet.after}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <SemanticResults
            search={search}
            currentPage={currentPage}
            onPassageSelect={onPassageSelect}
          />
        )}
      </div>
    </div>
  );
};

const SemanticResults: React.FC<Pick<SearchPanelProps, "search" | "currentPage" | "onPassageSelect">> = ({
  search,
  currentPage,
  onPassageSelect,
}) => {
  const t = useTranslations("reader.sidebar.search");
  const { indexing, semantic, submittedQuery } = search;
  const passages = useMemo(
    () => (semantic.data ?? []).map((passage, index) => ({ ...passage, id: `${passage.pageNumber}:${index}` })),
    [semantic.data]
  );

  if (indexing.errorKey) return <ApiErrorMessage errorKey={indexing.errorKey} className="px-2 py-3 text-xs" />;
  if (!submittedQuery) return <p className="px-2 py-3 text-xs leading-relaxed text-muted-foreground">{t("semanticHint")}</p>;
  if (!indexing.isReady || semantic.isFetching) {
    return (
      <p className="flex items-start gap-1.5 px-2 py-3 text-xs leading-relaxed text-muted-foreground">
        <Loader2 className="mt-0.5 size-3 shrink-0 animate-spin" />
        {indexing.isReady ? t("searching") : t("indexing")}
      </p>
    );
  }
  if (semantic.error) return <ApiErrorMessage errorKey={getApiErrorKey(semantic.error)} className="px-2 py-3 text-xs" />;
  if (passages.length === 0) return <p className="px-4 py-6 text-center text-xs text-muted-foreground">{t("semanticEmpty")}</p>;

  return (
    <ol>
      {passages.map((passage) => (
        <li key={passage.id}>
          <PageHeading pageNumber={passage.pageNumber} isCurrent={passage.pageNumber === currentPage} />
          <button type="button" onClick={() => onPassageSelect(passage)} className={cn(resultButtonClass, "text-muted-foreground")}>
            <span className="line-clamp-4">{passage.content}</span>
          </button>
        </li>
      ))}
    </ol>
  );
};
