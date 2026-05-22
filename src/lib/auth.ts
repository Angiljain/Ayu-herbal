import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'ayuherbal_super_secure_secret_key_2026_prod';

export interface DecodedToken {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export function signToken(username: string): string {
  return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export function getAdminToken(req: NextRequest): string | null {
  // Check cookie first
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken) return cookieToken;

  // Check Authorization header fallback
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export function isAuthenticated(req: NextRequest): boolean {
  const token = getAdminToken(req);
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null && decoded.role === 'admin';
}

export function authResponseError() {
  return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
}
