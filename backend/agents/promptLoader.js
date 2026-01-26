import { readFile } from 'node:fs/promises';
import path from 'node:path';

const promptCache = new Map();

export async function loadPrompt(relativePath) {
  if (promptCache.has(relativePath)) {
    return promptCache.get(relativePath);
  }

  const fullPath = path.join(process.cwd(), relativePath);
  const content = await readFile(fullPath, 'utf8');
  promptCache.set(relativePath, content);
  return content;
}
