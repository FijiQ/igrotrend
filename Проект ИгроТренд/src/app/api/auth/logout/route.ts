import { NextRequest, NextResponse } from 'next/server';
import { clearRefreshCookie } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('refreshToken')?.value;
    if (cookie) {
      // attempt to find and delete
      // we can't compare hashed tokens easily, so search all and compare
      const tokens = await db.refreshToken.findMany({});
      for (const t of tokens) {
        // bcrypt may be heavy; but okay assuming small number
        // we'll import bcrypt here inline
        // to avoid circular imports, require
        const bcrypt = (await import('bcryptjs')).default;
        const match = await bcrypt.compare(cookie, t.token);
        if (match) {
          await db.refreshToken.delete({ where: { id: t.id } });
          break;
        }
      }
    }
    const res = NextResponse.json({ message: 'Logged out' });
    clearRefreshCookie(res);
    return res;
  } catch (err) {
    console.error('Logout error', err);
    const res = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    clearRefreshCookie(res);
    return res;
  }
}
