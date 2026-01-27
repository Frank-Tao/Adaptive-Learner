const DEFAULT_MAX_CHARS = 8000;
const DEFAULT_TIMEOUT_MS = 8000;

function stripHtml(input) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchUrlText(
  url,
  { maxChars = DEFAULT_MAX_CHARS, timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }

    const rawText = await response.text();
    const cleaned = contentType.includes('text/html') ? stripHtml(rawText) : rawText.trim();

    return {
      url,
      contentType,
      text: cleaned.slice(0, maxChars),
      truncated: cleaned.length > maxChars
    };
  } finally {
    clearTimeout(timeout);
  }
}
