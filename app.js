'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const notes = $('notes'), focus = $('focus'), count = $('count');
  const SAMPLE = 'The pilot will help small teams turn project notes into checkable handovers.\nLaunch budget is $12,000 for the pilot.\nThe design review approved keyboard navigation and readable source references.\nLaunch budget is $14,000 for the pilot.\nWe must not publish customer names in the demonstration.\nThe launch checklist requires a working export and an empty-input test.\nA follow-up session will review the source links before the team shares its brief.\nThese sample notes are fictional and were written for this demonstration.';
  let result = null, current = false, toastTimer;
  function node(tag, className, text) { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; }
  function notify(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000); }
  function updateCounts() { $('input-count').textContent = `${TraceBrief.wordCount(notes.value)} words · ${notes.value.length.toLocaleString()} characters`; $('count-label').textContent = `${count.value} ${count.value === '1' ? 'bullet' : 'bullets'}`; }
  function stale() { updateCounts(); if (!result) return; current = false; $('stale-notice').hidden = false; $('copy').disabled = true; $('download').disabled = true; }
  function selectSource(id) {
    document.querySelectorAll('.source-sentence').forEach(n => n.classList.toggle('is-highlighted', Number(n.dataset.sourceId) === id));
    document.querySelectorAll('.bullet-button').forEach(n => { const active = Number(n.dataset.sourceId) === id; n.classList.toggle('active', active); n.setAttribute('aria-pressed', String(active)); });
    $('source-status').textContent = `Source sentence ${id}`;
    const target = document.getElementById(`source-${id}`);
    if (target) target.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function render(value) {
    $('empty').hidden = true; $('result').hidden = false; $('stale-notice').hidden = true;
    $('result-meta').textContent = `${value.bullets.length} takeaways · ${value.stats.briefWords} words from ${value.stats.inputWords} · ${value.stats.sourceSentences} source sentences`;
    const omitted = value.focusCoverage.filter(f => f.presentInSource && !f.selectedSourceIds.length).map(f => f.term);
    const notices = [];
    if (value.unmatchedFocus.length) notices.push(`Not found in your notes: ${value.unmatchedFocus.join(', ')}.`);
    if (omitted.length) notices.push(`Found in your notes, outside this brief: ${omitted.join(', ')}. Try a longer brief or fewer focus phrases.`);
    $('focus-notice').hidden = !notices.length; $('focus-notice').textContent = notices.join(' ');
    let coverage = $('focus-coverage');
    if (!coverage) { coverage = node('section', 'focus-coverage'); coverage.id = 'focus-coverage'; $('bullets').before(coverage); }
    coverage.replaceChildren(); coverage.hidden = !value.focusCoverage.length;
    if (value.focusCoverage.length) {
      coverage.append(node('h3', '', `Focus coverage · ${value.focusCoverage.filter(f => f.selectedSourceIds.length).length} of ${value.focusCoverage.length} represented`));
      const list = node('ul'); value.focusCoverage.forEach(f => { const state = f.selectedSourceIds.length ? 'covered' : f.presentInSource ? 'omitted' : 'absent'; list.append(node('li', state, `${f.term} · ${state === 'covered' ? 'in brief' : state === 'omitted' ? 'not selected' : 'not found'}`)); }); coverage.append(list);
    }
    $('bullets').replaceChildren();
    value.bullets.forEach((sentence, index) => {
      const li = node('li'), button = node('button', 'bullet-button');
      button.type = 'button'; button.dataset.sourceId = sentence.id; button.setAttribute('aria-pressed', 'false');
      const main = node('span', 'bullet-main'); main.append(node('span', 'bullet-number', String(index + 1).padStart(2, '0')), node('span', '', sentence.text));
      const meta = node('span', 'bullet-source'); meta.append(node('span', '', `↗ Source ${sentence.id}`));
      if (sentence.focusMatches.length) meta.append(node('span', 'matched', sentence.focusMatches.join(' · ')));
      button.append(main, meta); button.addEventListener('click', () => selectSource(sentence.id)); li.append(button); $('bullets').append(li);
    });
    $('source-panel').hidden = false; $('source-text').replaceChildren(); $('source-status').textContent = 'Choose a sentence above';
    value.sentences.forEach(sentence => { const span = node('span', 'source-sentence', sentence.text); span.id = `source-${sentence.id}`; span.dataset.sourceId = sentence.id; span.dataset.label = `S${sentence.id}`; $('source-text').append(span); });
    $('hints').replaceChildren(); $('hints-section').hidden = !value.hints.length; $('hint-count').textContent = value.hints.length;
    value.hints.forEach(hint => {
      const card = node('div', 'hint-card'); card.append(node('strong', '', hint.label), node('br'));
      hint.sourceIds.forEach((id, i) => {
        card.append(node('span', '', `${i ? ' / ' : ''}${hint.values[i].join(', ')} `));
        const button = node('button', '', `Source ${id}`); button.type = 'button'; button.addEventListener('click', () => selectSource(id)); card.append(button);
      });
      $('hints').append(card);
    });
    $('export-actions').hidden = false; $('copy').disabled = false; $('download').disabled = false;
  }
  function generate(event) {
    event?.preventDefault(); $('error').hidden = true;
    try { result = TraceBrief.createBrief(notes.value, { focus: focus.value, count: count.value }); current = true; render(result); }
    catch (error) { current = false; $('copy').disabled = true; $('download').disabled = true; $('error').textContent = error instanceof TraceBrief.InputError ? error.message : 'The brief could not be created. Try a smaller plain-text passage.'; $('error').hidden = false; notes.focus(); }
  }
  $('brief-form').addEventListener('submit', generate);
  [notes, focus, count].forEach(control => control.addEventListener('input', stale));
  $('sample').addEventListener('click', () => { notes.value = SAMPLE; focus.value = 'launch, budget'; count.value = '3'; updateCounts(); generate(); });
  $('reset').addEventListener('click', () => { notes.value = ''; focus.value = ''; count.value = '3'; result = null; current = false; $('result').hidden = true; $('source-panel').hidden = true; $('empty').hidden = false; $('error').hidden = true; updateCounts(); notes.focus(); });
  $('copy').addEventListener('click', async () => {
    if (!current || !result) return;
    try { await navigator.clipboard.writeText(TraceBrief.exportMarkdown(result)); notify('Brief and source references copied.'); }
    catch { notify('Clipboard is unavailable here. Use Export .md to save your brief.'); }
  });
  $('download').addEventListener('click', () => {
    if (!current || !result) return;
    const blob = new Blob([TraceBrief.exportMarkdown(result)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'tracebrief.md'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Your brief is ready to save.');
  });
  updateCounts();
})();
