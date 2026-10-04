/** @param {string} text */
function placeholders(text) {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))]
    .sort().join(',');
}

/**
 * Validate dictionaries at build time, using the default language as the schema.
 * @param {string} language
 * @param {Record<string, unknown>} translations
 * @param {Record<string, unknown>} reference
 */
export function validateTranslations(language, translations, reference) {
  const errors = [];
  for (const key of Object.keys(translations)) {
    if (!Object.hasOwn(reference, key)) errors.push(`${key}: unexpected key`);
  }

  for (const [key, expected] of Object.entries(reference)) {
    if (!Object.hasOwn(translations, key)) {
      errors.push(`${key}: missing key`);
      continue;
    }
    const value = translations[key];
    if (Array.isArray(expected)) {
      if (!Array.isArray(value) || value.length === 0 ||
          value.some((item) => typeof item !== 'string' || !item.trim())) {
        errors.push(`${key}: expected a non-empty array of non-empty strings`);
        continue;
      }
      // Taglines can differ in number and wording between languages.
      if (placeholders(value.join(' ')) !== placeholders(expected.join(' '))) {
        errors.push(`${key}: placeholders must match the default language`);
      }
    } else if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${key}: expected a non-empty string`);
    } else if (placeholders(value) !== placeholders(String(expected))) {
      errors.push(`${key}: placeholders must match the default language`);
    }
  }

  if (errors.length) {
    throw new Error(`Invalid translations for "${language}":\n${errors.join('\n')}`);
  }
}
