import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendRegistrationEmail } from '@/lib/email';
import QRCode from 'qrcode';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';

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

    if (!fullName || !email || !phone || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid full name, email, and phone number are required' }, { status: 400 });
    }

    const type = ticketType || 'Standard Pass';
    
    // Generate unique Pass Code (e.g. LA2027-8F4A2)
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const passCode = `LA2027-${randomHex}`;

    // Generate QR Code Data URL containing validation payload
    const qrPayload = JSON.stringify({
      event: 'Lateeful Akbar 2027',
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
    const db = await getDb();
    await db.query(
      `INSERT INTO registrations (full_name, email, phone, ticket_type, pass_code) VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, phone, type, passCode]
    );

    // Send email pass notification (runs asynchronously)
    sendRegistrationEmail({
      to: email,
      name: fullName,
      ticketType: type,
      passCode,
      qrCodeDataUrl,
    }).catch((err) => console.error('Background email sending error:', err));

    return NextResponse.json({
      success: true,
      passCode,
      qrCodeDataUrl,
      registration: {
        fullName,
        email,
        phone,
        ticketType: type,
        passCode,
      },
    });
  } catch (error) {
    console.error('Error in registration API:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
