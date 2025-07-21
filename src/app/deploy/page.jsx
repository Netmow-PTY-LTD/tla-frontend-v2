// 🔧 3. Create Frontend Page with Buttons for Each Step
// /app/deploy/page.js

'use client';

import { useState } from 'react';

const steps = [
  'stop-backend',
  'pull-backend',
  'build-backend',
  'restart-backend',
  'stop-frontend',
  'pull-frontend',
  'build-frontend',
  'restart-frontend',
];

export default function DeployStepPage() {
  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(null);

  const runStep = (step) => {
    setDeploying(step);
    setLogs([]);

    // BUT: EventSource does not support POST. So use fetch + stream workaround.
    fetch('/api/deploy-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step }),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.trim());
        setLogs((prev) => [...prev, ...lines]);
      }

      setDeploying(null);
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>⚙ Manual Deploy Steps</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => runStep(step)}
            disabled={deploying !== null}
            style={{
              padding: '8px 12px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: deploying ? 'not-allowed' : 'pointer',
            }}
          >
            {step}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        {logs.map((log, i) => (
          <div key={i}>
            {log.includes('ERROR') ? (
              <span style={{ color: 'red' }}>❌ {log}</span>
            ) : (
              <span>🔄 {log}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
