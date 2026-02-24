import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

function generateVerificationCode(): string {
  return String(randomInt(100000, 999999));
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, displayName } = await request.json();

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username: username.toLowerCase(),
        displayName: displayName || username,
        language: 'RU',
        emailStatus: 'PENDING',
        level: 1,
        exp: 0,
        coins: 100, // Welcome bonus 2026
      },
    });

    // Create verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.verificationCode.create({
      data: {
        email,
        code,
        type: 'register',
        expiresAt,
      },
    });

    // In a real app, send email here
    console.log(`Verification code for ${email}: ${code}`);

    return NextResponse.json({
      message: 'Registration successful. Please verify your email.',
      email,
      // For demo purposes, return the code (remove in production)
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
