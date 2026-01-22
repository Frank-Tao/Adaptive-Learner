import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { handler } from '../handlers/events.js';
import { getSession } from '../lib/store.js';

test('events handler accepts activity feedback events', async () => {
  const sessionId = `session-${randomUUID()}`;
  const payload = {
    event_id: `event-${randomUUID()}`,
    session_id: sessionId,
    event_type: 'ACTIVITY_FEEDBACK',
    timestamp: new Date().toISOString(),
    value: {
      rating: 'neutral',
      issue: 'hard_to_apply',
      context: {
        role: 'change_manager',
        learner_state: 'disengagement',
        modality: 'guided_walkthrough',
        time_available_minutes: 10
      }
    }
  };

  const response = await handler({ body: JSON.stringify(payload) });
  assert.equal(response.statusCode, 200);

  const body = JSON.parse(response.body);
  assert.equal(body.ok, true);
  assert.equal(body.session_id, sessionId);

  const session = getSession(sessionId);
  assert.equal(session.events.length, 1);
  assert.equal(session.events[0].event_type, 'activity_feedback');
});

test('events handler rejects missing required fields', async () => {
  const response = await handler({ body: JSON.stringify({}) });
  assert.equal(response.statusCode, 400);
  const body = JSON.parse(response.body);
  assert.match(body.error, /missing fields/i);
});
