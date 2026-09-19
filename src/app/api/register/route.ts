import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendRegistrationEmail, sendReferralNotificationEmail } from '@/lib/email';
import QRCode from 'qrcode';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (10 registrations per hour per IP)
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`reg_${ip}`, 10, 60 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait an hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const fullName = sanitizeString(body.fullName, 150);
    const email = body.email ? body.email.trim() : '';
    const phone = sanitizeString(body.phone, 30);
    const ticketType = sanitizeString(body.ticketType, 100);
    const referredByInput = sanitizeString(body.referredBy || body.referral, 50);

    if (!fullName || !email || !phone || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid full name, email, and phone number are required' }, { status: 400 });
    }

    const db = await getDb();

    // Check if email already registered
    const [existing] = await db.query<RowDataPacket[]>(
      `SELECT pass_code, referral_code, ticket_type, full_name FROM registrations WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error: 'This email address has already been registered for a pass. Each email can only register once.',
          existingPassCode: existing[0].pass_code,
        },
        { status: 400 }
      );
    }

    const type = ticketType || 'Standard Pass';
    
    // Generate unique Pass Code (e.g. LA2027-8F4A2)
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const passCode = `LA2027-${randomHex}`;
    
    // Generate unique Referral Code (e.g. REF-8F4A2)
    const referralCode = `REF-${randomHex}`;

    // Generate QR Code Data URL containing validation payload
    const qrPayload = JSON.stringify({
      event: 'Lateeful-Ul-Akbar 2027',
      passCode,
      name: fullName,
      type,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 2,
      color: {
        dark: '#0f766e',
        light: '#ffffff',
      },
    });

    // Store in MySQL database
    await db.query(
      `INSERT INTO registrations (full_name, email, phone, ticket_type, pass_code, referral_code, referred_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, type, passCode, referralCode, referredByInput || null]
    );

    // Send email pass notification (runs asynchronously)
    sendRegistrationEmail({
      to: email,
      name: fullName,
      ticketType: type,
      passCode,
      referralCode,
      qrCodeDataUrl,
    }).catch((err) => console.error('Background email sending error:', err));

    // Handle Referral Notification Email if referredByInput was provided
    if (referredByInput) {
      (async () => {
        try {
          // Find referrer details & total count
          const [referrerRows] = await db.query<RowDataPacket[]>(
            `SELECT full_name, email, referral_code, pass_code FROM registrations WHERE referral_code = ? OR pass_code = ? LIMIT 1`,
            [referredByInput, referredByInput]
          );

          if (referrerRows.length > 0) {
            const referrer = referrerRows[0];
            const [countRows] = await db.query<RowDataPacket[]>(
              `SELECT COUNT(*) as total FROM registrations WHERE referred_by = ? OR referred_by = ?`,
              [referrer.referral_code, referrer.pass_code]
            );
            const totalReferrals = countRows[0]?.total || 1;

            if (referrer.email && isValidEmail(referrer.email)) {
              await sendReferralNotificationEmail({
                to: referrer.email,
                referrerName: referrer.full_name,
                referredName: fullName,
                totalReferrals,
              });
            }
          }
        } catch (refErr) {
          console.error('Error handling referral email notification:', refErr);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      passCode,
      referralCode,
      qrCodeDataUrl,
      registration: {
        fullName,
        email,
        phone,
        ticketType: type,
        passCode,
        referralCode,
      },
    });
  } catch (error) {
    console.error('Error in registration API:', error);
    const details =
      error instanceof Error ? error.message : typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : 'Unknown error';
    return NextResponse.json({ error: 'Registration failed', details }, { status: 500 });
  }
}

