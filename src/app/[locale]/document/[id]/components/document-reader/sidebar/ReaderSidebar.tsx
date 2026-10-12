import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoredChoice } from "@/hooks/useStoredChoice";
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

const TABS = ["pages", "outline", "notes", "vocabulary"] as const;
// A single entry is usually just the document title, not worth a tab.
const MIN_OUTLINE_ENTRIES = 2;
type SidebarTab = (typeof TABS)[number];

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
}) => {
  const t = useTranslations("reader.sidebar");
  const [storedTab, setTab] = useStoredChoice<SidebarTab>("reader:sidebarTab", TABS, "pages");
  const outline = useDocumentOutline(pdf);
  const hasOutline = countOutlineEntries(outline) >= MIN_OUTLINE_ENTRIES;
  const tab = storedTab === "outline" && !hasOutline ? "pages" : storedTab;
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
        <Tabs value={tab} onValueChange={(value) => setTab(value as SidebarTab)} className="h-full min-h-0">
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
        </Tabs>
      )}
    </aside>
  );
};
