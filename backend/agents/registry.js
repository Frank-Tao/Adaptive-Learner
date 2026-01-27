import { runOrchestrator } from './orchestrator.js';
import { runUrlSummarizer } from './urlSummarizer.js';

const registry = {
  orchestrator: runOrchestrator,
  'summarize-url': runUrlSummarizer
};

export function listAgents() {
  return Object.keys(registry);
}

export async function runAgent(agentId, payload) {
  const agent = registry[agentId];
  if (!agent) {
    throw new Error(`Unknown agent: ${agentId}`);
  }
  return agent(payload);
}
