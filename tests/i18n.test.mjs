import assert from 'node:assert/strict';
import test from 'node:test';
import { validateTranslations } from '../src/i18n/validate.mjs';

const reference = {
  title: 'Hello',
  hint: 'Choose {settings} for {name}',
  taglines: ['First tagline', 'Second tagline'],
};

test('accepts translated text, reordered placeholders, and different tagline counts', () => {
  assert.doesNotThrow(() => validateTranslations('nn', {
    title: 'Hei',
    hint: '{name}: Vel {settings}',
    taglines: ['Ei slaglinje'],
  }, reference));
});

const invalidDictionaries = [
  ['missing key', { hint: reference.hint, taglines: reference.taglines }, /title: missing key/],
  ['extra key', { ...reference, typo: 'Hello' }, /typo: unexpected key/],
  ['array instead of text', { ...reference, title: ['Hello'] }, /title: expected a non-empty string/],
  ['blank text', { ...reference, title: '  ' }, /title: expected a non-empty string/],
  ['text instead of array', { ...reference, taglines: 'Hello' }, /taglines: expected a non-empty array/],
  ['empty array', { ...reference, taglines: [] }, /taglines: expected a non-empty array/],
  ['invalid array item', { ...reference, taglines: [42] }, /taglines: expected a non-empty array/],
  ['missing placeholder', { ...reference, hint: 'Choose {settings}' }, /hint: placeholders must match/],
  ['renamed placeholder', { ...reference, hint: '{setting} for {name}' }, /hint: placeholders must match/],
];

for (const [name, dictionary, message] of invalidDictionaries) {
  test(`rejects ${name}`, () => {
    assert.throws(() => validateTranslations('en', dictionary, reference), message);
  });
}

test('identifies the language in validation failures', () => {
  assert.throws(() => validateTranslations('nn', {}, reference), /Invalid translations for "nn"/);
});
