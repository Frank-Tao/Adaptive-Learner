import { createChatCompletion } from '../lib/openai.js';
import { fetchUrlText } from '../tools/index.js';
import { loadPromptWithPolicies } from './promptLoader.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DEFAULT_MODEL = 'gpt-4o-mini';
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_PATH = path.join(ROOT_DIR, 'prompts', 'url-summarizer.txt');
const POLICY_PATHS = [path.join(ROOT_DIR, 'policies', 'guardrails.txt')];

export async function runUrlSummarizer({ url, audience = 'general' }) {
  if (!url) {
    throw new Error('url is required');
  }

  const prompt = await loadPromptWithPolicies(PROMPT_PATH, POLICY_PATHS);
  const page = await fetchUrlText(url);

  const messages = [
    { role: 'system', content: prompt },
    {
      role: 'user',
      content: JSON.stringify({
        url: page.url,
        audience,
        content_type: page.contentType,
        truncated: page.truncated,
        text: page.text
      })
    }
  ];

  const completion = await createChatCompletion({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
    messages,
    temperature: 0.2
  });

  const content = completion?.choices?.[0]?.message?.content ?? '';
  return { content, usage: completion?.usage ?? null };
}
