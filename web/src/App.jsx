export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Adaptive Learning</p>
        <h1>Designing the next moment of learning.</h1>
        <p className="subhead">
          A lightweight React shell for the Adaptive Learning experience.
        </p>
        <div className="cta-row">
          <button className="primary">Start a session</button>
          <button className="ghost">View signals</button>
        </div>
      </header>
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
