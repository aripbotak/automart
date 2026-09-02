import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
