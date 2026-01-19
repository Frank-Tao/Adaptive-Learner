export function enforceTone(text) {
  if (!text) {
    return text;
  }
  return text.replace(/must|always/gi, 'can');
}
