"use client";
import { PipelineToolbar } from './PipelineToolbar';
import { PipelineUI } from './PipelineUI';
import { SubmitButton } from './SubmitButton';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <div className="app-brand__mark" aria-hidden="true">AI</div>
          <div>
            <div className="app-kicker">Workflow Builder</div>
            <h1>AI Pipeline Builder &gt; My Pipeline</h1>
          </div>
        </div>
        <div className="app-status">Draft</div>
      </header>

      <main className="builder-layout">
        <PipelineToolbar />
        <section className="canvas-panel" aria-label="Workflow canvas">
          <PipelineUI />
          <SubmitButton />
        </section>
      </main>
    </div>
  );
}

export default App;
