import { useSessionFlow } from '../hooks/useSessionFlow.js';

export default function ConsumerApp() {
  const {
    stage,
    goal,
    timeChoice,
    confidence,
    moment,
    status,
    setStage,
    setGoal,
    setTimeChoice,
    setConfidence,
    startSession
  } = useSessionFlow();

  return (
    <div className="app consumer">
      <header className="hero">
        <div className="hero-grid">
          <div className="hero-copy fade-up">
            <p className="eyebrow">For learners</p>
            <h1>Practice the skill you need right now.</h1>
            <p className="subhead">
              Five-minute, adaptive learning moments for real life. No courses,
              no streak pressure, just the next useful step.
            </p>
            <div className="cta-row">
              <button className="primary" onClick={() => setStage('start')}>
                Start a 5-minute session
              </button>
              <button className="ghost">See the flow</button>
            </div>
            <div className="hero-highlights stagger">
              <div className="highlight-card">
                <h3>5-minute focus</h3>
                <p>Short bursts that fit after dinner or between meetings.</p>
              </div>
              <div className="highlight-card">
                <h3>Respectful recovery</h3>
                <p>Struggling or distracted? Get a simpler step or a recap.</p>
              </div>
              <div className="highlight-card">
                <h3>No profiles to fill out</h3>
                <p>Personalization comes from how you learn, not surveys.</p>
              </div>
            </div>
          </div>
          <div className="hero-panel fade-up">
            <div className="panel-note">
              <span>Tonight</span>
              <p>Preview a real-world practice moment.</p>
            </div>
            <div className="panel-card">
              <h2>Price objection drill</h2>
              <p>
                Try a 3-step response the next time a client pushes back on price.
              </p>
              <button className="ghost small">Try another</button>
            </div>
          </div>
        </div>
      </header>

      <section className="experience">
        {status && <p className="status-note">{status}</p>}
        {stage === 'start' && (
          <div className="session-start card">
            <div>
              <h2>Session start</h2>
              <p>What are you trying to do right now?</p>
              <input
                className="text-input"
                placeholder="e.g. Handle price objections"
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
                onChange={(event) => setConfidence(Number(event.target.value))}
              />
            </div>
            <button className="primary" onClick={startSession}>
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
              <h3>How did that feel?</h3>
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
          <div className="session-close card">
            <h2>Session close</h2>
            <p>You can now respond to price objections with a clear 3-step structure.</p>
            <div className="choice-chips">
              <button className="chip" onClick={() => setStage('moment')}>
                Next moment
              </button>
              <button className="chip">Remind me later</button>
            </div>
            <div className="activity-feedback">
              <h3>Help improve this practice?</h3>
              <div className="choice-chips">
                {['Worked well', 'Could be better', "Didn't help"].map((choice) => (
                  <button className="chip" key={choice}>
                    {choice}
                  </button>
                ))}
              </div>
              <p className="helper-text">If needed, pick one reason.</p>
              <div className="choice-chips">
                {['Too basic', 'Too long', 'Not realistic enough'].map((choice) => (
                  <button className="chip" key={choice}>
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="grid">
        <div className="card">
          <h2>Real-life readiness</h2>
          <p>Build capability with moments you can use the same day.</p>
        </div>
        <div className="card">
          <h2>Adaptive without pressure</h2>
          <p>Clear, okay, or confusing stays in the flow without a quiz.</p>
        </div>
        <div className="card">
          <h2>Save and return</h2>
          <p>Exit gracefully with a short recap when life gets busy.</p>
        </div>
      </section>
    </div>
  );
}
