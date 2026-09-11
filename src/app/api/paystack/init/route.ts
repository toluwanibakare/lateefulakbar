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
    const [settings] = await db.query<RowDataPacket[]>(
      "SELECT setting_key, setting_value FROM app_settings WHERE setting_key LIKE 'paystack_%'"
    );

    const config: Record<string, string> = {};
    settings.forEach((r) => {
      config[r.setting_key] = r.setting_value;
    });

    const secretKey = config['paystack_secret_key'] || process.env.PAYSTACK_SECRET_KEY;
    const mode = config['paystack_mode'] || 'test';

    // If Paystack Secret Key is configured, make real call to Paystack API
    if (secretKey && secretKey.startsWith('sk_')) {
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
