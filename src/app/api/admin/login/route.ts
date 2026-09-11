import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';
import { logAdminActivity } from '@/app/api/admin/crud/route';

const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Master@123';
const CONTENT_ADMIN_PASSWORD = process.env.CONTENT_ADMIN_PASSWORD || 'Content@123';
const EVENT_ADMIN_PASSWORD = process.env.EVENT_ADMIN_PASSWORD || 'Event@123';
const FINANCE_ADMIN_PASSWORD = process.env.FINANCE_ADMIN_PASSWORD || 'Finance@123';

export async function POST(req: Request) {
  try {
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

    // Master Super Admin
    if (email === 'admin@lateefulakbar.com' && password === SUPER_ADMIN_PASSWORD) {
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'User Login', 'Authenticated as Super Admin');
      return NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: 'admin@lateefulakbar.com',
          role: 'Super Admin',
          permissions: ['dashboard', 'messages', 'live_event', 'updates', 'attendees', 'referrals', 'newsletter', 'blog', 'gallery', 'sadaqah', 'donations', 'ai_assistant', 'settings', 'admin_users', 'activity_log'],
        },
        token: process.env.SUPER_ADMIN_TOKEN || 'session_super_admin_lateeful_akbar_2027',
      });
    }

    // Preset Role Accounts
    if (email === 'content@lateefulakbar.com' && password === CONTENT_ADMIN_PASSWORD) {
      await logAdminActivity('content@lateefulakbar.com', 'Content Manager', 'User Login', 'Authenticated as Content Admin');
      return NextResponse.json({
        success: true,
        user: {
          name: 'Content Manager',
          email: 'content@lateefulakbar.com',
          role: 'Content Admin',
          permissions: ['dashboard', 'newsletter', 'blog', 'gallery'],
        },
        token: process.env.CONTENT_ADMIN_TOKEN || 'session_content_admin_lateeful_akbar_2027',
      });
    }

    if (email === 'event@lateefulakbar.com' && password === EVENT_ADMIN_PASSWORD) {
      await logAdminActivity('event@lateefulakbar.com', 'Event Coordinator', 'User Login', 'Authenticated as Event Admin');
      return NextResponse.json({
        success: true,
        user: {
          name: 'Event Coordinator',
          email: 'event@lateefulakbar.com',
          role: 'Event Admin',
          permissions: ['dashboard', 'live_event', 'updates', 'attendees', 'referrals'],
        },
        token: process.env.EVENT_ADMIN_TOKEN || 'session_event_admin_lateeful_akbar_2027',
      });
    }

    if (email === 'finance@lateefulakbar.com' && password === FINANCE_ADMIN_PASSWORD) {
      await logAdminActivity('finance@lateefulakbar.com', 'Finance Controller', 'User Login', 'Authenticated as Finance Admin');
      return NextResponse.json({
        success: true,
        user: {
          name: 'Finance Controller',
          email: 'finance@lateefulakbar.com',
          role: 'Finance Admin',
          permissions: ['dashboard', 'sadaqah', 'donations'],
        },
        token: process.env.FINANCE_ADMIN_TOKEN || 'session_finance_admin_lateeful_akbar_2027',
      });
    }

    // Dynamic MySQL Admin Users Query
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM admin_users WHERE email = ? AND password = ?`,
      [email, password]
    );

    if (rows.length > 0) {
      const u = rows[0];
      let perms: string[] = [];
      try {
        perms = JSON.parse(u.permissions || '[]');
      } catch (e) {
        perms = ['dashboard'];
      }

      await logAdminActivity(u.email, u.name, 'User Login', `Authenticated as ${u.role}`);

      return NextResponse.json({
        success: true,
        user: {
          name: u.name,
          email: u.email,
          role: u.role,
          permissions: perms,
        },
        token: `session_custom_${u.id}_2027`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication processing error' },
      { status: 500 }
    );
  }
}
