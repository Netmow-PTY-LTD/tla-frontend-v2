import { spawn } from 'child_process';

export async function POST(req) {
  const body = await req.json();
  const step = body?.step;

  if (!step) {
    return new Response(JSON.stringify({ error: 'Missing step' }), {
      status: 400,
    });
  }

  const validSteps = [
    'run-all', // 👈
    'stop-backend',
    'pull-backend',
    'update-env-backend',
    'yarn-install-backend',
    'build-backend',
    'restart-backend',
    'stop-frontend',
    'pull-frontend',
    'update-env-frontend',
    'yarn-install-frontend',
    'npm-install-frontend',
    'build-frontend',
    'restart-frontend',
    'run-backend-all',
    'run-frontend-all',
  ];

  if (!validSteps.includes(step)) {
    return new Response(JSON.stringify({ error: 'Invalid step' }), {
      status: 400,
    });
  }

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const child = spawn('bash', [
          '/home/forge/scripts/deploy-step.sh',
          step,
        ]);

        child.stdout.on('data', (data) => {
          controller.enqueue(encoder.encode(`data: ${data.toString()}\n\n`));
        });

        child.stderr.on('data', (data) => {
          controller.enqueue(
            encoder.encode(`data: ERROR: ${data.toString()}\n\n`)
          );
        });

        child.on('close', () => {
          controller.close();
        });
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }
  );
}
