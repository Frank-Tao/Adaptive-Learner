import { useSessionFlow } from '../hooks/useSessionFlow.js';

export default function BusinessApp() {
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
    <div className="app business">
      <header className="hero">
        <div className="hero-top fade-up">
          <div>
            <p className="eyebrow">Business suite</p>
            <h1>Adaptive learning, built for enterprise workflows.</h1>
            <p className="subhead">
              Unify internal and external knowledge into one guided moment with
              LMS, Jira, and Confluence signals in the loop.
            </p>
          </div>
          <div className="hero-actions">
            <button className="primary">Book a demo</button>
            <button className="ghost">Security & compliance</button>
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-metrics stagger">
            <div className="metric-card">
              <span>Avg. time to action</span>
              <strong>9 min</strong>
              <p>Role-aware moments built from your existing content.</p>
            </div>
            <div className="metric-card">
              <span>Adoption lift</span>
              <strong>2.3x</strong>
              <p>Respectful disengagement keeps trust high.</p>
            </div>
            <div className="metric-card">
              <span>Deployment</span>
              <strong>48 hrs</strong>
              <p>Connect LMS, SSO, SCIM, and internal wikis.</p>
            </div>
          </div>
          <div className="pilot-panel fade-up">
            <div className="panel-head">
              <h2>Pilot sandbox</h2>
              <p>Preview the exact moment a Change Manager sees.</p>
            </div>
            <div className="panel-body">
              {status && <p className="status-note">{status}</p>}
              {stage === 'start' && (
                <div className="session-start">
                  <div>
                    <h3>Session start</h3>
                    <p>What are you trying to do right now?</p>
                    <input
                      className="text-input"
                      placeholder="e.g. Use Jira AI for backlog refinement"
                      value={goal}
                      onChange={(event) => setGoal(event.target.value)}
                    />
                  </div>
                  <div className="system-context">
                    <p>System context (auto-synced)</p>
                    <div className="pill-row">
                      <span className="pill">Role: Change Manager</span>
                      <span className="pill">Tools: Jira + Confluence</span>
                      <span className="pill">LMS history: synced</span>
                    </div>
                  </div>
                  <div className="time-row">
                    <p>Time available</p>
                    <div className="choice-chips">
                      {['5 min', '10 min', '15+ min'].map((option) => (
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
                    <label htmlFor="confidence-business">Confidence (optional)</label>
                    <input
                      id="confidence-business"
                      type="range"
                      min="1"
                      max="5"
                      value={confidence}
                      onChange={(event) => setConfidence(Number(event.target.value))}
                    />
                  </div>
                  <button className="primary" onClick={startSession}>
                    Launch session
                  </button>
                </div>
              )}

              {stage === 'moment' && (
                <div className="moment-card">
                  <div className="moment-header">
                    <div>
                      <p className="moment-state">
                        {moment.state} • {moment.certainty} confidence
                      </p>
                      <h3>{moment.title}</h3>
                    </div>
                    <button className="ghost small">Explain logic</button>
                  </div>
                  <p className="moment-prompt">{moment.prompt}</p>
                  <div className="source-grid">
                    <div>
                      <p className="source-label">Sources</p>
                      <p className="source-text">Internal Jira micro-learning</p>
                    </div>
                    <div>
                      <p className="source-label">Context</p>
                      <p className="source-text">Confluence change playbook</p>
                    </div>
                    <div>
                      <p className="source-label">External</p>
                      <p className="source-text">2-minute Atlassian explainer</p>
                    </div>
                  </div>
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
                <div className="session-close">
                  <h3>Session close</h3>
                  <p>You can confidently explain Jira AI for backlog refinement.</p>
                  <div className="choice-chips">
                    <button className="chip" onClick={() => setStage('moment')}>
                      Next moment
                    </button>
                    <button className="chip">Schedule for later</button>
                  </div>
                  <div className="activity-feedback">
                    <h4>Was this learning activity useful for your role?</h4>
                    <div className="choice-chips">
                      {['Yes', 'Partially', 'Not really'].map((choice) => (
                        <button className="chip" key={choice}>
                          {choice}
                        </button>
                      ))}
                    </div>
                    <p className="helper-text">If needed, pick one reason.</p>
                    <div className="choice-chips">
                      {['Too detailed', 'Too abstract', 'Hard to apply'].map((choice) => (
                        <button className="chip" key={choice}>
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Signals by role</h2>
          <p>Compare adoption across change managers, PMs, and ops leads.</p>
        </div>
        <div className="card">
          <h2>Trust-preserving adaptivity</h2>
          <p>Separate struggle from disengagement to avoid false alarms.</p>
        </div>
        <div className="card">
          <h2>Content unification</h2>
          <p>Blend LMS, Confluence, and vendor docs into one moment.</p>
        </div>
      </section>

      <section className="split">
        <div>
          <h2>Designed for enablement leaders</h2>
          <p>
            Launch adaptive programs without rebuilding curriculum, then share
            role-based impact with stakeholders.
          </p>
          <div className="pill-row">
            <span className="pill">SSO + SCIM</span>
            <span className="pill">SOC 2 ready</span>
            <span className="pill">Custom exports</span>
          </div>
        </div>
        <div className="card">
          <h3>What teams get</h3>
          <ul>
            <li>Internal + external content unified in one flow.</li>
            <li>Automatic learner profiles built from signals, not surveys.</li>
            <li>Respectful exits that keep high-capacity learners engaged.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
