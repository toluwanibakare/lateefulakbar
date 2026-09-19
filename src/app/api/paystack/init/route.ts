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

    const mode = (dbSettings['paystack_mode'] || process.env.PAYSTACK_MODE || 'test').trim();

    const secretKey = (
      mode === 'live'
        ? (dbSettings['paystack_live_secret_key'] || dbSettings['paystack_secret_key'] || getEnvKey('PAYSTACK_SECRET_KEY'))
        : (dbSettings['paystack_test_secret_key'] || dbSettings['paystack_secret_key'] || getEnvKey('PAYSTACK_SECRET_KEY'))
    ) || 'pk_test_2c7e896530c8018102ab4d741c95b997e534ba2e';

    const publicKey = (
      mode === 'live'
        ? (dbSettings['paystack_live_public_key'] || dbSettings['paystack_public_key'] || getEnvKey('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY'))
        : (dbSettings['paystack_test_public_key'] || dbSettings['paystack_public_key'] || getEnvKey('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY'))
    ) || 'pk_test_2c7e896530c8018102ab4d741c95b997e534ba2e';

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
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lateefulakbar.com'}/sadaqah?status=success`,
          }),
        });

        const data = await paystackRes.json();
        if (data.status && data.data?.authorization_url) {
          return NextResponse.json({
            success: true,
            authorizationUrl: data.data.authorization_url,
            reference: data.data.reference,
            publicKey,
            mode,
          });
        } else {
          console.warn('Paystack initialize error response:', data);
        }
      } catch (paystackFetchError) {
        console.warn('Paystack API network error:', paystackFetchError);
      }
    }

    return NextResponse.json({
      success: true,
      publicKey,
      mode,
    });
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    return NextResponse.json({ error: 'Failed to process payment request' }, { status: 500 });
  }
}

