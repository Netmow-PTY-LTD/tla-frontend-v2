// app/api/get-ip/route.js
import os from 'os';

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  let ip = req.socket?.remoteAddress || 'localhost';

  if (forwarded) {
    ip = forwarded.split(',')[0];
  }

  // Localhost handling
  if (ip === '127.0.0.1' || ip === '::1') {
    ip = getLocalNetworkIp() || 'localhost';
  }

  return ip;
}

function getLocalNetworkIp() {
  const networkInterfaces = os.networkInterfaces();
  for (let iface of Object.values(networkInterfaces)) {
    for (let net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

export async function GET(req) {
  const ip = getClientIp(req);
  return new Response(JSON.stringify({ ip }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
