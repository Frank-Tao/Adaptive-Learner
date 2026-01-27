import { readFile } from 'node:fs/promises';
import path from 'node:path';

const promptCache = new Map();
const policyCache = new Map();

export async function loadPrompt(relativePath) {
  if (promptCache.has(relativePath)) {
    return promptCache.get(relativePath);
  }

  const fullPath = path.isAbsolute(relativePath)
    ? relativePath
    : path.join(process.cwd(), relativePath);
  const content = await readFile(fullPath, 'utf8');
  promptCache.set(relativePath, content);
  return content;
}

export async function loadPolicy(relativePath) {
  if (policyCache.has(relativePath)) {
    return policyCache.get(relativePath);
  }

  const fullPath = path.isAbsolute(relativePath)
    ? relativePath
    : path.join(process.cwd(), relativePath);
  const content = await readFile(fullPath, 'utf8');
  policyCache.set(relativePath, content);
  return content;
}

export async function loadPromptWithPolicies(promptPath, policyPaths = []) {
  const prompt = await loadPrompt(promptPath);
  if (!policyPaths.length) {
    return prompt;
  }

  const policies = await Promise.all(policyPaths.map((policyPath) => loadPolicy(policyPath)));
  const extra = policies.filter(Boolean).join('\n\n');
  return `${prompt}\n\n${extra}`.trim();
}
