import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyAdminToken, sanitizeString } from '@/lib/security';

// Log admin activity helper
export async function logAdminActivity(adminEmail: string, adminName: string, action: string, details: string) {
  try {
    const db = await getDb();
    await db.query(
      'INSERT INTO activity_logs (admin_email, admin_name, action, details) VALUES (?, ?, ?, ?)',
      [adminEmail, adminName, action, details]
    );
  } catch (e) {
    console.error('Failed to log admin activity:', e);
  }
}

// 1. Admin GET Data
export async function GET(req: Request) {
  // Authorization Guard
  if (!verifyAdminToken(req.headers.get('authorization'))) {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    const db = await getDb();

    if (type === 'attendees') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM registrations ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'referrals') {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT r1.full_name, r1.email, r1.referral_code, 
                COUNT(r2.id) as total_referrals
         FROM registrations r1
         LEFT JOIN registrations r2 ON r2.referred_by = r1.referral_code
         GROUP BY r1.id
         HAVING total_referrals > 0
         ORDER BY total_referrals DESC`
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'campaigns') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM sadaqah_campaigns ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'updates') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM event_updates ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'subscribers') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM newsletter_subscribers ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'logs') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'knowledge') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM ai_knowledge ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'settings') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM app_settings'
      );
      const settingsMap: Record<string, string> = {};
      rows.forEach((r) => {
        settingsMap[r.setting_key] = r.setting_value;
      });
      return NextResponse.json({ success: true, data: settingsMap });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// 2. Admin POST Actions
export async function POST(req: Request) {
  // Authorization Guard
  if (!verifyAdminToken(req.headers.get('authorization'))) {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = sanitizeString(body.action, 50);
    const adminEmail = sanitizeString(body.adminEmail, 100) || 'admin@lateefulakbar.com';
    const adminName = sanitizeString(body.adminName, 100) || 'Super Admin';
    const payload = body.payload || {};

    const db = await getDb();

    if (action === 'create_campaign') {
      const title = sanitizeString(payload.title, 255);
      const category = sanitizeString(payload.category, 100);
      const targetQty = Number(payload.targetQty) || 100;
      const unitPrice = Number(payload.unitPrice) || 0;
      const description = sanitizeString(payload.description, 2000);
      const imageUrl = sanitizeString(payload.imageUrl, 500);

      await db.query(
        'INSERT INTO sadaqah_campaigns (title, category, target_qty, unit_price, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [title, category, targetQty, unitPrice, description, imageUrl || '']
      );
      await logAdminActivity(adminEmail, adminName, 'Created Sadaqah Campaign', `Title: ${title}, Target: ${targetQty}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'create_update') {
      const title = sanitizeString(payload.title, 255);
      const content = sanitizeString(payload.content, 4000);
      const priority = sanitizeString(payload.priority, 50) || 'normal';

      await db.query(
        'INSERT INTO event_updates (title, content, priority) VALUES (?, ?, ?)',
        [title, content, priority]
      );
      await logAdminActivity(adminEmail, adminName, 'Posted Event Announcement', `Title: ${title}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'add_ai_knowledge') {
      const topic = sanitizeString(payload.topic, 255);
      const question = sanitizeString(payload.question, 500);
      const answer = sanitizeString(payload.answer, 4000);

      await db.query(
        'INSERT INTO ai_knowledge (topic, question, answer) VALUES (?, ?, ?)',
        [topic, question, answer]
      );
      await logAdminActivity(adminEmail, adminName, 'Added AI Knowledge Base Item', `Topic: ${topic}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_setting') {
      const key = sanitizeString(payload.key, 100);
      const value = sanitizeString(payload.value, 2000);

      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated System Setting', `Key: ${key}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_campaign') {
      const id = Number(payload.id);
      await db.query('DELETE FROM sadaqah_campaigns WHERE id = ?', [id]);
      await logAdminActivity(adminEmail, adminName, 'Deleted Sadaqah Campaign', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_campaign') {
      const id = Number(payload.id);
      const title = sanitizeString(payload.title, 255);
      const category = sanitizeString(payload.category, 100);
      const targetQty = Number(payload.targetQty) || 100;
      const currentQty = Number(payload.currentQty) || 0;
      const unitPrice = Number(payload.unitPrice) || 0;
      const description = sanitizeString(payload.description, 2000);
      const isActive = payload.is_active ? 1 : 0;

      await db.query(
        'UPDATE sadaqah_campaigns SET title = ?, category = ?, target_qty = ?, current_qty = ?, unit_price = ?, description = ?, is_active = ? WHERE id = ?',
        [title, category, targetQty, currentQty, unitPrice, description, isActive, id]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated Sadaqah Campaign', `ID: ${id}, Title: ${title}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_paystack_settings') {
      const mode = sanitizeString(payload.mode, 20);
      const publicKey = sanitizeString(payload.publicKey, 255);
      const secretKey = sanitizeString(payload.secretKey, 255);

      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        ['paystack_mode', mode, mode]
      );
      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        ['paystack_public_key', publicKey, publicKey]
      );
      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        ['paystack_secret_key', secretKey, secretKey]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated Paystack Payment Gateway Settings', `Mode: ${mode}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in admin POST action:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
