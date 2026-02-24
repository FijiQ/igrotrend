import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    }
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
    }
    const valid = authenticator.check(code, user.twoFactorSecret);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    await db.user.update({
      where: { email },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    return NextResponse.json({ message: '2FA disabled' });
  } catch (err) {
    console.error('2FA disable error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
