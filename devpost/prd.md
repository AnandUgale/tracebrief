---
doc: prd
status: approved
approval_basis: explicit user delegation of routine decisions; Pro research choice and agent review
decision_source: Pro research plus agent implementation choices under explicit user delegation
---

# TraceBrief — Product Requirements

Source: scope.md > The Unique Kernel and The Core Loop.

## The Core Journey

1. Open an empty, readable workspace with a sample-notes action.
2. Paste plain text, optionally add focus phrases, and choose 1–8 bullets.
3. Create a brief of distinct exact source sentences, shown in source order.
4. Select a bullet with mouse or keyboard to reveal and highlight its source.
5. Inspect any numeric-review hints and their paired sources.
6. Copy or export a source-referenced brief. Editing inputs makes the existing brief visibly out of date and disables export until regeneration.

## Screens and Layout

One responsive workspace: restrained navigation/brand strip, an introductory heading, notes/settings panel, brief panel and a source-inspection surface. On small screens panels stack without horizontal overflow. No login or extra navigation gates.

## Look and Feel

Agent-derived interpretation of Pro's readable, coherent UI: warm neutral background, white paper panels, nearly black text, amber highlights and muted green local-processing indicator. System fonts, large headline, precise labels and strong keyboard focus. This is not a human-stated design preference.

## Features and Behavior

### Notes and focus

Notes remain in memory and are never sent to a service. A labeled synthetic sample supplies a quick demonstration. A live character/word count informs the user. Up to six comma-separated focus phrases, at most 120 characters total, match complete normalized words or phrases; unknown terms produce a notice and a normal fallback brief.

Focus coverage distinguishes topics selected into the brief, topics found in the notes but omitted, and topics not found. It never promises that scoring alone covers every requested topic. The same distinction is included in Markdown export.

### Extractive brief

Output contains up to the requested number of unique source sentences. Exact duplicates appear once. Equal ranking scores use the earliest sentence. Selected sentences display in original order. Every bullet shows its source number and is an accessible button. All selected digits, punctuation and negations are preserved verbatim.

### Source inspection

The source surface preserves all sentence text and numbering. Clicking a bullet or review reference highlights and scrolls to the correct source, including when identical sentences occur more than once. All text is rendered as text, not interpreted HTML.

### Figures to review

Only similar lexical contexts with differing comparable numeric values generate hints. Unrelated years or figures must not be labeled contradictions. Hints display both source references and explain that context needs human review. The heuristic is explicitly limited; it is not a truth detector.

Explicitly different phase/project/team labels suppress comparisons. Supported English/ISO dates are handled separately: differing dates in matching event/deadline context generate a date-review hint, including year changes; different measurement dates are not treated as contradictions.

### Copy and export

Copy produces an inspectable brief with source references; Markdown download includes a source appendix and review hints. Clipboard failure offers the download action. No successful copy/download is claimed until the browser action succeeds.

## States and Boundaries

- Empty: the brief panel explains the next action; creating without notes shows an inline error and focuses the notes field.
- Invalid: over 60,000 characters, over 300 sentences, invalid count or excessive focus terms produces a clear message without partial results.
- Ready: brief, counts, hints and source references agree with the current input snapshot.
- Edited: old output is labeled out of date; copy/export are disabled until regeneration.
- Reset: clears notes/output and returns count to three; nothing persists after reload.

## Product Decisions

- Pro selected extractive summarization and static HTML/CSS/JS to meet zero-spend and traceability goals.
- The human delegated routine choices and rejected further routine questions. Agent choices refine the selected product; they are not represented as personal human review.
- No runtime LLM is claimed. No performance, user-value, competitor or rank claim is inferred from the prototype.

## What We're Building

The complete notes → focused brief → source inspection → export loop, with numeric hints, bounded inputs, responsive design and meaningful automated/browser verification.

## Deferred From the POC

PDF/file import, saving notes, network services, multi-user features and learned summarization. Each adds dependencies outside the proof's central behavior.

## Open Questions

No product-defining question blocks this delegated build. Human testing and learning reflection have not occurred and must not be fabricated. Public repository, video and final registration/submission remain unfinished.
