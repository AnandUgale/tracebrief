(function (root) {
  'use strict';
  const STOP = new Set('a an the and or but if then so as at by for from in into of on to with is are was were be been being it its this that these those we our you your they their he she his her i me my us them have has had do does did can could would should will may might about after before more most some any all also very just than there here'.split(' '));
  const ABBR = new Set(['dr', 'mr', 'mrs', 'ms', 'prof', 'vs', 'e.g', 'i.e', 'fig', 'no', 'inc']);
  class InputError extends Error { constructor(message) { super(message); this.name = 'InputError'; } }
  const tokens = text => (text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) || []);
  const content = text => tokens(text).filter(w => !STOP.has(w));
  const wordCount = text => tokens(text).length;
  const similarity = (a, b) => {
    const left = new Set(a), right = new Set(b);
    const overlap = [...left].filter(w => right.has(w)).length;
    return overlap / (new Set([...left, ...right]).size || 1);
  };
  function splitSentences(text) {
    const result = [];
    let start = 0;
    function push(end) {
      const piece = text.slice(start, end);
      const leading = piece.length - piece.trimStart().length;
      const value = piece.trim();
      if (value) result.push({ id: result.length + 1, originalIndex: result.length, text: value, start: start + leading, end: start + leading + value.length });
      start = end;
    }
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '\n') {
        if (text.slice(start, i).trim().endsWith(':') && text[i + 1] && text[i + 1] !== '\n') continue;
        push(i); start = i + 1; continue;
      }
      if (!'.!?'.includes(c)) continue;
      if (/[.!?]/.test(text[i + 1] || '')) continue;
      let end = i + 1;
      while (end < text.length && /["'”’\)\]]/.test(text[end])) end++;
      if (end < text.length && !/\s/.test(text[end])) continue;
      if (c === '.' && /\d/.test(text[i - 1] || '') && (/^\d/.test(text.slice(end).trimStart()) || /(?:^|\n)\s*\d{1,3}$/.test(text.slice(start, i)))) continue;
      const previous = text.slice(start, i).match(/([\p{L}.]+)$/u)?.[1]?.toLowerCase();
      if (c === '.' && previous && (ABBR.has(previous) || /^[a-z]$/.test(previous))) continue;
      push(end); i = end - 1;
    }
    push(text.length);
    return result;
  }
  function parseFocus(value) {
    if (typeof value !== 'string' || value.length > 120) throw new InputError('Keep focus phrases within 120 characters.');
    const phrases = [...new Set(value.split(',').map(s => tokens(s).join(' ')).filter(Boolean))];
    if (phrases.length > 6) throw new InputError('Use up to six focus phrases, separated by commas.');
    return phrases;
  }
  const matches = (sentence, phrase) => (' ' + tokens(sentence).join(' ') + ' ').includes(' ' + phrase + ' ');
  function numericValues(text) {
    return [...text.matchAll(/(?:[$€£₹]\s*)?\b\d[\d,]*(?:\.\d+)?(?:\s*%|\s*(?:USD|EUR|INR|GBP)\b)?/giu)].map(match => {
      const raw = match[0], normalized = raw.replace(/[,\s]/g, '').toLowerCase();
      const currency = raw.match(/[$€£₹]|USD|EUR|INR|GBP/i)?.[0]?.toLowerCase();
      return { raw, normalized, kind: currency ? `currency:${currency}` : raw.includes('%') ? 'percent' : 'number' };
    });
  }
  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const MONTH_PATTERN = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
  function datesIn(text) {
    const dates = [];
    function add(raw, year, month, day) {
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (date.getUTCFullYear() === Number(year) && date.getUTCMonth() + 1 === Number(month) && date.getUTCDate() === Number(day)) dates.push({ raw, normalized: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` });
    }
    for (const m of text.matchAll(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_PATTERN})\\s+(\\d{4})\\b`, 'gi'))) add(m[0], m[3], MONTHS[m[2].slice(0, 3).toLowerCase()], m[1]);
    for (const m of text.matchAll(new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2}),?\\s+(\\d{4})\\b`, 'gi'))) add(m[0], m[3], MONTHS[m[1].slice(0, 3).toLowerCase()], m[2]);
    for (const m of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) add(m[0], m[1], m[2], m[3]);
    return dates;
  }
  function labelsIn(text) {
    const labels = new Map();
    for (const m of text.matchAll(/\b(phase|project|team|region|quarter|version|account|product|site)\s+([a-z0-9][\w-]*)/gi)) {
      const key = m[1].toLowerCase();
      if (!labels.has(key)) labels.set(key, new Set());
      labels.get(key).add(m[2].toLowerCase());
    }
    return labels;
  }
  function findReviewHints(sentences) {
    const prepared = sentences.map(s => {
      const dates = datesIn(s.text);
      return { ...s, dates, labels: labelsIn(s.text), numbers: numericValues(s.text), context: content(s.text).filter(w => !/\d/u.test(w) && !(dates.length && new RegExp(`^(?:${MONTH_PATTERN})$`, 'i').test(w))), years: [...s.text.matchAll(/\b(?:19|20)\d{2}\b/g)].map(m => m[0]) };
    });
    const hints = [];
    for (let i = 0; i < prepared.length && hints.length < 5; i++) for (let j = i + 1; j < prepared.length && hints.length < 5; j++) {
      const a = prepared[i], b = prepared[j];
      if (!a.numbers.length || !b.numbers.length) continue;
      if ([...a.labels].some(([key, values]) => b.labels.has(key) && ![...values].some(value => b.labels.get(key).has(value)))) continue;
      const common = [...new Set(a.context)].filter(w => new Set(b.context).has(w));
      if (common.length < 2 || similarity(a.context, b.context) < 0.65) continue;
      if (a.dates.length && b.dates.length && a.dates.map(d => d.normalized).sort().join('|') !== b.dates.map(d => d.normalized).sort().join('|')) {
        if (common.some(w => ['deadline', 'due', 'launch', 'delivery', 'milestone', 'scheduled'].includes(w))) hints.push({ id: hints.length + 1, kind: 'date', sourceIds: [a.id, b.id], values: [a.dates.map(d => d.raw), b.dates.map(d => d.raw)], label: 'Dates for the same event differ' });
        continue;
      }
      if (a.years.length && b.years.length && !a.years.some(y => b.years.includes(y))) continue;
      const kinds = [...new Set(a.numbers.map(n => n.kind))].filter(k => b.numbers.some(n => n.kind === k));
      const differing = kinds.filter(k => [...new Set(a.numbers.filter(n => n.kind === k).map(n => n.normalized))].sort().join('|') !== [...new Set(b.numbers.filter(n => n.kind === k).map(n => n.normalized))].sort().join('|'));
      if (!differing.length) continue;
      hints.push({ id: hints.length + 1, sourceIds: [a.id, b.id], values: [a.numbers.filter(n => differing.includes(n.kind)).map(n => n.raw), b.numbers.filter(n => differing.includes(n.kind)).map(n => n.raw)], label: common.includes('budget') ? 'Budget figures differ' : 'Figures in similar wording differ' });
    }
    return hints;
  }
  function createBrief(text, options = {}) {
    if (typeof text !== 'string' || !text.trim()) throw new InputError('Add some notes to create your brief.');
    if (text.length > 60000) throw new InputError('Use up to 60,000 characters per brief.');
    const count = options.count === undefined ? 3 : Number(options.count);
    if (!Number.isInteger(count) || count < 1 || count > 8) throw new InputError('Choose between one and eight bullets.');
    const focus = parseFocus(options.focus || '');
    const sentences = splitSentences(text);
    if (sentences.length > 300) throw new InputError('Use up to 300 sentences per brief.');
    const frequencies = new Map();
    sentences.forEach(s => content(s.text).forEach(w => frequencies.set(w, (frequencies.get(w) || 0) + 1)));
    const seen = new Set();
    const candidates = sentences.filter(s => !s.text.trim().endsWith(':')).filter(s => {
      const key = s.text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).map(s => {
      const words = content(s.text);
      const focusMatches = focus.filter(f => matches(s.text, f));
      const base = words.reduce((sum, w) => sum + Math.log1p(frequencies.get(w) || 0), 0) / Math.sqrt(words.length || 1);
      return { ...s, words, focusMatches, score: base + focusMatches.length * 10 + (/\b(not|never|must|cannot|approved|decided|deadline|budget|required)\b/i.test(s.text) ? 0.15 : 0) };
    });
    if (!candidates.length) throw new InputError('Add a note or statement after the heading to create a brief.');
    const selected = [];
    while (selected.length < Math.min(count, candidates.length)) {
      let best = null, bestScore = -Infinity;
      for (const candidate of candidates) {
        if (selected.some(s => s.id === candidate.id)) continue;
        const adjusted = candidate.score - 0.65 * Math.max(0, ...selected.map(s => similarity(candidate.words, s.words)));
        if (adjusted > bestScore + 1e-9 || (Math.abs(adjusted - bestScore) <= 1e-9 && candidate.originalIndex < best.originalIndex)) { best = candidate; bestScore = adjusted; }
      }
      selected.push(best);
    }
    const bullets = selected.sort((a, b) => a.originalIndex - b.originalIndex);
    const focusCoverage = focus.map(term => ({ term, presentInSource: sentences.some(s => matches(s.text, term)), selectedSourceIds: bullets.filter(s => matches(s.text, term)).map(s => s.id) }));
    return { source: text, focus, count, sentences, bullets, hints: findReviewHints(sentences), focusCoverage, unmatchedFocus: focusCoverage.filter(f => !f.presentInSource).map(f => f.term), stats: { inputWords: wordCount(text), briefWords: wordCount(bullets.map(s => s.text).join(' ')), sourceSentences: sentences.length, distinctSentences: candidates.length } };
  }
  function exportMarkdown(result) {
    const escape = value => value.replace(/[\\`*_{}\[\]<>#!|]/g, '\\$&');
    const lines = ['# TraceBrief', '', 'Deterministic extractive selection. Bullets quote the source; this is not a language-model output.', '', `Focus: ${result.focus.length ? result.focus.map(escape).join(', ') : 'none'}`];
    if (result.focusCoverage?.length) {
      lines.push('', `Focus coverage: ${result.focusCoverage.filter(f => f.selectedSourceIds.length).length} of ${result.focusCoverage.length} represented.`);
      result.focusCoverage.forEach(f => lines.push(`- ${escape(f.term)}: ${f.selectedSourceIds.length ? 'in brief' : f.presentInSource ? 'found in source, not selected' : 'not found in source'}`));
    }
    lines.push('', '## Brief', '');
    result.bullets.forEach(s => lines.push(`- ${escape(s.text)} ([S${s.id}](#source-${s.id}))`));
    if (result.hints.length) {
      lines.push('', '## Figures to review', '', 'These are lexical review hints, not verified contradictions. Check the original context.', '');
      result.hints.forEach(h => lines.push(`- ${h.label}: ${h.sourceIds.map((id, i) => `${escape(h.values[i].join(', '))} ([S${id}](#source-${id}))`).join(' / ')}`));
    }
    lines.push('', '## Source appendix', '');
    result.sentences.forEach(s => {
      const longest = (s.text.match(/`+/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
      const fence = '`'.repeat(Math.max(3, longest + 1));
      lines.push(`### Source ${s.id}`, '', fence + 'text', s.text, fence, '');
    });
    return lines.join('\n');
  }
  const api = { createBrief, splitSentences, parseFocus, findReviewHints, exportMarkdown, wordCount, tokens, similarity, InputError };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TraceBrief = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
