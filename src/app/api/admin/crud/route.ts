import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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

// 1. Attendees GET & POST & DELETE
export async function GET(req: Request) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, adminEmail = 'admin@lateefulakbar.com', adminName = 'Super Admin' } = body;
    const db = await getDb();

    if (action === 'create_campaign') {
      const { title, category, targetQty, unitPrice, description, imageUrl } = payload;
      await db.query(
        'INSERT INTO sadaqah_campaigns (title, category, target_qty, unit_price, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [title, category, targetQty, unitPrice, description, imageUrl || '']
      );
      await logAdminActivity(adminEmail, adminName, 'Created Sadaqah Campaign', `Title: ${title}, Target: ${targetQty}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'create_update') {
      const { title, content, priority } = payload;
      await db.query(
        'INSERT INTO event_updates (title, content, priority) VALUES (?, ?, ?)',
        [title, content, priority || 'normal']
      );
      await logAdminActivity(adminEmail, adminName, 'Posted Event Announcement', `Title: ${title}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'add_ai_knowledge') {
      const { topic, question, answer } = payload;
      await db.query(
        'INSERT INTO ai_knowledge (topic, question, answer) VALUES (?, ?, ?)',
        [topic, question, answer]
      );
      await logAdminActivity(adminEmail, adminName, 'Added AI Knowledge Base Item', `Topic: ${topic}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_setting') {
      const { key, value } = payload;
      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated System Setting', `Key: ${key}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in admin POST action:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
