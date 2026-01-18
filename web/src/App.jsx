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
          <button className="primary">Start a session</button>
          <button className="ghost">Review signals</button>
        </div>
      </header>

      <section className="experience">
        <div className="prompt-bar">
          <p>Adaptive note</p>
          <span>{mockMoment.explanation}</span>
        </div>

        <div className="moment-card">
          <div className="moment-header">
            <div>
              <p className="moment-state">
                {mockMoment.state} • {mockMoment.certainty} confidence
              </p>
              <h2>{mockMoment.title}</h2>
            </div>
            <button className="ghost small">Why this?</button>
          </div>
          <p className="moment-prompt">{mockMoment.prompt}</p>
          <div className="choice-chips">
            {mockMoment.choices.map((choice) => (
              <button className="chip" key={choice}>
                {choice}
              </button>
            ))}
          </div>
        </div>

        <div className="feedback-window">
          <div>
            <h3>Feedback window</h3>
            <p>{mockMoment.feedbackPrompt}</p>
          </div>
          <button className="primary small">Send feedback</button>
        </div>
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
