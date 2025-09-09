import { NextResponse } from 'next/server';
import { getClientIp, getCountry } from '@/utils/ipUtils';

export async function GET(request) {
  const ip = getClientIp(request.headers);
  const country = getCountry(request.headers);

  return NextResponse.json({ ip, country });
}
