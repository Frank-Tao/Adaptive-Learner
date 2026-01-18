export const config = {
  trendWindowSize: 3,
  thresholds: {
    maxSuccessAttempts: 2,
    maxSuccessHints: 1,
    minSuccessConfidence: 3,
    struggleAttempts: 2,
    struggleHints: 2,
    maxStruggleConfidence: 2,
    disengageSignalThreshold: 2,
    idleTimeoutSeconds: 120
  }
};
