import { NextResponse } from 'next/server';

// 1. Simple In-Memory Rate Limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

// 2. Secret & Auth Helpers
const ADMIN_SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'lateeful_akbar_secure_secret_key_2027_v1';

export function verifyAdminToken(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  // Valid token signatures
  const validTokens = [
    process.env.SUPER_ADMIN_TOKEN || 'session_super_admin_lateeful_akbar_2027',
    process.env.CONTENT_ADMIN_TOKEN || 'session_content_admin_lateeful_akbar_2027',
    process.env.EVENT_ADMIN_TOKEN || 'session_event_admin_lateeful_akbar_2027',
    process.env.FINANCE_ADMIN_TOKEN || 'session_finance_admin_lateeful_akbar_2027',
  ];

  return validTokens.includes(token);
}

// 3. Input Validation & Sanitization Helpers
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Escaping dangerous HTML tags
}
