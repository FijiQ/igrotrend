import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken, createRefreshToken, setRefreshCookie, clearRefreshCookie } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('refreshToken')?.value;
    if (!cookie) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    const stored = await verifyRefreshToken(cookie);
    if (!stored) {
      // maybe token expired or invalid
      const resFail = NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
      clearRefreshCookie(resFail);
      return resFail;
    }

    // find associated user
    const user = await db.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      const resFail = NextResponse.json({ error: 'User not found' }, { status: 401 });
      clearRefreshCookie(resFail);
      return resFail;
    }

    // rotate token: delete old and create new one
    await db.refreshToken.delete({ where: { id: stored.id } });
    const newRefresh = await createRefreshToken(user.id);

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const res = NextResponse.json({ token: accessToken });
    setRefreshCookie(res, newRefresh);
    return res;
  } catch (err) {
    console.error('Refresh error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
