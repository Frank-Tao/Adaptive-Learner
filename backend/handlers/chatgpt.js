import { createChatCompletion } from '../lib/openai.js';

const DEFAULT_MODEL = 'gpt-4o-mini';

export async function handler(event) {
  try {
    const payload = event?.body ? JSON.parse(event.body) : {};
    const messages = Array.isArray(payload.messages) ? payload.messages : [];

    if (messages.length === 0) {
      return jsonResponse(400, { error: 'messages is required' });
    }

    const completion = await createChatCompletion({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      messages,
      temperature: payload.temperature ?? 0.2
    });

    const content = completion?.choices?.[0]?.message?.content ?? '';

    return jsonResponse(200, {
      content,
      usage: completion.usage ?? null
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
