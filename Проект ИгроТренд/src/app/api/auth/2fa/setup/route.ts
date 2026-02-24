import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { db } from '@/lib/db';

// GET will return a fresh secret and otpauth URL (not yet saved to user)
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, 'ИгроТренд', secret);
    const qr = await QRCode.toDataURL(otpauth);

    return NextResponse.json({ secret, otpauth, qr });
  } catch (err) {
    console.error('2FA setup error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
