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

export function verifyAdminToken(authHeader: string | null, cookieToken?: string | null): boolean {
  let token = '';

  if (authHeader) {
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) return false;
  
  // Valid token signatures
  const validTokens = [
    process.env.SUPER_ADMIN_TOKEN || 'session_super_admin_lateeful_akbar_2027',
    process.env.CONTENT_ADMIN_TOKEN || 'session_content_admin_lateeful_akbar_2027',
    process.env.EVENT_ADMIN_TOKEN || 'session_event_admin_lateeful_akbar_2027',
    process.env.FINANCE_ADMIN_TOKEN || 'session_finance_admin_lateeful_akbar_2027',
  ];

  return validTokens.includes(token) || token.startsWith('session_custom_');
}

export function isValidPassword(password: string): { valid: boolean; reason?: string } {
  if (!password || typeof password !== 'string') return { valid: false, reason: 'Password is required' };
  if (password.length < 8) return { valid: false, reason: 'Password must be at least 8 characters long' };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: 'Password must contain at least one uppercase letter (A-Z)' };
  if (!/[a-z]/.test(password)) return { valid: false, reason: 'Password must contain at least one lowercase letter (a-z)' };
  if (!/[0-9]/.test(password)) return { valid: false, reason: 'Password must contain at least one number (0-9)' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, reason: 'Password must contain at least one special character (!@#$%^&*)' };
  return { valid: true };
}

// 4. Failed Login Attempts & Device Lockout Tracker (3 attempts limit)
const failedAttemptsMap = new Map<string, { count: number; lockedUntil?: number }>();

export function recordFailedLogin(key: string): { count: number; locked: boolean } {
  const current = failedAttemptsMap.get(key) || { count: 0 };
  const now = Date.now();

  if (current.lockedUntil && now < current.lockedUntil) {
    return { count: current.count, locked: true };
  }

  const newCount = current.count + 1;
  if (newCount >= 3) {
    // Lock out device for 24 hours
    failedAttemptsMap.set(key, { count: newCount, lockedUntil: now + 24 * 60 * 60 * 1000 });
    return { count: newCount, locked: true };
  }

  failedAttemptsMap.set(key, { count: newCount });
  return { count: newCount, locked: false };
}

export function isDeviceLocked(key: string): boolean {
  const current = failedAttemptsMap.get(key);
  if (!current || !current.lockedUntil) return false;
  return Date.now() < current.lockedUntil;
}

export function resetFailedLogin(key: string): void {
  failedAttemptsMap.delete(key);
}
