import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      return NextResponse.json({ success: false, error: 'No transaction reference provided' }, { status: 400 });
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
    ) || '';

    if (!secretKey) {
      return NextResponse.json({ success: false, error: 'Paystack secret key not configured' }, { status: 400 });
    }

    // Verify transaction with Paystack API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await paystackRes.json();

    if (data.status && data.data?.status === 'success') {
      const txData = data.data;
      const amount = txData.amount ? txData.amount / 100 : 0;
      const email = txData.customer?.email || '';
      const donorName = txData.metadata?.donorName || txData.customer?.first_name || 'Anonymous Donor';
      const category = txData.metadata?.category || 'General Sadaqah';
      const txRef = txData.reference;
      const currentMode = txData.metadata?.mode || mode;

      if (amount > 0 && txRef) {
        // 1. Insert or update donation record to completed
        const [existing] = await db.query<RowDataPacket[]>(
          'SELECT id FROM donations WHERE tx_ref = ?',
          [txRef]
        );

        if (existing.length === 0) {
          await db.query(
            `INSERT INTO donations (donor_name, email, amount, category, tx_ref, mode, status) VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
            [donorName, email, amount, category, txRef, currentMode]
          );

          // Update current quantity on matching campaign
          await db.query(
            `UPDATE sadaqah_campaigns SET current_qty = current_qty + 1 WHERE category = ? OR title = ?`,
            [category, category]
          );

          // Update vendor payment_status to 'paid' if this was a vendor payment
          if (category.toLowerCase().includes('vendor')) {
            await db.query(
              `UPDATE vendors SET payment_status = 'paid' WHERE email = ? OR payment_ref = ?`,
              [email, txRef]
            );
          }

          // Send Receipt Email
          if (email) {
            const { sendDonationReceiptEmail } = await import('@/lib/email');
            sendDonationReceiptEmail({
              to: email,
              donorName,
              amount,
              category,
              txRef,
            }).catch((err) => console.error('Error sending verified donation receipt email:', err));
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          reference: txRef,
          amount,
          email,
          donorName,
          category,
          status: 'completed',
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: data.message || 'Transaction verification failed or not successful',
    }, { status: 400 });
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error);
    return NextResponse.json({ success: false, error: 'Server error verifying payment' }, { status: 500 });
  }
}
