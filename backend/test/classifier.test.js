import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySession } from '../lib/classifier.js';
import { selectMoment } from '../lib/momentSelector.js';

function buildSession(steps) {
  return {
    steps: new Map(steps.map((step) => [step.step_id, step]))
  };
}

test('classifySession returns success on stable performance', () => {
  const session = buildSession([
    {
      step_id: 's1',
      attempts: 1,
      hints: 0,
      correct: true,
      confidence: 4,
      time_on_step: 30,
      disengageSignals: 0,
      updated_at: Date.now()
    }
  ]);

  const result = classifySession(session);
  assert.equal(result.state, 'success');
});

test('classifySession returns struggle on high attempts', () => {
  const session = buildSession([
    {
      step_id: 's1',
      attempts: 3,
      hints: 2,
      correct: false,
      confidence: 2,
      time_on_step: 80,
      disengageSignals: 0,
      updated_at: Date.now()
    }
  ]);

  const result = classifySession(session);
  assert.equal(result.state, 'struggle');
});

test('classifySession returns disengagement on repeated disengage signals', () => {
  const session = buildSession([
    {
      step_id: 's1',
      attempts: 0,
      hints: 0,
      correct: false,
      confidence: null,
      time_on_step: null,
      disengageSignals: 2,
      updated_at: Date.now()
    }
  ]);

  const result = classifySession(session);
  assert.equal(result.state, 'disengagement');
});

test('selectMoment returns choices for struggle', () => {
  const moment = selectMoment({ state: 'struggle', summary: {} });
  assert.equal(moment.moment_type, 'diagnostic_adjust');
  assert.ok(moment.alternatives.includes('Simplify'));
});
