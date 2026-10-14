import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Annotation, VocabularyEntry } from "@/app/types";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import {
  noteToSidebarHighlight,
  wordToSidebarHighlight,
  type SidebarHighlight,
} from "@/app/[locale]/document/[id]/lib/sidebar-highlights";
import { PageThumbnails } from "@/app/[locale]/document/[id]/components/document-reader/thumbnails/PageThumbnails";
import { HighlightList } from "@/app/[locale]/document/[id]/components/document-reader/sidebar/HighlightList";
import { OutlineList } from "@/app/[locale]/document/[id]/components/document-reader/sidebar/OutlineList";
import { useDocumentOutline } from "@/app/[locale]/document/[id]/hooks/useDocumentOutline";
import { countOutlineEntries, type OutlineItem } from "@/app/[locale]/document/[id]/lib/pdf-outline";
import { SearchPanel } from "@/app/[locale]/document/[id]/components/document-reader/sidebar/SearchPanel";
import type { ReaderSearch } from "@/app/[locale]/document/[id]/hooks/useReaderSearch";
import type { TextSearchResult } from "@/app/[locale]/document/[id]/hooks/useDocumentTextSearch";
import type { SemanticPassage } from "@/app/[locale]/document/[id]/hooks/useSemanticSearch";

export const SIDEBAR_TABS = ["pages", "outline", "notes", "vocabulary", "search"] as const;
export type SidebarTab = (typeof SIDEBAR_TABS)[number];
// A single entry is usually just the document title, not worth a tab.
const MIN_OUTLINE_ENTRIES = 2;

interface ReaderSidebarProps {
  pdf: PdfDocument;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
  // Set only in exam mode, where the sidebar is just pages to pick from.
  selectedPages?: number[];
  // Narrower while a panel (chat or exam setup) takes the other side.
  compact: boolean;
  notes: Annotation[];
  words: VocabularyEntry[];
  onNoteSelect: (note: SidebarHighlight) => void;
  onWordSelect: (word: SidebarHighlight) => void;
  onSectionSelect: (section: OutlineItem) => void;
  // Owned by the reader, so Ctrl/Cmd+F can open the search tab.
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  search: ReaderSearch;
  searchFocusRequest: number;
  onSearchResultSelect: (result: TextSearchResult) => void;
  onPassageSelect: (passage: SemanticPassage) => void;
}

const TabCount: React.FC<{ count: number }> = ({ count }) => (
  <span className="tabular-nums text-muted-foreground">{count}</span>
);

// Everything for moving through the document: its pages, the user's notes and saved words.
export const ReaderSidebar: React.FC<ReaderSidebarProps> = ({
  pdf,
  currentPage,
  onPageClick,
  selectedPages,
  compact,
  notes,
  words,
  onNoteSelect,
  onWordSelect,
  onSectionSelect,
  tab: requestedTab,
  onTabChange,
  search,
  searchFocusRequest,
  onSearchResultSelect,
  onPassageSelect,
}) => {
  const t = useTranslations("reader.sidebar");
  const outline = useDocumentOutline(pdf);
  const hasOutline = countOutlineEntries(outline) >= MIN_OUTLINE_ENTRIES;
  const tab = requestedTab === "outline" && !hasOutline ? "pages" : requestedTab;
  const noteItems = useMemo(() => notes.map(noteToSidebarHighlight), [notes]);
  const wordItems = useMemo(() => words.map(wordToSidebarHighlight), [words]);
  const isExamMode = selectedPages !== undefined;
  // With four tabs in the narrow sidebar, the counts don't fit.
  const showCounts = !(compact && hasOutline);

  const pages = (
    <PageThumbnails pdf={pdf} currentPage={currentPage} onPageClick={onPageClick} selectedPages={selectedPages} />
  );

  return (
    <aside
      aria-label={t("label")}
      // Same surface as the chat panel, so both sides of the document read as one frame.
      className={cn(
        "flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar animate-in fade-in slide-in-from-left-2 duration-200 ease-[var(--ease-out)]",
        isExamMode ? (compact ? "w-36" : "w-52") : compact ? "w-56" : "w-64"
      )}
    >
      {isExamMode ? (
        pages
      ) : (
        <Tabs value={tab} onValueChange={(value) => onTabChange(value as SidebarTab)} className="h-full min-h-0">
          <TabsList className="m-2">
            <TabsTrigger value="pages">{t("tabs.pages")}</TabsTrigger>
            {hasOutline && <TabsTrigger value="outline">{t("tabs.outline")}</TabsTrigger>}
            <TabsTrigger value="notes">
              {t("tabs.notes")}
              {showCounts && noteItems.length > 0 && <TabCount count={noteItems.length} />}
            </TabsTrigger>
            <TabsTrigger value="vocabulary">
              {t("tabs.vocabulary")}
              {showCounts && wordItems.length > 0 && <TabCount count={wordItems.length} />}
            </TabsTrigger>
            <TabsTrigger value="search" aria-label={t("tabs.search")} title={t("tabs.search")} className="flex-none px-2.5">
              <Search className="size-3.5" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pages">{pages}</TabsContent>
          {hasOutline && (
            <TabsContent value="outline">
              <OutlineList items={outline} currentPage={currentPage} onSelect={onSectionSelect} />
            </TabsContent>
          )}
          <TabsContent value="notes">
            <HighlightList kind="notes" items={noteItems} currentPage={currentPage} onSelect={onNoteSelect} />
          </TabsContent>
          <TabsContent value="vocabulary">
            <HighlightList kind="vocabulary" items={wordItems} currentPage={currentPage} onSelect={onWordSelect} />
          </TabsContent>
          <TabsContent value="search">
            <SearchPanel
              search={search}
              currentPage={currentPage}
              focusRequest={searchFocusRequest}
              onResultSelect={onSearchResultSelect}
              onPassageSelect={onPassageSelect}
            />
          </TabsContent>
        </Tabs>
      )}
    </aside>
  );
};
