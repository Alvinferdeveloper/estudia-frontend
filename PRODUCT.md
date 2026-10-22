# Product

## Register

product

## Users

- **University students** who study from long PDFs (lecture notes, papers, textbooks) and prepare for exams. They work in long, focused sessions, often at night, on a laptop.
- **Language learners** who read documents in another language and build vocabulary from what they read.
- **Self-directed professionals** studying for certifications or doing research on their own.

The job to be done: turn a document they already have into understanding they can prove, through reading, asking, taking notes and testing themselves, without leaving the document.

## Product Purpose

Zocratis is a study companion built around the user's own documents. It reads with them (chat grounded in the PDF, notes, translation and vocabulary) and examines them (exam mode generated from chosen pages). Success is a student who understands the material better and knows it, measured by practice results, not by time spent in the app.

The marketing landing exists to bring students in, but the primary surface is the app: the reader, the workspace and the exam flow.

## Vision

Zocratis aims to become the platform that powers the next generation of scientific breakthroughs: the place where every researcher works, and where every young person and university student feels at home learning and taking their knowledge to the highest level. AI lowers the barrier to doing science and speeds it up, so people and AI can make more advanced discoveries together.

- **A continuous path, not two products:** student → advanced student (thesis) → researcher. Research features grow out of the study core (deep reading anchored to the document, grounded questions, notes, self-testing).
- **Work across documents:** projects that group many documents, with cross-references and grounded answers that cite every source.
- **Shared knowledge, like GitHub:** documents with their notes, exams, flashcards and any other work can be shared, reused and forked with attribution, so others learn faster from what someone already understood.

Today the focus is still studying; the vision guides decisions that would be expensive to undo, such as data ownership and what can be shared. The concrete steps live in `ROADMAP.md` ("Research y conocimiento compartido").

## Brand Personality

**Erudite, serene, precise.**

- The name points to Socrates: learning by questioning. The tone is a calm, knowledgeable tutor who asks good questions, never a hype machine.
- Ink on ivory paper: the interface should feel like a well-made book or a quiet library, where attention goes to the text.
- Character shows in a few considered details (the chisel-carving logo, a serif accent, precise micro-interactions), not in decoration.
- Copy is direct and warm, in the user's language, never condescending and never "AI magic".

## Anti-references

- **Generic AI SaaS:** purple gradients, glows, sparkles, "magic" framing of AI, hero-metric cards with giant numbers.
- **Default shadcn templates:** black or outline buttons and identical cards seen in thousands of apps. Components are adapted to the brand.
- **Childish school apps:** saturated colors, cartoon illustrations, patronizing tone, gamification that interrupts study.
- **Legacy academic platforms (Moodle, Blackboard):** gray bureaucracy, dense tables, no hierarchy.

Positive references: Readwise Reader and Kindle (reading comfort, the interface steps back), Notion (calm, content first), Arc and Raycast (a serious tool with its own personality and crafted interactions).

## Design Principles

1. **The document is the hero.** Every surface serves reading and understanding; chrome recedes, text leads.
2. **Calm focus.** Long study sessions need low visual noise: restrained color, quiet motion, no interruptions that aren't about the task.
3. **Honest guidance.** Show what things cost and why they are limited (credits, plan caps) before the user hits a wall, with a clear way forward.
4. **Earned familiarity, own identity.** Standard patterns where they help users move fast; distinctive Zocratis craft in the details instead of generic library looks.
5. **Learning by questioning.** The product's moments of personality come from the Socratic idea: asking, testing and reflecting.

## Accessibility & Inclusion

- WCAG 2.2 AA: text contrast at least 4.5:1 (3:1 for large text and UI boundaries) in both light and dark themes.
- Full keyboard operation with visible focus; correct roles for custom controls (radio groups, dialogs, menus).
- Respect `prefers-reduced-motion`: keep opacity and color changes, drop movement.
- Spanish and English UI; never rely on color alone to convey state (pair it with icons or text).
