import { aggregateSteps } from './aggregator.js';
import { config } from './config.js';

function classifySession(session) {
  const steps = Array.from(session.steps.values());
  const signalSummary = aggregateSteps(steps);
  const { state, certainty, reasons } = computeState(signalSummary);

  return {
    state,
    certainty,
    reasons,
    summary: signalSummary
  };
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
