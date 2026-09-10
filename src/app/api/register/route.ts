import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendRegistrationEmail } from '@/lib/email';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, ticketType } = await req.json();

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: 'Full name, email, and phone are required' }, { status: 400 });
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
