import { getSession, recordClassification } from '../lib/store.js';
import { classifySession } from '../lib/classifier.js';
import { selectMoment, buildExplanation } from '../lib/momentSelector.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    if (!payload.session_id) {
      return jsonResponse(400, { error: 'session_id is required' });
    }

    const session = getSession(payload.session_id);
    const classification = classifySession(session);
    recordClassification(payload.session_id, classification.state);

    const moment = selectMoment({
      state: classification.state,
      summary: classification.summary
    });

    return jsonResponse(200, {
      ...moment,
      explanation: buildExplanation(classification)
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
