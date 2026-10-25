'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createBrief, splitSentences, InputError } = require('../engine.js');
const { exportMarkdown } = require('../engine.js');
test('exact source slices preserve decimals, punctuation and negation', () => {
  const text = 'Dr. Rao approved $12.50 for the pilot. We must not publish the names. Final note';
  const sentences = splitSentences(text);
  assert.equal(sentences.length, 3);
  for (const s of sentences) assert.equal(text.slice(s.start, s.end), s.text);
  assert.match(sentences[0].text, /^Dr\. Rao.*\$12\.50/);
  assert.match(sentences[1].text, /must not/);
});
test('equal scores use source order and repeated inputs are deterministic', () => {
  const text = 'Sky blue. Grass green. Sun bright.';
  assert.deepEqual(createBrief(text, { count: 2 }).bullets.map(s => s.id), [1, 2]);
  assert.deepEqual(createBrief(text), createBrief(text));
});
test('focus matches whole words and selects the matching source', () => {
  const text = 'The launch budget is approved. A launchpad is outside. The team discussed gardens.';
  assert.equal(createBrief(text, { count: 1, focus: 'launch' }).bullets[0].id, 1);
  assert.deepEqual(createBrief(text, { focus: 'cherry' }).unmatchedFocus, ['cherry']);
});
test('deduplication retains stable original offsets', () => {
  const text = 'Repeated note. Repeated note. Different note.';
  const result = createBrief(text, { count: 8 });
  assert.deepEqual(result.bullets.map(s => s.id), [1, 3]);
  result.sentences.forEach(s => assert.equal(text.slice(s.start, s.end), s.text));
});
test('line breaks, Unicode and hostile HTML stay literal', () => {
  const text = 'कृपया ध्यान दें।\n<script>alert("x")</script>\nBudget: €500.';
  const result = createBrief(text, { count: 8 });
  assert.equal(result.sentences.length, 3);
  assert.ok(result.bullets.some(s => s.text.includes('<script>')));
});
test('short input remains usable and invalid inputs fail explicitly', () => {
  assert.equal(createBrief('Hello world.', { count: 3 }).bullets.length, 1);
  for (const [text, options] of [['', {}], ['a'.repeat(60001), {}], ['A sentence.', { count: 0 }], ['A sentence.', { count: 1.2 }], ['A sentence.', { focus: 'a,b,c,d,e,f,g' }], [Array(301).fill('Note.').join(' '), {}]]) assert.throws(() => createBrief(text, options), InputError);
});
test('similar budget statements produce a source-paired review hint', () => {
  const result = createBrief('Launch budget is $12,000 for the pilot. Launch budget is $14,000 for the pilot.');
  assert.equal(result.hints.length, 1);
  assert.deepEqual(result.hints[0].sourceIds, [1, 2]);
  assert.deepEqual(result.hints[0].values, [['$12,000'], ['$14,000']]);
});
test('unrelated numeric contexts and distinct years avoid misleading hints', () => {
  assert.equal(createBrief('The launch budget is $12,000. The garden contains 14 flowers.').hints.length, 0);
  assert.equal(createBrief('In 2023, pilot sales increased by 10%. In 2024, pilot sales increased by 12%.').hints.length, 0);
  assert.equal(createBrief('Launch budget is $12,000 for the pilot. Launch budget is $12000 for the pilot.').hints.length, 0);
});
test('export contains actual source references and safely fenced source text', () => {
  const result = createBrief('Keep <script>alert(1)</script> as text. Do not change $12.50.', { count: 2 });
  const output = exportMarkdown(result);
  assert.match(output, /\[S1\]\(#source-1\)/);
  assert.match(output, /### Source 2/);
  assert.ok(output.includes('Do not change $12.50.'));
  assert.ok(output.includes('\\<script\\>'));
  const fenceResult = createBrief('Include ``` in notes.', { count: 1 });
  assert.ok(exportMarkdown(fenceResult).includes('````text'));
});
test('headings stay with their statement and numeric fragments remain intact', () => {
  const text = 'Budget:\n₹500 approved. Version 2. 5 is documented.';
  const result = createBrief(text, { count: 8 });
  assert.deepEqual(result.sentences.map(s => s.text), ['Budget:\n₹500 approved.', 'Version 2. 5 is documented.']);
  result.sentences.forEach(s => assert.equal(text.slice(s.start, s.end), s.text));
  assert.throws(() => createBrief('Budget:\n\n'), InputError);
});
test('numbered lists and ordinary punctuation preserve meaningful boundaries', () => {
  assert.equal(splitSentences('Dr. Rao approved ₹500. Work starts Monday.').length, 2);
  assert.equal(splitSentences('The rate is 3.5%. It was not approved.').length, 2);
  assert.deepEqual(splitSentences('1. Check the budget.\n2. Do not publish names.').map(s => s.text), ['1. Check the budget.', '2. Do not publish names.']);
  assert.deepEqual(splitSentences('Wait... Do not proceed.').map(s => s.text), ['Wait...', 'Do not proceed.']);
});
test('explicitly different phases are not treated as the same numeric context', () => {
  assert.equal(createBrief('The approved budget for Phase A is ₹500. The approved budget for Phase B is ₹700.').hints.length, 0);
  assert.equal(createBrief('The approved budget is ₹500. The approved budget is ₹700.').hints.length, 1);
});
test('same-event deadline revisions are reviewed, including different years', () => {
  const changed = createBrief('The project deadline is 12 May 2026. The project deadline is 19 June 2027.');
  assert.equal(changed.hints.length, 1);
  assert.equal(changed.hints[0].kind, 'date');
  assert.deepEqual(changed.hints[0].sourceIds, [1, 2]);
  assert.equal(createBrief('Pilot measurements on 12 May 2026 were 5%. Pilot measurements on 19 May 2026 were 7%.').hints.length, 0);
});
test('focus coverage distinguishes not found from present but not selected', () => {
  const result = createBrief('The safety inspection failed. The budget was approved at ₹500. The launch schedule remains unchanged.', { focus: 'safety, budget, unicorn', count: 1 });
  assert.equal(result.focusCoverage.length, 3);
  assert.equal(result.focusCoverage.filter(s => s.presentInSource).length, 2);
  assert.equal(result.focusCoverage.filter(s => s.selectedSourceIds.length).length, 1);
  assert.deepEqual(result.unmatchedFocus, ['unicorn']);
  assert.match(exportMarkdown(result), /Focus coverage: 1 of 3 represented/);
  assert.match(exportMarkdown(result), /found in source, not selected/);
});
