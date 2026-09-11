import { NextResponse } from 'next/server';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';

const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Master@123';
const CONTENT_ADMIN_PASSWORD = process.env.CONTENT_ADMIN_PASSWORD || 'Content@123';
const EVENT_ADMIN_PASSWORD = process.env.EVENT_ADMIN_PASSWORD || 'Event@123';
const FINANCE_ADMIN_PASSWORD = process.env.FINANCE_ADMIN_PASSWORD || 'Finance@123';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (5 attempts per minute per IP or identifier)
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many failed login attempts. Please wait 1 minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = sanitizeString(body.email, 100).toLowerCase();
    const password = sanitizeString(body.password, 100);

    if (!email || !password || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    // Role 1: Master Super Admin
    if (email === 'admin@lateefulakbar.com' && password === SUPER_ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: 'admin@lateefulakbar.com',
          role: 'Super Admin',
        },
        token: process.env.SUPER_ADMIN_TOKEN || 'session_super_admin_lateeful_akbar_2027',
      });
    }

    // Role 2: Content Admin
    if (email === 'content@lateefulakbar.com' && password === CONTENT_ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Content Manager',
          email: 'content@lateefulakbar.com',
          role: 'Content Admin',
        },
        token: process.env.CONTENT_ADMIN_TOKEN || 'session_content_admin_lateeful_akbar_2027',
      });
    }

    // Role 3: Event Admin
    if (email === 'event@lateefulakbar.com' && password === EVENT_ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Event Coordinator',
          email: 'event@lateefulakbar.com',
          role: 'Event Admin',
        },
        token: process.env.EVENT_ADMIN_TOKEN || 'session_event_admin_lateeful_akbar_2027',
      });
    }

    // Role 4: Finance Admin
    if (email === 'finance@lateefulakbar.com' && password === FINANCE_ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Finance Controller',
          email: 'finance@lateefulakbar.com',
          role: 'Finance Admin',
        },
        token: process.env.FINANCE_ADMIN_TOKEN || 'session_finance_admin_lateeful_akbar_2027',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication processing error' },
      { status: 500 }
    );
  }
}
