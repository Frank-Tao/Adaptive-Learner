import { useState } from 'react';
import { getNextMoment, postEvent } from '../api.js';

const mockMoment = {
  title: 'Explain a concept in your own words',
  prompt:
    'You just solved it. Try transferring that idea to a new situation you care about.',
  state: 'success',
  certainty: 'medium',
  explanation: 'State: success (medium) based on performance_stable.',
  choices: ['Apply to my work', 'Try another example', 'Save for later'],
  feedbackPrompt: 'Tap a quick signal to shape the next step.'
};

export function useSessionFlow() {
  const [stage, setStage] = useState('start');
  const [goal, setGoal] = useState('');
  const [timeChoice, setTimeChoice] = useState('5 min');
  const [confidence, setConfidence] = useState(3);
  const [sessionId, setSessionId] = useState('');
  const [moment, setMoment] = useState(mockMoment);
  const [status, setStatus] = useState('');

  const startSession = async () => {
    const newSessionId =
      typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setSessionId(newSessionId);
    setStatus('Starting session...');
    try {
      await postEvent({
        event_id: `${newSessionId}-start`,
        session_id: newSessionId,
        event_type: 'SESSION_START',
        timestamp: new Date().toISOString(),
        value: {
          goal,
          time_choice: timeChoice,
          confidence_pre: Number(confidence)
        }
      });
      const next = await getNextMoment({ session_id: newSessionId });
      setMoment({
        title: next.response?.title || mockMoment.title,
        prompt: next.response?.prompt || mockMoment.prompt,
        state: next.state || mockMoment.state,
        certainty: next.certainty || mockMoment.certainty,
        explanation: next.explanation || mockMoment.explanation,
        choices: next.response?.choice_labels || next.alternatives || mockMoment.choices,
        feedbackPrompt: mockMoment.feedbackPrompt
      });
      setStage('moment');
      setStatus('');
    } catch (error) {
      setMoment(mockMoment);
      setStage('moment');
      setStatus('Using offline moment data.');
    }
  };

  return {
    stage,
    goal,
    timeChoice,
    confidence,
    sessionId,
    moment,
    status,
    setStage,
    setGoal,
    setTimeChoice,
    setConfidence,
    startSession
  };
}
