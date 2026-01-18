function selectMoment({ state, summary }) {
  const base = {
    state,
    moment_type: 'next_step',
    prompt: '',
    alternatives: []
  };

  switch (state) {
    case 'success':
      return {
        ...base,
        moment_type: 'transfer_prompt',
        prompt: 'Nice work. Ready to apply this in a new context?',
        alternatives: ['Continue', 'Save for later', 'Exit']
      };
    case 'struggle':
      return {
        ...base,
        moment_type: 'diagnostic_adjust',
        prompt: 'Let us pause and try a smaller step. Which format helps?',
        alternatives: ['Simplify', 'Show example', 'Switch format']
      };
    case 'disengagement':
      return {
        ...base,
        moment_type: 'low_friction',
        prompt: 'Want a 60-second recap or to save this for later?',
        alternatives: ['Recap', 'Save for later', 'Exit']
      };
    default:
      return {
        ...base,
        moment_type: 'probe',
        prompt: 'Should we keep going or adjust the pace?',
        alternatives: ['Keep going', 'Slow down', 'Exit']
      };
  }
}

function buildExplanation({ state, certainty, reasons }) {
  const reasonText = reasons.length ? reasons.join(', ') : 'recent signals';
  return `State: ${state} (${certainty}) based on ${reasonText}.`;
}

export { selectMoment, buildExplanation };
