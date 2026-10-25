---
doc: scope
status: approved
approval_basis: explicit user delegation of routine decisions; Pro research choice and agent review
decision_source: ChatGPT Pro Deep Research under explicit user delegation
---

# TraceBrief

A local, source-linked briefing tool that makes every selected sentence easy to check.

## The Unique Kernel

The brief is made of exact source sentences, each linked to its original location. Focus-aware selection and cautious numeric-review hints turn a pile of notes into an inspectable brief. Runtime behavior is deterministic extractive selection, not a language model.

## Who It's For

A solo builder or project lead who needs a short, checkable handover from meeting or project notes. This persona and the product direction were selected through Pro research under the human's explicit delegation; no user interviews or market validation are claimed.

## The Core Loop

Paste notes, set an optional focus and bullet count, create a brief, click a sentence to inspect its source, review any differing figures, and copy or export the result. Change the focus and repeat.

## Inspiration & Identity

Pro recommended a readable single-surface web app. Agent-derived design direction: calm editorial workspace, warm paper, dark ink, amber source highlights, strong typography, generous spacing and responsive panels. No external fonts or visual libraries.

## Why This Matters to the Learner

The development constraints are a small complete proof of concept, no paid runtime services and a limited delivery window. Product decisions were delegated to Pro research and the coding agent. No personal learning reflection is inferred from that delegation.

## What "Working" Looks Like

Load clearly labeled synthetic project notes, create a three-bullet brief, click a bullet and see the exact source highlighted. Two similar budget statements with different amounts produce a review hint. Export contains the brief and source references. Empty, oversized and unusual text receive predictable handling.

## The POC Boundary

One static browser surface; plain-text notes; up to 60,000 characters and 300 sentences; 1–8 bullets; up to six comma-separated focus phrases; local computation, source inspection, numeric-review hints, clipboard and Markdown export. No account, server processing, model download, API key or payment.

## Later

File import, richer document formats and a separately evaluated learned ranking algorithm could be considered after the entry. None is necessary to prove this core loop.

## Explicitly Cut

- Neural summarization: introduces downloads, CPU and license assumptions without proving traceability.
- Scraping and live research inside the app: adds network and source-access complexity.
- Semantic truth verification: numeric hints are suggestions for human review, not factual judgments.
- Accounts, cloud storage, collaboration and automatic note persistence: unnecessary for this local proof of concept.
- Claims of novelty, rank, reading-time savings or summary-quality metrics without measured evidence.

## Research and review provenance

Pro Deep Research chose this extractive architecture after a review of its generic neural summarizer proposal. Its report contains no source citations, so external factual/market claims are not adopted. Competition facts were cross-checked against the official rules. Private research conversations and source observations are retained separately from the public app repository. Ambiguous tests, post-hoc planning and unsupported design/quality claims in the report are corrected by the actual curriculum sequence and deterministic spec.
