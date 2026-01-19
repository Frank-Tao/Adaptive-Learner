import { useState } from 'react';
import { getNextMoment, postEvent } from './api.js';

const mockMoment = {
  title: 'Explain a concept in your own words',
  prompt:
    'You just solved it. Try transferring that idea to a new situation you care about.',
  state: 'success',
  certainty: 'medium',
  explanation: 'State: success (medium) based on performance_stable.',
  choices: ['Apply to my work', 'Try another example', 'Save for later'],
  feedbackPrompt:
    'Was this moment helpful? Share a quick note to keep improving the flow.'
};

export default function App() {
  const [stage, setStage] = useState('start');
  const [goal, setGoal] = useState('');
  const [timeChoice, setTimeChoice] = useState('5 min');
  const [confidence, setConfidence] = useState(3);
  const [sessionId, setSessionId] = useState('');
  const [moment, setMoment] = useState(mockMoment);
  const [status, setStatus] = useState('');

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Adaptive Learning</p>
        <h1>Designing the next moment of learning.</h1>
        <p className="subhead">
          A lightweight React shell for an adaptive learning experience that
          stays transparent, reversible, and respectful of attention.
        </p>
        <div className="cta-row">
          <button className="primary" onClick={() => setStage('start')}>
            New session
          </button>
          <button className="ghost">Review signals</button>
        </div>
      </header>

      <section className="experience">
        {status && <p className="status-note">{status}</p>}
        {stage === 'start' && (
          <div className="session-start">
            <div>
              <h2>Session start</h2>
              <p>What are you trying to do right now?</p>
              <input
                className="text-input"
                placeholder="Write a short goal"
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
              />
            </div>
            <div className="time-row">
              <p>Time available</p>
              <div className="choice-chips">
                {['2 min', '5 min', '10+ min'].map((option) => (
                  <button
                    className={`chip ${timeChoice === option ? 'active' : ''}`}
                    key={option}
                    onClick={() => setTimeChoice(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="confidence-row">
              <label htmlFor="confidence">Confidence (optional)</label>
              <input
                id="confidence"
                type="range"
                min="1"
                max="5"
                value={confidence}
                onChange={(event) => setConfidence(event.target.value)}
              />
            </div>
            <button
              className="primary"
              onClick={async () => {
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
                    choices:
                      next.response?.choice_labels ||
                      next.alternatives ||
                      mockMoment.choices,
                    feedbackPrompt: mockMoment.feedbackPrompt
                  });
                  setStage('moment');
                  setStatus('');
                } catch (error) {
                  setMoment(mockMoment);
                  setStage('moment');
                  setStatus('Using offline moment data.');
                }
              }}
            >
              Start
            </button>
          </div>
        )}

        {stage === 'moment' && (
          <>
            <div className="prompt-bar">
              <p>Adaptive note</p>
              <span>{moment.explanation}</span>
            </div>

            <div className="moment-card">
              <div className="moment-header">
                <div>
                  <p className="moment-state">
                    {moment.state} • {moment.certainty} confidence
                  </p>
                  <h2>{moment.title}</h2>
                </div>
                <button className="ghost small">Why this?</button>
              </div>
              <p className="moment-prompt">{moment.prompt}</p>
              <div className="choice-chips">
                {moment.choices.map((choice) => (
                  <button className="chip" key={choice}>
                    {choice}
                  </button>
                ))}
              </div>
              <div className="moment-actions">
                <button className="ghost small" onClick={() => setStage('feedback')}>
                  Continue
                </button>
                <button className="ghost small" onClick={() => setStage('close')}>
                  End session
                </button>
              </div>
            </div>
          </>
        )}

        {stage === 'feedback' && (
          <div className="feedback-window">
            <div>
              <h3>Feedback window</h3>
              <p>{moment.feedbackPrompt}</p>
              <div className="choice-chips">
                {['Clear', 'Okay', 'Confusing'].map((choice) => (
                  <button className="chip" key={choice}>
                    {choice}
                  </button>
                ))}
              </div>
            </div>
            <button className="primary small" onClick={() => setStage('moment')}>
              Continue
            </button>
          </div>
        )}

        {stage === 'close' && (
          <div className="session-close">
            <h2>Session close</h2>
            <p>You can now explain this concept in your own words.</p>
            <div className="choice-chips">
              <button className="chip" onClick={() => setStage('moment')}>
                Next moment
              </button>
              <button className="chip">Remind me later</button>
            </div>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="card">
          <h2>State Classifier</h2>
          <p>Bundle signals over 2-3 steps and output state with certainty.</p>
        </div>
        <div className="card">
          <h2>Moment Selector</h2>
          <p>Choose the next learning moment based on context and state.</p>
        </div>
        <div className="card">
          <h2>Response Renderer</h2>
          <p>Deliver clear, reversible choices that preserve learner agency.</p>
        </div>
      </section>
    </div>
  );
}
