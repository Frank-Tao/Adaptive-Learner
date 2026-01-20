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
            <h1>Adaptive learning, built for teams.</h1>
            <p className="subhead">
              Orchestrate skill growth across roles with shared signals,
              transparent logic, and measurable learning outcomes.
            </p>
          </div>
          <div className="hero-actions">
            <button className="primary">Book a demo</button>
            <button className="ghost">View security</button>
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-metrics stagger">
            <div className="metric-card">
              <span>Avg. time to insight</span>
              <strong>8.4 min</strong>
              <p>Auto-generated learning moments for busy teams.</p>
            </div>
            <div className="metric-card">
              <span>Engagement lift</span>
              <strong>2.1x</strong>
              <p>Adaptive pacing keeps programs lightweight.</p>
            </div>
            <div className="metric-card">
              <span>Deployment</span>
              <strong>48 hrs</strong>
              <p>Connect LMS, HRIS, or custom event streams.</p>
            </div>
          </div>
          <div className="pilot-panel fade-up">
            <div className="panel-head">
              <h2>Pilot sandbox</h2>
              <p>Share this flow with a cohort in minutes.</p>
            </div>
            <div className="panel-body">
              {status && <p className="status-note">{status}</p>}
              {stage === 'start' && (
                <div className="session-start">
                  <div>
                    <h3>Session start</h3>
                    <p>What should this cohort practice today?</p>
                    <input
                      className="text-input"
                      placeholder="e.g. Quarterly planning, onboarding"
                      value={goal}
                      onChange={(event) => setGoal(event.target.value)}
                    />
                  </div>
                  <div className="time-row">
                    <p>Session length</p>
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
                    <label htmlFor="confidence-business">Baseline confidence</label>
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
                  <h3>Session close</h3>
                  <p>Capture a quick takeaway for the team pulse.</p>
                  <div className="choice-chips">
                    <button className="chip" onClick={() => setStage('moment')}>
                      Next moment
                    </button>
                    <button className="chip">Archive feedback</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h2>Signals by cohort</h2>
          <p>Track momentum across teams, locations, and learning tracks.</p>
        </div>
        <div className="card">
          <h2>Transparent logic</h2>
          <p>Explain every recommendation with human-readable reasoning.</p>
        </div>
        <div className="card">
          <h2>Integrations ready</h2>
          <p>Send events from LMS, Slack, or your internal workflow tools.</p>
        </div>
      </section>

      <section className="split">
        <div>
          <h2>Designed for enablement leaders</h2>
          <p>
            Launch adaptive programs with predictable timelines, then share
            concrete progress with stakeholders.
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
            <li>Adaptive learning moments tailored to role context.</li>
            <li>Clear signals on retention, confidence, and readiness.</li>
            <li>Evidence-led coaching that respects time budgets.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
