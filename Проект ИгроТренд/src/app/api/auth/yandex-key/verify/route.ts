import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, code, secret } = await request.json();
    if (!email || !code || !secret) {
      return NextResponse.json({ error: 'Email, code and secret required' }, { status: 400 });
    }
    const valid = authenticator.check(code, secret);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    // save secret and enable
    await db.user.update({
      where: { email },
      data: { yandexKeyEnabled: true, yandexKeySecret: secret },
    });
    return NextResponse.json({ message: 'Yandex Key enabled' });
  } catch (err) {
    console.error('Yandex Key verify error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
