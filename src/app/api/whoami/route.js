import { NextResponse } from 'next/server';
import { getClientIp, getCountry } from '@/utils/ipUtils';

export const runtime = 'nodejs'; // ensure Node runtime
export const dynamic = 'force-dynamic'; // force API re-eval

export async function GET(request) {
  const ip = getClientIp(request.headers);
  const country = getCountry(request.headers);

  return NextResponse.json({ ip, country });
}
