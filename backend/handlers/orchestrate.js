import { runAgent, runOrchestrator } from '../agents/index.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    if (!payload.task) {
      return jsonResponse(400, { error: 'task is required' });
    }

    const result = await runOrchestrator({
      task: payload.task,
      context: payload.context,
      availableAgents: payload.available_agents || []
    });

    const decision = parseDecision(result?.content);
    if (payload.execute === true && decision?.agent_id && decision.agent_id !== 'orchestrator') {
      const execution = await runAgent(decision.agent_id, payload.agent_payload || {});
      return jsonResponse(200, {
        decision,
        execution,
        usage: result?.usage ?? null
      });
    }

    return jsonResponse(200, {
      decision,
      raw: result?.content ?? '',
      usage: result?.usage ?? null
    });
  } catch (error) {
    return jsonResponse(500, { error: error.message || 'Server error' });
  }
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(body)
  };
}

function parseDecision(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
