import { createChatCompletion } from '../lib/openai.js';
import { loadPrompt } from './promptLoader.js';

const DEFAULT_MODEL = 'gpt-4o-mini';
const PROMPT_PATH = 'backend/prompts/orchestrator.txt';

export async function runOrchestrator({ task, context, availableAgents = [] }) {
  if (!task) {
    throw new Error('task is required');
  }

  const prompt = await loadPrompt(PROMPT_PATH);
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
