import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';
import { sendDonationReceiptEmail } from '@/lib/email';

function getEnvKey(keyName: string): string {
  if (process.env[keyName]) return process.env[keyName]!;
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${keyName}=(.*)$`, 'm'));
      if (match) return match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (err) {
    // Ignore error
  }
  return '';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, donorName, category } = body;

    if (!amount || amount <= 0 || !email) {
      return NextResponse.json({ error: 'Valid amount and email are required' }, { status: 400 });
    }

    const db = await getDb();
    let dbSettings: Record<string, string> = {};
    try {
      const [settings] = await db.query<RowDataPacket[]>(
        "SELECT setting_key, setting_value FROM app_settings WHERE setting_key LIKE 'paystack_%'"
      );
      settings.forEach((r) => {
        dbSettings[r.setting_key] = r.setting_value;
      });
    } catch (err) {
      console.warn('Could not load app_settings table:', err);
    }

    const secretKey = (
      getEnvKey('PAYSTACK_SECRET_KEY') ||
      dbSettings['paystack_secret_key'] ||
      getEnvKey('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY') ||
      dbSettings['paystack_public_key'] ||
      'pk_test_2c7e896530c8018102ab4d741c95b997e534ba2e'
    ).trim();

    const mode = 'test';

    // If Paystack Key is configured (sk_ or pk_), make real call to Paystack API
    if (secretKey && (secretKey.startsWith('sk_') || secretKey.startsWith('pk_'))) {
      try {
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Kobo conversion
            email,
            metadata: {
              donorName: donorName || 'Anonymous',
              category: category || 'General Sadaqah',
              mode,
            },
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sadaqah?status=success`,
          }),
        });

        const data = await paystackRes.json();
        if (data.status && data.data?.authorization_url) {
          return NextResponse.json({
            success: true,
            authorizationUrl: data.data.authorization_url,
            reference: data.data.reference,
            mode,
          });
        }
      } catch (paystackFetchError) {
        console.warn('Paystack API network error, using local fallback:', paystackFetchError);
      }
    }

    // Fallback if keys are not set up: Simulate Instant Payment and log to DB
    const txRef = `SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await db.query(
      `INSERT INTO donations (donor_name, email, amount, category, tx_ref, status) VALUES (?, ?, ?, ?, ?, 'completed')`,
      [donorName || 'Anonymous', email, amount, category || 'General Sadaqah', txRef]
    );

    await db.query(
      `UPDATE sadaqah_campaigns SET current_qty = current_qty + 1 WHERE category = ? OR title = ?`,
      [category, category]
    );

    // Send Sadaqah Receipt Email
    sendDonationReceiptEmail({
      to: email,
      donorName: donorName || 'Noble Donor',
      amount,
      category: category || 'General Sadaqah',
      txRef,
    }).catch((err) => console.error('Error sending donation receipt email:', err));

    return NextResponse.json({
      success: true,
      simulated: true,
      message: 'Donation logged directly to database (Paystack test fallback)',
      txRef,
      mode,
    });
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    return NextResponse.json({ error: 'Failed to process payment request' }, { status: 500 });
  }
}

