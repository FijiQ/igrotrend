import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'igrotrend-secret-key-2026';
// How long the access token lives (short). Could use env variable like ACCESS_TOKEN_EXPIRES.
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';

// Refresh tokens expire after a number of days (see .env.example)
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30', 10);

export function generateAccessToken(payload: object) {
  return sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

export async function createRefreshToken(userId: string) {
  // random token stored hashed in DB
  const rawToken = crypto.randomBytes(64).toString('hex');
  const hashed = await bcrypt.hash(rawToken, 12);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await db.refreshToken.create({
    data: {
      token: hashed,
      userId,
      expiresAt,
    },
  });
  return rawToken;
}

export async function verifyRefreshToken(rawToken: string) {
  // lookup hashed token in DB by comparing
  const tokens = await db.refreshToken.findMany({
    where: { expiresAt: { gt: new Date() } },
  });
  for (const t of tokens) {
    const match = await bcrypt.compare(rawToken, t.token);
    if (match) {
      return t;
    }
  }
  return null;
}

export function setRefreshCookie(res: NextResponse, token: string) {
  res.cookies.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60,
  });
};

export function clearRefreshCookie(res: NextResponse) {
  res.cookies.set('refreshToken', '', { httpOnly: true, path: '/', maxAge: 0 });
}
