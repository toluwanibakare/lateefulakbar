import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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
      process.env.PAYSTACK_SECRET_KEY ||
      dbSettings['paystack_secret_key'] ||
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      dbSettings['paystack_public_key'] ||
      ''
    ).trim();

    const mode = dbSettings['paystack_mode'] || 'test';

    // If Paystack Key is configured (sk_ or pk_), make real call to Paystack API
    if (secretKey && (secretKey.startsWith('sk_') || secretKey.startsWith('pk_'))) {
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
