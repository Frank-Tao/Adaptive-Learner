export function evaluateIntervention({ state, certainty }) {
  if (certainty === 'low') {
    return {
      intervention_level: 'probe',
      rationale: 'low_certainty'
    };
  }

  if (state === 'struggle') {
    return {
      intervention_level: 'adjust',
      rationale: 'effort_high_progress_low'
    };
  }

  if (state === 'disengagement') {
    return {
      intervention_level: 'de_risk',
      rationale: 'disengagement_signals'
    };
  }

  return {
    intervention_level: 'reinforce',
    rationale: 'stable_progress'
  };
}
