import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { checkRateLimit, sanitizeString, isValidEmail, isDeviceLocked, recordFailedLogin, resetFailedLogin } from '@/lib/security';
import { sendAdminPasswordChangedEmail, getTransporter } from '@/lib/email';
import { logAdminActivity } from '@/app/api/admin/crud/route';

const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Master@123';
const CONTENT_ADMIN_PASSWORD = process.env.CONTENT_ADMIN_PASSWORD || 'Content@123';
const EVENT_ADMIN_PASSWORD = process.env.EVENT_ADMIN_PASSWORD || 'Event@123';
const FINANCE_ADMIN_PASSWORD = process.env.FINANCE_ADMIN_PASSWORD || 'Finance@123';

async function sendFailedLoginAlert(adminEmail: string, ip: string, attempts: number) {
  try {
    const transporter = await getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: '"Lateeful-Ul-Akbar Security" <lateefulakbar@gmail.com>',
        to: adminEmail || 'lateefulakbar@gmail.com',
        subject: `[SECURITY LOCKOUT ALERT] 3 Failed Admin Login Attempts`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #991b1b;">Security Lockout Alert</h2>
            <p>Attention Admin,</p>
            <p>An unauthorized login attempt was blocked after <strong>3 failed attempts</strong> on account <strong>${adminEmail}</strong>.</p>
            <p><strong>Device IP:</strong> ${ip}</p>
            <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
            <p style="color: #ef4444; font-weight: bold;">This device has been locked out from attempting to log in again.</p>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error('Error sending failed login security email:', err);
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const body = await req.json();
    const email = sanitizeString(body.email, 100).toLowerCase();
    const password = sanitizeString(body.password, 100);

    const lockoutKey = `lockout_${email}_${ip}`;
    if (isDeviceLocked(lockoutKey)) {
      return NextResponse.json(
        { success: false, error: 'Device locked. 3 failed login attempts exceeded. Access blocked on this device.' },
        { status: 403 }
      );
    }

    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait 1 minute.' },
        { status: 429 }
      );
    }

    if (!email || !password || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if password has been changed via app_settings
    const settingKey = `admin_pass_${email}`;
    const [overrideRows] = await db.query<RowDataPacket[]>(
      'SELECT setting_value FROM app_settings WHERE setting_key = ?',
      [settingKey]
    );
    const customPassword = overrideRows.length > 0 ? overrideRows[0].setting_value : null;

    // Master Super Admin
    if (email === 'admin@lateefulakbar.com' && (password === (customPassword || SUPER_ADMIN_PASSWORD))) {
      resetFailedLogin(lockoutKey);
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'User Login', 'Authenticated as Super Admin');
      const token = process.env.SUPER_ADMIN_TOKEN || 'session_super_admin_lateeful_akbar_2027';
      const response = NextResponse.json({
        success: true,
        user: {
          name: 'Super Admin',
          email: 'admin@lateefulakbar.com',
          role: 'Super Admin',
          permissions: ['dashboard', 'messages', 'live_event', 'updates', 'attendees', 'referrals', 'newsletter', 'blog', 'sadaqah', 'donations', 'ai_assistant', 'settings', 'admin_users', 'activity_log'],
        },
        token,
      });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }

    // Preset Role Accounts
    if (email === 'content@lateefulakbar.com' && (password === (customPassword || CONTENT_ADMIN_PASSWORD))) {
      resetFailedLogin(lockoutKey);
      await logAdminActivity('content@lateefulakbar.com', 'Content Manager', 'User Login', 'Authenticated as Content Admin');
      return NextResponse.json({
        success: true,
        user: {
          name: 'Content Manager',
          email: 'content@lateefulakbar.com',
          role: 'Content Admin',
          permissions: ['dashboard', 'newsletter', 'blog'],
        },
        token: process.env.CONTENT_ADMIN_TOKEN || 'session_content_admin_lateeful_akbar_2027',
      });
    }

    if (email === 'event@lateefulakbar.com' && (password === (customPassword || EVENT_ADMIN_PASSWORD))) {
      resetFailedLogin(lockoutKey);
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

    if (email === 'finance@lateefulakbar.com' && (password === (customPassword || FINANCE_ADMIN_PASSWORD))) {
      resetFailedLogin(lockoutKey);
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
    const effectivePass = customPassword || password;
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM admin_users WHERE email = ? AND password = ?`,
      [email, effectivePass]
    );

    if (rows.length > 0) {
      resetFailedLogin(lockoutKey);
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

    // Record Failed Attempt
    const failRecord = recordFailedLogin(lockoutKey);
    if (failRecord.locked) {
      await sendFailedLoginAlert(email, ip, failRecord.count);
      return NextResponse.json(
        { success: false, error: 'Device locked! 3 failed login attempts reached. Security notification sent to admin.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Invalid email or password. (${3 - failRecord.count} attempts remaining before lockout)` },
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
