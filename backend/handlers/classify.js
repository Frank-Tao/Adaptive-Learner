import { getSession, recordClassification } from '../lib/store.js';
import { classifySession } from '../lib/classifier.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    if (!payload.session_id) {
      return jsonResponse(400, { error: 'session_id is required' });
    }

    const session = getSession(payload.session_id);
    const classification = classifySession(session);
    recordClassification(payload.session_id, classification.state);

    return jsonResponse(200, classification);
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
