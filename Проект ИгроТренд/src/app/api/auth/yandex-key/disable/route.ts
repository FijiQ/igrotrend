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
if (!user || !user.yandexKeyEnabled || !user.yandexKeySecret) {
      return NextResponse.json({ error: 'Yandex Key not enabled' }, { status: 400 });
    }
    const valid = authenticator.check(code, user.yandexKeySecret);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid Yandex Key code' }, { status: 400 });
    }
    await db.user.update({
      where: { email },
      data: { yandexKeyEnabled: false, yandexKeySecret: null },
    });
    return NextResponse.json({ message: 'Yandex Key disabled' });
  } catch (err) {
    console.error('Yandex Key disable error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
