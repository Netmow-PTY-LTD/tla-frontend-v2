'use client';

import { useState } from 'react';

const backendSteps = [
  'stop-backend',
  'pull-backend',
  'update-env-backend',
  'yarn-install-backend',
  'build-backend',
  'restart-backend',
];

const frontendSteps = [
  'stop-frontend',
  'pull-frontend',
  'update-env-frontend',
  'npm-install-frontend',
  'build-frontend',
  'restart-frontend',
];

const steps = [
  'run-all', // 👈 Add this
];

export default function DeployStepPage() {
  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(null);

  const runStep = (step) => {
    setDeploying(step);
    setLogs([]);

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
      <h1>⚙ Manual Deployment Panel</h1>

      <div
        style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 30 }}
      >
        {/* Backend Column */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2>🧩 Backend</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {backendSteps.map((step) => (
              <button
                key={step}
                onClick={() => runStep(step)}
                disabled={deploying !== null}
                style={{
                  padding: '10px',
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
        </div>

        {/* Frontend Column */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <h2>🎨 Frontend</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {frontendSteps.map((step) => (
              <button
                key={step}
                onClick={() => runStep(step)}
                disabled={deploying !== null}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
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
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 40,
        }}
      >
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => runStep(step)}
            disabled={deploying !== null}
            style={{
              padding: '8px 12px',
              backgroundColor: step === 'run-all' ? '#FF80ED' : '#0070f3',
              fontWeight: step === 'run-all' ? 'bold' : 'normal',
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

      {/* Logs Output */}
      <div
        style={{
          marginTop: 40,
          background: '#111',
          color: '#fff',
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h3>📜 Logs</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {logs.map((log, i) => (
            <div key={i}>
              {log.includes('ERROR') || log.includes('❌') ? (
                <span style={{ color: 'red' }}>❌ {log}</span>
              ) : (
                <span>🔄 {log}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
