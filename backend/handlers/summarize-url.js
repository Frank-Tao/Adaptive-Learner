import { runUrlSummarizer } from '../agents/index.js';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    if (!payload.url) {
      return jsonResponse(400, { error: 'url is required' });
    }

    const result = await runUrlSummarizer({
      url: payload.url,
      audience: payload.audience
    });

    return jsonResponse(200, {
      summary: result?.content ?? '',
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
