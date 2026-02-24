import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Accept comma-separated list in env or allow '*' for any origin.
const ALLOWED = (process.env.ALLOWED_ORIGINS || '*').split(',').map(o => o.trim());

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const origin = req.headers.get('origin') || '';

  if (ALLOWED.includes('*') || ALLOWED.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin || '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    // Preflight request
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};
