export function composeResponse({ moment, explanation }) {
  const titleMap = {
    transfer_prompt: 'Try a transfer',
    diagnostic_adjust: 'Let us adjust one step',
    low_friction: 'Quick option for now',
    probe: 'Quick check-in',
    next_step: 'Next step'
  };

  return {
    title: titleMap[moment.moment_type] || 'Next step',
    prompt: moment.prompt,
    choice_labels: moment.alternatives,
    explanation
  };
}
