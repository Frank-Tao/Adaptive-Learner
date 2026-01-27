import test from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../handlers/agents.js';

test('agents handler returns registered agents', async () => {
  const response = await handler();
  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.ok(Array.isArray(body.agents));
  assert.ok(body.agents.includes('orchestrator'));
  assert.ok(body.agents.includes('summarize-url'));
});
