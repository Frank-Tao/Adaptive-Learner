import test from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../handlers/chatgpt.js';

const ORIGINAL_ENV = { ...process.env };

function mockFetchOnce(response) {
  global.fetch = async () => response;
}

test('handler returns 400 when messages missing', async () => {
  const response = await handler({ body: JSON.stringify({}) });
  assert.equal(response.statusCode, 400);
  const body = JSON.parse(response.body);
  assert.equal(body.error, 'messages is required');
});

test('handler returns content from OpenAI response', async () => {
  process.env.OPENAI_API_KEY = 'test-key';
  process.env.OPENAI_MODEL = 'test-model';

  mockFetchOnce({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: 'Hello!' } }],
      usage: { total_tokens: 10 }
    })
  });

  const response = await handler({
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hi' }],
      temperature: 0.1
    })
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.content, 'Hello!');
  assert.deepEqual(body.usage, { total_tokens: 10 });
});

test('handler reports upstream errors', async () => {
  process.env.OPENAI_API_KEY = 'test-key';

  mockFetchOnce({
    ok: false,
    status: 500,
    text: async () => 'boom'
  });

  const response = await handler({
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hi' }]
    })
  });

  assert.equal(response.statusCode, 500);
  const body = JSON.parse(response.body);
  assert.match(body.error, /OpenAI error/);
});

test('cleanup env', () => {
  process.env = { ...ORIGINAL_ENV };
});
