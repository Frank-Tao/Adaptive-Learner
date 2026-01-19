import { config } from './config.js';

export function aggregateSteps(steps, windowSize = config.trendWindowSize) {
  const recentSteps = [...steps]
    .sort((a, b) => b.updated_at - a.updated_at)
    .slice(0, windowSize);

  const summary = {
    stepsObserved: recentSteps.length,
    attempts: 0,
    hints: 0,
    correctCount: 0,
    confidenceValues: [],
    timeValues: [],
    disengageSignals: 0
  };

  for (const step of recentSteps) {
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
