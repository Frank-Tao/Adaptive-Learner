import { config } from './config.js';

function classifySession(session) {
  const windowSize = config.trendWindowSize;
  const steps = Array.from(session.steps.values())
    .sort((a, b) => b.updated_at - a.updated_at)
    .slice(0, windowSize);

  const signalSummary = summarizeSignals(steps);
  const { state, certainty, reasons } = computeState(signalSummary);

  return {
    state,
    certainty,
    reasons,
    summary: signalSummary
  };
}

function summarizeSignals(steps) {
  const summary = {
    stepsObserved: steps.length,
    attempts: 0,
    hints: 0,
    correctCount: 0,
    confidenceValues: [],
    timeValues: [],
    disengageSignals: 0
  };

  for (const step of steps) {
    summary.attempts += step.attempts;
    summary.hints += step.hints;
    summary.correctCount += step.correct ? 1 : 0;
    if (typeof step.confidence === 'number') {
      summary.confidenceValues.push(step.confidence);
    }
    if (typeof step.time_on_step === 'number') {
      summary.timeValues.push(step.time_on_step);
    }
    summary.disengageSignals += step.disengageSignals;
  }

  return summary;
}

function computeState(summary) {
  const reasons = [];
  const stepsObserved = summary.stepsObserved || 1;
  const avgAttempts = summary.attempts / stepsObserved;
  const avgHints = summary.hints / stepsObserved;
  const avgConfidence = average(summary.confidenceValues);
  const disengageSignals = summary.disengageSignals;

  const successSignals =
    avgAttempts <= config.thresholds.maxSuccessAttempts &&
    avgHints <= config.thresholds.maxSuccessHints &&
    (avgConfidence === null || avgConfidence >= config.thresholds.minSuccessConfidence);

  const struggleSignals =
    avgAttempts >= config.thresholds.struggleAttempts ||
    avgHints >= config.thresholds.struggleHints ||
    (avgConfidence !== null && avgConfidence <= config.thresholds.maxStruggleConfidence);

  if (disengageSignals >= config.thresholds.disengageSignalThreshold) {
    reasons.push('disengage_signals_high');
    return withCertainty('disengagement', certaintyFromEvidence(summary), reasons);
  }

  if (successSignals && !struggleSignals) {
    reasons.push('performance_stable');
    return withCertainty('success', certaintyFromEvidence(summary), reasons);
  }

  if (struggleSignals) {
    reasons.push('effort_high_progress_low');
    return withCertainty('struggle', certaintyFromEvidence(summary), reasons);
  }

  reasons.push('mixed_signals');
  return withCertainty('success', 'low', reasons);
}

function certaintyFromEvidence(summary) {
  const evidencePoints =
    summary.stepsObserved +
    summary.confidenceValues.length +
    summary.timeValues.length;

  if (evidencePoints >= 5) {
    return 'high';
  }
  if (evidencePoints >= 3) {
    return 'medium';
  }
  return 'low';
}

function average(values) {
  if (!values.length) {
    return null;
  }
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

function withCertainty(state, certainty, reasons) {
  return { state, certainty, reasons };
}

export { classifySession };
