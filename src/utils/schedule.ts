export function transliterateNorwegian(value: string): string {
  return value
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'Ae')
    .replace(/ø/g, 'o')
    .replace(/Ø/g, 'O')
    .replace(/å/g, 'aa')
    .replace(/Å/g, 'Aa');
}
