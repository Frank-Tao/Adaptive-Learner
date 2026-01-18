import { recordEvent, getSession } from '../lib/store.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    const required = ['event_id', 'session_id', 'event_type', 'timestamp'];
    const missing = required.filter((key) => !payload[key]);

    if (missing.length) {
      return jsonResponse(400, { error: `Missing fields: ${missing.join(', ')}` });
    }

    recordEvent(payload);
    const session = getSession(payload.session_id);

    return jsonResponse(200, {
      ok: true,
      session_id: session.sessionId,
      events: session.events.length
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
