---
doc: checklist
status: approved
approval_basis: explicit user delegation of routine decisions; Pro research choice and agent review
decision_source: user delegated routine decisions to Pro and agent
---

# Build Checklist

Build mode: delegated fast execution, per explicit no-routine-questions instruction. Mechanical and Pro review replace routine agent approval prompts; no human testing or learning is claimed.

## Slices

- [x] **1. Create a focused brief and inspect every sentence at its source**
  Becomes usable: Notes and settings produce distinct verbatim bullets; each opens the correct source highlight in a complete responsive workspace.
  Why now: Proves the traceability kernel end to end, including bootstrap and visual design.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Extractive brief`, `prd.md > Source inspection`
  Spec ref: `spec.md > Selection engine`, `spec.md > Workspace UI`, `spec.md > File Structure`
  Build: Implement static workspace, pure selection engine, bounded validation, sample notes, rendering and source interaction.
  Verify (mechanical): Run source-offset, exact-sentence, focus, tie, duplicate, punctuation and input-bound tests; start local server and use the internal browser to generate and inspect a brief.
  Learner check: Optional later review: load sample notes, create a brief, click a bullet and inspect its highlighted source. No human execution is inferred.
  Commit: `Build focused extractive brief with source inspection`

- [x] **2. Review differing figures and export an auditable brief**
  Becomes usable: Similar-context figures receive source-linked review hints; copy/export preserve evidence and prevent stale output.
  Why now: Adds the distinguishing review/export loop after the source kernel works.
  PRD ref: `prd.md > Figures to review`, `prd.md > Copy and export`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Review heuristic`, `spec.md > Export`, `spec.md > Workspace UI`
  Build: Add conservative numeric hints, source-pair navigation, Markdown export, clipboard fallback and stale-result controls.
  Verify (mechanical): Test same-context differing amounts, unrelated figures/year guard, source references and export; verify sample hints and stale controls through the browser.
  Learner check: Optional later review: inspect a budget hint, edit notes and confirm export requires an updated brief.
  Commit: `Add numeric review hints and source-linked export`

- [x] **3. Verify the complete experience and prepare inspectable delivery evidence**
  Becomes usable: The local proof has documented run instructions, honest limitations, app map and a repeatable demo path.
  Why now: Reviews the final judging experience and catches regressions before submission preparation.
  PRD ref: `prd.md > What We're Building`, `prd.md > Open Questions`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Important Failure Modes`
  Build: Run full checks, inspect desktop and mobile layouts, document actual results, prepare demo outline/app map and send measured evidence to the dedicated Pro Deep Research chat for critique.
  Verify (mechanical): Full Node tests, browser core/empty/stale/keyboard flows, console errors and responsive screenshot review. Address actionable Pro critique before claiming readiness.
  Learner check: The user may inspect the finished proof; do not mark personal review complete without evidence.
  Commit: `Document verified proof and judging demonstration`

## Hands-on Checkpoints

- [ ] Early usable behavior explored by human — not requested under delegated execution; remains unperformed.
- [ ] Final human exploration and feedback — remains unperformed.

## Final Review

- [x] Agent mechanical/browser checks complete for the local proof; public release checks remain separate.
- [x] Ordinary Pro code critique received and its three product findings resolved with regression tests.
- [x] Ordinary Pro final-demo critique received; caption defect fixed and clean release prepared.
- [ ] Authentic continuous interaction footage added, as recommended by final-demo critique; current video is a sequence of actual browser still captures.
- [ ] Human personally confirms ready to ship — not claimed under delegation.

## Code Tour and App Map

- [x] Reference app map generated from actual code and checked.
- [ ] Human learning activity/reflection — not established; do not fabricate.

Activity and evidence: Fourteen Node tests pass after Pro-directed repairs. Saved internal-browser evidence covers sample/source-click, numeric-hint, stale-export, clipboard, actual Markdown download, empty-input and literal-HTML flows. Saved mobile 390px layout fits the viewport. Final keyboard Enter activation selects source 2. Evidence is held privately outside the public app repository. No human testing is claimed.
Route and stops: app.js generate(); engine.js splitSentences(), createBrief(), findReviewHints(); app.js render()/selectSource(); engine.js exportMarkdown().
Edit outcome: Five regression fixtures guided source-boundary, phase-context, date-revision and focus-coverage repairs. The map follows these actual functions.
Reflection: Not supplied; do not solicit routine questions against the explicit preference.
Activity mode: Agent verification plus Pro critique under delegation; a human code tour is not claimed.

## Revisions

- Applied the ordinary Pro code critique without another Deep Research request: tests exposed heading/numeric-fragment and numbered-list splitting, Phase A/Phase B false-positive hints, missing cross-year deadline hints, and missing focus-coverage states. Added explicit regressions and repaired all five cases.
- Preserved exact source offsets while joining contextual headings; added transparent focus coverage to UI and export. These refine the existing kernel without new services or model dependencies.
- Fixed mobile copy spacing and added wrapping for unbroken source text; source selection now announces its status through a polite live region.
- Completed the third slice's local documentation, code map, regression verification and ordinary Pro final-demo consultation. This checks local implementation delivery only, not publication or submission.
- Final Pro critique froze features and prioritized authentic interaction footage and a clean source snapshot. A caption overlap defect was repaired in the video preparation script. Continuous recording was attempted with the existing Windows recorder, but Computer Use stopped because browser URL verification failed; no recording is claimed.
- Human exploration, learning reflections and personal sign-off remain unperformed. The explicit human delegation governs routine execution; this is a documented curriculum adaptation, not a claim of literal completion of every human-led curriculum activity.
