import { NextRequest, NextResponse } from 'next/server';
import { getAdminToken, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getAdminToken(req);

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (decoded && decoded.role === 'admin') {
    return NextResponse.json({ authenticated: true, username: decoded.username });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
