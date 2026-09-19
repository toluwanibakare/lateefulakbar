import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import QRCode from 'qrcode';
import { sanitizeString } from '@/lib/security';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = sanitizeString(searchParams.get('code') || '', 50);
    const email = sanitizeString(searchParams.get('email') || '', 150);

    if (!code && !email) {
      return NextResponse.json({ error: 'Pass code or email is required' }, { status: 400 });
    }

    const db = await getDb();
    let rows: RowDataPacket[] = [];

    if (code) {
      [rows] = await db.query<RowDataPacket[]>(
        `SELECT full_name, email, phone, ticket_type, pass_code, referral_code FROM registrations WHERE pass_code = ? OR referral_code = ? LIMIT 1`,
        [code, code]
      );
    } else if (email) {
      [rows] = await db.query<RowDataPacket[]>(
        `SELECT full_name, email, phone, ticket_type, pass_code, referral_code FROM registrations WHERE LOWER(email) = LOWER(?) LIMIT 1`,
        [email]
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    const reg = rows[0];
    const passCode = reg.pass_code;
    const fullName = reg.full_name;
    const ticketType = reg.ticket_type;
    const referralCode = reg.referral_code;

    const qrPayload = JSON.stringify({
      event: 'Lateeful-Ul-Akbar 2027',
      passCode,
      name: fullName,
      type: ticketType,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      margin: 2,
      color: {
        dark: '#0f766e',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      success: true,
      passCode,
      referralCode,
      qrCodeDataUrl,
      registration: {
        fullName,
        email: reg.email,
        phone: reg.phone,
        ticketType,
        passCode,
        referralCode,
      },
    });
  } catch (error) {
    console.error('Error fetching pass:', error);
    return NextResponse.json({ error: 'Failed to fetch pass' }, { status: 500 });
  }
}
