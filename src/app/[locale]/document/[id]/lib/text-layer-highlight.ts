import { findMatches, normalizeQuery, normalizeWithMap } from "@/app/[locale]/document/[id]/lib/text-search";

// Painted with the CSS Custom Highlight API, so pdf.js's text layer DOM is never touched.
const HIGHLIGHT_NAME = "zocratis-search";

interface CharPosition {
  node: Text;
  offset: number;
}

// The text layer's text as pdf.js drew it (a <br> per line end becomes a space) and where each character lives.
const readTextLayer = (layer: Element): { source: string; positions: (CharPosition | null)[] } => {
  let source = "";
  const positions: (CharPosition | null)[] = [];
  const walker = document.createTreeWalker(layer, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text) {
      for (let offset = 0; offset < node.data.length; offset++) {
        source += node.data[offset];
        positions.push({ node, offset });
      }
    } else if (node instanceof HTMLBRElement) {
      source += " ";
      positions.push(null);
    }
  }
  return { source, positions };
};

// The nth match of the query in a page's text layer, as a DOM range.
export const findTextLayerRange = (layer: Element, query: string, occurrence: number): Range | null => {
  const { source, positions } = readTextLayer(layer);
  const match = findMatches(normalizeWithMap(source), normalizeQuery(query))[occurrence];
  const first = match && positions[match.start];
  const last = match && positions[match.end - 1];
  if (!first || !last) return null;
  const range = document.createRange();
  range.setStart(first.node, first.offset);
  range.setEnd(last.node, last.offset + 1);
  return range;
};

const supportsHighlights = () => typeof CSS !== "undefined" && "highlights" in CSS;

// Injected here instead of globals.css: Next's CSS parser rejects the ::highlight() pseudo-element.
const HIGHLIGHT_STYLE_ID = "zocratis-search-highlight";
const HIGHLIGHT_STYLE = `::highlight(${HIGHLIGHT_NAME}) { background-color: color-mix(in oklch, var(--selection) 35%, transparent); }`;

const ensureHighlightStyle = () => {
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = HIGHLIGHT_STYLE_ID;
  style.textContent = HIGHLIGHT_STYLE;
  document.head.append(style);
};

export const showSearchHighlight = (range: Range): void => {
  if (!supportsHighlights()) return;
  ensureHighlightStyle();
  CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(range));
};

export const clearSearchHighlight = (): void => {
  if (supportsHighlights()) CSS.highlights.delete(HIGHLIGHT_NAME);
};
