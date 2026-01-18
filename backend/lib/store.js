const store = {
  sessions: new Map(),
  metrics: {
    stateCounts: { success: 0, struggle: 0, disengagement: 0 },
    flips: 0,
    recoveries: 0,
    disengageToSuccess: 0
  }
};

function getSession(sessionId) {
  if (!store.sessions.has(sessionId)) {
    store.sessions.set(sessionId, {
      sessionId,
      steps: new Map(),
      events: [],
      lastState: null
    });
  }
  return store.sessions.get(sessionId);
}

function recordEvent(event) {
  const session = getSession(event.session_id);
  session.events.push({ ...event, received_at: new Date().toISOString() });

  if (event.step_id) {
    if (!session.steps.has(event.step_id)) {
      session.steps.set(event.step_id, {
        step_id: event.step_id,
        attempts: 0,
        hints: 0,
        correct: false,
        confidence: null,
        time_on_step: null,
        disengageSignals: 0,
        updated_at: Date.now()
      });
    }
    const step = session.steps.get(event.step_id);
    applyEventToStep(step, event);
  }

  return session;
}

function applyEventToStep(step, event) {
  switch (event.event_type) {
    case 'step_attempted':
      step.attempts += 1;
      break;
    case 'step_correct':
      step.correct = true;
      break;
    case 'hint_used':
      step.hints += 1;
      break;
    case 'confidence_rating':
      step.confidence = Number(event.value);
      break;
    case 'step_skipped':
    case 'session_exit':
    case 'idle_timeout':
    case 'modality_switch':
      step.disengageSignals += 1;
      break;
    case 'time_on_step':
      step.time_on_step = Number(event.value);
      break;
    default:
      break;
  }
  step.updated_at = Date.now();
}

function recordClassification(sessionId, state) {
  const session = getSession(sessionId);
  const previous = session.lastState;
  session.lastState = state;
  if (previous && previous !== state) {
    store.metrics.flips += 1;
    if (previous === 'struggle' && state === 'success') {
      store.metrics.recoveries += 1;
    }
    if (previous === 'disengagement' && state === 'success') {
      store.metrics.disengageToSuccess += 1;
    }
  }
  store.metrics.stateCounts[state] += 1;
}

function getMetrics() {
  return { ...store.metrics };
}

export { getSession, recordEvent, recordClassification, getMetrics };
