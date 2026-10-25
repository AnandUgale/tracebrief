---
doc: spec
status: approved
approval_basis: explicit user delegation of routine decisions; Pro research choice and agent review
decision_source: Pro architecture with deterministic agent refinements under explicit user delegation
---

# TraceBrief — Technical Spec

## How This Works, In Plain Language

The browser splits notes into source sentences, scores their words and focus matches, selects a small varied set, then displays exact quotations with source links. It compares numeric values only when sentence contexts are closely similar. The notes stay in the browser's memory.

## The Core Journey Through the System

Notes/settings → engine validation and sentence offsets → deterministic selection and review hints → safe DOM rendering → source highlight → clipboard or a generated Markdown file. Implements prd.md > The Core Journey.

## Stack

Static HTML, CSS and classic JavaScript, without third-party runtime dependencies. engine.js exposes the same pure functions to browser and Node tests. Node 24 is available locally and supplies the built-in test runner and an optional local static server. No package installation is needed for the app.

## Where It Runs and How Someone Tries It

Open index.html in a modern desktop browser, or run `node server.js` and open http://127.0.0.1:4173. Node serves files locally and never processes notes. Run `node --test` for verification. Deployment is optional. A local captioned video has been prepared from actual browser still captures; it is not continuous motion. The public repository and public video URLs, authentic interaction footage and actual registration/submission remain delivery gates. This source snapshot requires no accounts or external runtime services.

## Look and Feel

Implements prd.md > Look and Feel. CSS variables define paper (#f4f2ec), white surfaces, ink (#20251f), muted text, amber (#ddb74f) and green (#436c52). Use system sans-serif for UI and serif accents for the headline. Two-column grid collapses below 850px; keyboard focus and reduced-motion preferences are respected. No external fonts/images/scripts.

## Components

### Selection engine

Implements prd.md > Extractive brief. Preserve original start/end offsets. Split punctuation-delimited sentences while protecting common abbreviations and decimals; retain trailing fragments and newline-delimited notes. Tokenize Unicode letters/numbers, remove a local original stopword set for scoring only, and count document frequency. Score using sum(log(1+frequency))/sqrt(content-word count), plus 10 per matched focus phrase and a small decision-word bonus. Greedy selection subtracts 0.65 times maximum lexical similarity to selected sentences; ties prefer earliest source. Deduplicate normalized exact text, then sort selected sentences by original index for display. Quoted text is never rewritten.

Pro-review refinement: join a colon-ended heading to its next line, exclude remaining standalone headings from candidates, preserve numbered-list prefixes and ambiguous spaced numeric fragments. These are conservative heuristics, not universal sentence understanding. Return focusCoverage with source presence and selected source IDs so omission is distinct from absence.

### Review heuristic

Implements prd.md > Figures to review. Extract currency, percentage, date and general numeric signatures. Compare sentence pairs only when at least two nontrivial context words overlap and Jaccard similarity is at least 0.65. Distinct explicit single-year contexts are not flagged as contradictions. Emit at most five hints. Label each as a lexical review hint, never a proven conflict.

Pro-review refinement: guard explicit phase/project/team/etc. labels before comparison. Parse validated day–English-month–year, English-month–day–year and ISO dates separately. Compare revised dates only for matching event/deadline context, bypassing the ordinary distinct-year suppression for that case. Other different dated measurement periods are suppressed. Currency symbols are not silently mapped to named currencies.

### Workspace UI

Implements prd.md > Notes and focus, Source inspection, States and Boundaries. Use textContent/createTextNode for all input-derived content; no user-supplied HTML. Input edits invalidate export and visibly mark the previous brief stale. Build source spans with stable sentence IDs. Each bullet and hint reference is a keyboard-operable button.

### Export

Implements prd.md > Copy and export. Pure exportMarkdown builds text from the current result, with bullet references, review hints and a complete numbered source appendix. Clipboard API is attempted on a user click; failure produces a message and leaves Markdown download available. Blob download uses a fixed safe filename.

## Data Model

All state lives in memory: source text, focus list, requested count, current result and selected source ID. Each sentence has id, text, start, end and originalIndex. The result contains sentences, selected bullets, hints, unmatchedFocus and observed word/sentence counts. No localStorage, cookies, telemetry or network calls are used by the app.

## File Structure

```text
project/
  index.html       workspace and accessible controls
  styles.css       responsive visual system
  engine.js        pure selection, source offsets, numeric hints, export
  app.js           input/render/highlight/copy/download interactions
  server.js        optional loopback-only static server
  package.json     no-dependency start/test scripts
  test/engine.test.js
  README.md
  LICENSE
  devpost/         scope, PRD, spec, checklist, provenance and app map
```

## External Services and Dependencies

None at runtime. The official MIT-licensed Devpost Learn curriculum is installed under ignored .agents/skills and its revision is recorded separately. Browser research reports and source observations are held in the competition's research/ directory.

## Important Failure Modes

- Empty/oversized/too many sentences or focus terms → validation message and no misleading output.
- Sentence splitting around abbreviations, decimals and repeated sentences → offset-focused tests; document remaining language limitations.
- Clipboard unavailable → explicit message and Markdown download.
- False-positive numeric hints → conservative lexical thresholds, year-context guard and clear review wording.

## What Was Simplified and Why

Local extractive selection avoids model downloads, licensing assertions, API expenses and generated paraphrases. Plain text avoids document parsers. No automatic persistence keeps the proof small and avoids unexpected note retention.

## Decisions and Open Issues

Pro chose the product and static architecture. Agent refinements make ambiguous ranking/tie tests precise, keep all planning before implementation, and give Design its actual equal weight and first tie-break priority. These correct weak parts of the research report; they do not invent user preferences. No learner uncertainty has been established. Actual human review/reflection and submission artifacts remain uncompleted.
