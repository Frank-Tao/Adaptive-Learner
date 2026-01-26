import { runOrchestrator } from '../agents/index.js';

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

    return jsonResponse(200, result);
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
