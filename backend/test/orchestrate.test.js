import test from 'node:test';
import assert from 'node:assert/strict';
import { handler as orchestrateHandler } from '../handlers/orchestrate.js';
import { handler as summarizeHandler } from '../handlers/summarize-url.js';

const ORIGINAL_ENV = { ...process.env };

function mockFetchSequence(responses) {
  let index = 0;
  global.fetch = async () => {
    const response = responses[index];
    index += 1;
    return response;
  };
}

test('orchestrate handler rejects missing task', async () => {
  const response = await orchestrateHandler({ body: JSON.stringify({}) });
  assert.equal(response.statusCode, 400);
  const body = JSON.parse(response.body);
  assert.equal(body.error, 'task is required');
});

test('orchestrate handler returns parsed decision', async () => {
  process.env.OPENAI_API_KEY = 'test-key';

  mockFetchSequence([
    {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                next_action: 'route',
                agent_id: 'summarize-url',
                rationale: 'needs summary'
              })
            }
          }
        ],
        usage: { total_tokens: 12 }
      })
    }
  ]);

  const response = await orchestrateHandler({
    body: JSON.stringify({ task: 'summarize url', available_agents: ['summarize-url'] })
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.decision.agent_id, 'summarize-url');
  assert.equal(body.decision.next_action, 'route');
});

test('summarize-url handler rejects missing url', async () => {
  const response = await summarizeHandler({ body: JSON.stringify({}) });
  assert.equal(response.statusCode, 400);
  const body = JSON.parse(response.body);
  assert.equal(body.error, 'url is required');
});

test('cleanup env', () => {
  process.env = { ...ORIGINAL_ENV };
});
