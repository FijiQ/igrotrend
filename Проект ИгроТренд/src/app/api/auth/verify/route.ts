import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'igrotrend-secret-key-2026';

export async function POST(request: NextRequest) {
  try {
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

    // Generate token
    const token = sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
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
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
