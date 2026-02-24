import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateAccessToken, createRefreshToken, setRefreshCookie } from '@/lib/auth';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // basic rate limiting per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('host') || 'unknown';
    if (isRateLimited(`login:${ip}`, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts, try again later' }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.emailStatus !== 'VERIFIED') {
      return NextResponse.json(
        { error: 'Please verify your email first', needsVerification: true },
        { status: 403 }
      );
    }

    const token = generateAccessToken({ userId: user.id, email: user.email });

    // create a refresh token, store in DB, and send via httpOnly cookie
    const refreshToken = await createRefreshToken(user.id);
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        exp: user.exp,
        coins: user.coins,
        language: user.language,
        emailStatus: user.emailStatus,
        role: user.role,
      },
      token,
    });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
