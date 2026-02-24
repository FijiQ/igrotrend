import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAccessToken, createRefreshToken, setRefreshCookie } from '@/lib/auth';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('host') ||
      'unknown';
    if (isRateLimited(`verify:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many attempts, try again later' },
        { status: 429 }
      );
    }

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find verification code
    const verificationCode = await db.verificationCode.findFirst({
      where: {
        email,
        code,
        type: 'register',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Update user status
    const user = await db.user.update({
      where: { email },
      data: { 
        emailStatus: 'VERIFIED',
        verifyToken: null,
      },
    });

    // Delete used verification code
    await db.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
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
      token: accessToken,
    });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
