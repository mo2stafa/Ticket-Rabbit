import './index.css';

function App() {
  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">TicketRabbit Project</p>
        <h1>Event Ticketing Platform</h1>
        <p className="lede">Starter React + Vite + TypeScript setup for Phase 0.</p>
        <div className="cta-row">
          <a className="button" href="/" onClick={(e) => e.preventDefault()}>
            View Roadmap
          </a>
          <a className="link" href="/" onClick={(e) => e.preventDefault()}>
            Backend Health Check →
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;