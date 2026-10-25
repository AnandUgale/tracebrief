# TraceBrief

A local extractive briefing tool. Paste notes, choose focus phrases and a bullet count, then inspect each selected sentence at its original source. Similar-context figures and supported deadline dates can produce source-linked review hints.

## Run

Open index.html directly in a modern browser, or use the optional loopback-only server:

```sh
node server.js
```

Open http://127.0.0.1:4173. No package installation, account, API key, model download or paid service is required. All note processing happens in browser memory; the server only serves static files. Notes are not automatically stored between visits.

## Verify

```sh
node --test
```

Fourteen tests currently cover source offsets, decimals, abbreviations, numbered lists, headings, negations, deterministic selection, exact focus matching, duplicates, invalid inputs, literal HTML, numeric/date review, phase/year contexts, focus coverage and Markdown export. Internal-browser checks also exercised source selection, stale export, clipboard copying, a real file download, empty input and mobile layout. These checks are engineering evidence, not a summary-quality benchmark or a competition ranking.

## Try the core loop

1. Choose **Try sample notes**. The sample is synthetic, not customer data.
2. Create a brief and choose a takeaway to highlight its source.
3. Inspect the budget review hint and its two source references.
4. Change focus or length. The old output becomes visibly out of date and export is disabled until regeneration.
5. Copy or export the current brief, including source references and a source appendix.

## How selection works

Sentence offsets are preserved. Content-word frequency and exact focus-phrase matches rank distinct sentences; a lexical-diversity adjustment reduces repetition. Selected sentences are displayed in source order without paraphrasing. Focus coverage distinguishes a topic absent from the source from one present but not selected.

Numeric-review hints compare only sufficiently similar lexical contexts, guard explicit differing phase/project/etc. labels, and handle supported English/ISO dates separately from ordinary figures. These are conservative review hints; they do not establish factual contradictions or truth.

## Limits

- Plain text only; up to 60,000 characters, 300 source sentences, six focus phrases and eight bullets.
- Sentence splitting and ranking are heuristics. Ambiguous formatting and domain-specific abbreviations may still need review. Selected quotations preserve their text but can omit surrounding context.
- Focus scoring does not guarantee that every topic is included.
- Date review supports validated English month-name dates and ISO dates. Numeric currencies are compared conservatively; symbols are not assumed to mean a particular named currency.
- No runtime language model, semantic fact checker, PDF parser, network research, accounts or cloud synchronization.
- Clipboard availability depends on the browser; Markdown download is the fallback.

## Build process and license

Built with AI assistance using the real [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics). Planning documents are in devpost/scope.md, devpost/prd.md and devpost/spec.md; verification/progress is in devpost/checklist.md. [Open the code map](devpost/app-map.html) for the reference route. Workflow adaptations record the human's explicit delegation without inventing human interviews or learning reflections.

App code: MIT License. The Devpost curriculum is a separate MIT-licensed development dependency; its source revision is recorded in devpost/skill-pack-provenance.json. No curriculum template is represented as completed application work.

Public hosting, a public repository, a demonstration-video link and actual competition submission remain separate delivery steps. This repository does not claim an awarded prize or completed submission.
