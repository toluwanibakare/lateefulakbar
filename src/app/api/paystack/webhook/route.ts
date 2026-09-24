import { NextResponse } from 'next/server';
import crypto from 'crypto';
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

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-paystack-signature');

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
      console.warn('Could not load app_settings table in webhook:', err);
    }

    const mode = (dbSettings['paystack_mode'] || process.env.PAYSTACK_MODE || 'test').trim();
    const secretKey = (
      mode === 'live'
        ? (dbSettings['paystack_live_secret_key'] || dbSettings['paystack_secret_key'] || getEnvKey('PAYSTACK_SECRET_KEY'))
        : (dbSettings['paystack_test_secret_key'] || dbSettings['paystack_secret_key'] || getEnvKey('PAYSTACK_SECRET_KEY'))
    ) || '';

    // Verify Paystack Signature if secret key is configured
    if (secretKey && signature) {
      const hash = crypto.createHmac('sha512', secretKey).update(bodyText).digest('hex');
      if (hash !== signature) {
        console.warn('Invalid Paystack webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(bodyText);

    if (event.event === 'charge.success') {
      const data = event.data;
      const amount = data.amount ? data.amount / 100 : 0;
      const email = data.customer?.email || '';
      const donorName = data.metadata?.donorName || data.customer?.first_name || 'Anonymous Donor';
      const category = data.metadata?.category || 'General Sadaqah';
      const txRef = data.reference;
      const currentMode = data.metadata?.mode || mode;

      if (amount > 0 && txRef) {
        // Insert or update donation record to completed
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

          // Send Receipt Email
          if (email) {
            const { sendDonationReceiptEmail } = await import('@/lib/email');
            sendDonationReceiptEmail({
              to: email,
              donorName,
              amount,
              category,
              txRef,
            }).catch((err) => console.error('Error sending webhook donation receipt email:', err));
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
