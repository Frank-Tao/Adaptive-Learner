import { createChatCompletion } from '../lib/openai.js';
import { loadPromptWithPolicies } from './promptLoader.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DEFAULT_MODEL = 'gpt-4o-mini';
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_PATH = path.join(ROOT_DIR, 'prompts', 'orchestrator.txt');
const POLICY_PATHS = [path.join(ROOT_DIR, 'policies', 'guardrails.txt')];

export async function runOrchestrator({ task, context, availableAgents = [] }) {
  if (!task) {
    throw new Error('task is required');
  }

  const prompt = await loadPromptWithPolicies(PROMPT_PATH, POLICY_PATHS);
  const messages = [
    { role: 'system', content: prompt },
    {
      role: 'user',
      content: JSON.stringify({
        task,
        context: context ?? null,
        available_agents: availableAgents
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
