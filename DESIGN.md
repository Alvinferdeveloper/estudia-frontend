---
name: Zocratis
description: A study companion built around your own documents. Ink on ivory paper.
colors:
  ink: "oklch(0.36 0.05 254)"
  ink-text: "oklch(0.22 0.01 255)"
  ink-muted: "oklch(0.52 0.012 255)"
  ivory-paper: "oklch(0.982 0.006 85)"
  ivory-sheet: "oklch(0.995 0.004 85)"
  paper-shade: "oklch(0.955 0.007 85)"
  paper-edge: "oklch(0.9 0.008 85)"
  reading-tray: "oklch(0.89 0.006 85)"
  night-ink: "oklch(0.145 0.006 255)"
  night-sheet: "oklch(0.185 0.008 255)"
  ivory-light: "oklch(0.925 0.008 85)"
  ochre: "oklch(0.74 0.15 85)"
  success: "oklch(0.68 0.16 155)"
  warning: "oklch(0.82 0.16 82)"
  danger: "oklch(0.67 0.21 27)"
  info: "oklch(0.68 0.16 230)"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  numeric:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory-sheet}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "36px"
  button-ghost:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  segmented-track:
    backgroundColor: "{colors.paper-shade}"
    rounded: "{rounded.lg}"
    padding: "4px"
  segmented-thumb:
    backgroundColor: "{colors.ivory-sheet}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.md}"
    height: "32px"
  input:
    backgroundColor: "{colors.ivory-sheet}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.ivory-sheet}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Zocratis

## 1. Overview

**Creative North Star: "The Serene Library"**

Zocratis is a quiet reading room. Ink on ivory paper, soft daylight, nothing on the desk that isn't about the text. Students spend long sessions here, often at night, so the system optimizes for sustained focus: low visual noise, warm surfaces that are easy on the eyes, and one confident color (ink) that marks what matters. At night the room inverts: deep blue-black ink becomes the surface and ivory becomes the voice.

Personality lives in a few considered details rather than in decoration: the chisel-carving logo, a serif accent at the moments that deserve ceremony (a finished exam, an empty shelf, a page title), and precise micro-interactions that feel crafted, not animated for show. The system explicitly rejects generic AI SaaS (purple gradients, glows, "magic"), default shadcn templates, childish school apps and the gray bureaucracy of legacy academic platforms.

This is a product surface: familiar patterns where they help students move fast, Zocratis craft in the details.

**Key Characteristics:**
- Warm ivory paper surfaces, cool ink text and accents.
- One accent color (ink, ivory at night) used sparingly for actions, selection and focus.
- Geist for the interface, Instrument Serif italic only for moments of ceremony.
- Flat, tonal layering; shadows only where something genuinely lifts.
- Motion that confirms state in 150 to 250 ms with an ease-out curve, and nothing else.

## 2. Colors

A restrained palette: warm paper neutrals, one ink accent, and semantic colors reserved for meaning.

### Primary
- **Zocratis Ink** (oklch(0.36 0.05 254)): the logo's own blue-black ink. Primary actions, current selection, focus rings, links. In dark mode it inverts to **Ivory Light** (oklch(0.925 0.008 85)) so the brand keeps its contrast. Marks drawn on PDF pages (exam selection) use the theme-independent `--ink` token instead, because pages stay white in both themes.

### Secondary
- **Ochre** (oklch(0.74 0.15 85)): the warm highlighter. Marketing accents and rare moments of emphasis (a highlighted passage, a streak). Never for buttons or errors.

### Neutral
- **Ivory Paper** (oklch(0.982 0.006 85)): the page background in light mode.
- **Ivory Sheet** (oklch(0.995 0.004 85)): raised surfaces (cards, popovers, dialogs, the segmented thumb). The lightest value in the system; pure white is never used.
- **Paper Shade** (oklch(0.955 0.007 85)): tracks, secondary surfaces and subtle fills.
- **Paper Edge** (oklch(0.9 0.008 85)): borders, dividers and input strokes.
- **Reading Tray** (oklch(0.89 0.006 85)): the tray behind PDF pages, dark enough for pages to stand out.
- **Ink Text** (oklch(0.22 0.01 255)) and **Ink Muted** (oklch(0.52 0.012 255)): primary and secondary text.
- **Night Ink** (oklch(0.145 0.006 255)) and **Night Sheet** (oklch(0.185 0.008 255)): dark-mode page and raised surfaces.

### Semantic
- **Success** (oklch(0.68 0.16 155)), **Warning** (oklch(0.82 0.16 82)), **Danger** (oklch(0.67 0.21 27)), **Info** (oklch(0.68 0.16 230)): state only, always paired with an icon or text.

### Named Rules
**The Ink Scarcity Rule.** Ink (ivory at night) covers at most 10% of any screen. It marks the next action and the current selection; if everything is ink, nothing is.

**The Paper, Not White Rule.** Light surfaces are always tinted toward ivory (hue 85, chroma 0.004 to 0.008). Pure white (#fff) is prohibited.

**The Tokens-Only State Rule.** Correct, warning and wrong states use the success, warning and danger tokens. Raw Tailwind palette colors (emerald, amber, rose) are prohibited in product UI.

## 3. Typography

**Display Font:** Instrument Serif, italic (with Georgia, serif)
**Body Font:** Geist (with system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (with ui-monospace) for scores, counts and tabular figures

**Character:** Geist is a calm, precise sans that disappears into the task; Instrument Serif italic is the scholar's voice, used sparingly so each appearance feels like a small ceremony.

### Hierarchy
- **Display** (Instrument Serif italic 400, 2.25rem, 1.1): page titles and moments of ceremony (exam results, empty states, section openers). Never for UI controls.
- **Headline** (Geist 600, 1.5rem, 1.25, tight tracking): screen and panel headings.
- **Title** (Geist 600, 1rem, 1.4): card titles, list item titles, dialog titles.
- **Body** (Geist 400, 0.875rem, 1.6): interface text. Reading content caps at 65 to 75ch.
- **Label** (Geist 500, 0.75rem, 0.08em tracking, uppercase): eyebrows and section labels above lists.
- **Numeric** (Geist Mono 600, tabular): scores, counters, credits.

### Named Rules
**The Ceremony Rule.** The serif appears at most once per screen and only for a moment worth marking. Buttons, labels, inputs and data are always Geist.

## 4. Elevation

Flat by default, built from tonal layers: Ivory Paper is the page, Ivory Sheet lifts content one step, Paper Shade recedes. Shadows are reserved for elements that truly float above the page or respond to state.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 1px 2px oklch(0.22 0.01 255 / 0.06)` plus a 1px Paper Edge ring): raised controls such as the segmented thumb.
- **Float** (`box-shadow: 0 12px 32px -12px oklch(0.22 0.01 255 / 0.18)`): popovers, menus, toasts and the upload flyout.

### Named Rules
**The Earned Shadow Rule.** A shadow means "this sits above the page right now". Static cards and panels use tone and a Paper Edge border, never a shadow.

## 5. Components

### Buttons
Calm and tactile: pill-shaped, they press slightly when clicked.
- **Shape:** fully rounded pills (9999px) for actions; icon buttons are 32px circles.
- **Primary:** Zocratis Ink fill with Ivory Sheet text, 36px tall. One per view.
- **Ghost:** Ink Muted text, Paper Shade fill on hover, ink text on hover.
- **Press:** scale to 0.97 on active (160 ms ease-out); focus shows a 2px ink ring at 30% opacity.
- **Status:** migrating from the generic shadcn variants to these pills (see Do's and Don'ts).

### Segmented Control (signature)
The single-choice selector (exam size, difficulty). A Paper Shade track (12px radius, 4px padding) holds options; the selected one is an Ivory Sheet thumb with Lift that slides to the choice in 200 ms ease-out (instant under reduced motion). Locked options show a lock icon at 50% opacity. Radio-group semantics, one tab stop, arrow keys.

### Cards / Containers
- **Corner Style:** 16px for page-level containers, 12px for inner groups.
- **Background:** Ivory Sheet on Ivory Paper; Night Sheet on Night Ink.
- **Shadow Strategy:** none at rest (The Earned Shadow Rule).
- **Border:** 1px Paper Edge.
- **Internal Padding:** 24px for containers, 16px for list rows.

### Inputs / Fields
- **Style:** Ivory Sheet fill, 1px Paper Edge stroke, 10px radius.
- **Focus:** stroke shifts to ink and a 2px ink ring at 30% opacity appears.
- **Error / Disabled:** Danger stroke with a message below; disabled at 50% opacity, no hover.

### Navigation
- Side navigation sits on a slightly deeper paper (Paper Shade family) than the content; the active item uses a 10% ink tint and ink text.
- Headers are quiet: muted icon buttons, the brand mark, and at most one primary action.

## 6. Do's and Don'ts

### Do:
- **Do** let the document lead: chrome in Ink Muted, content in Ink Text.
- **Do** tint every light surface toward ivory (hue 85); use Ivory Sheet (oklch(0.995 0.004 85)) as the lightest value.
- **Do** use the serif once per screen at most, for a moment of ceremony.
- **Do** show what something costs or why it is limited before the user hits the limit, with an "Upgrade plan" link next to it.
- **Do** pair every state color with an icon or text, and keep 4.5:1 contrast for text in both themes.
- **Do** keep transitions between 150 and 250 ms with the ease-out curve (cubic-bezier(0.23, 1, 0.32, 1)) and drop movement under reduced motion.

### Don't:
- **Don't** look like generic AI SaaS: no purple gradients, glows, sparkles or "magic" framing of AI, and no hero-metric cards with giant numbers.
- **Don't** ship default shadcn looks: no black or outline button toggles and no identical card grids. Adapt the component to these tokens first.
- **Don't** drift into a childish school app: no saturated rainbow palettes, cartoon illustrations or gamification that interrupts study.
- **Don't** resemble legacy academic platforms like Moodle or Blackboard: no gray bureaucracy or dense tables without hierarchy.
- **Don't** use pure white (#fff) or pure black (#000) anywhere.
- **Don't** use raw Tailwind palette colors (emerald, amber, rose) for state; use the semantic tokens.
- **Don't** use side-stripe borders thicker than 1px as accents, gradient text, or glassmorphism as decoration.
- **Don't** open a modal when an inline panel or a page would do.
