import { getProfile, updateProfile } from '../lib/store.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    if (!payload.user_id) {
      return jsonResponse(400, { error: 'user_id is required' });
    }

    if (payload.updates) {
      const profile = updateProfile(payload.user_id, payload.updates);
      return jsonResponse(200, { profile });
    }

    const profile = getProfile(payload.user_id);
    return jsonResponse(200, { profile });
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
