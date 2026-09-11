import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { sanitizeString, isValidEmail } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const db = await getDb();

    if (type === 'admin_users') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT id, name, email, role, permissions, created_at FROM admin_users ORDER BY id DESC'
      );
      const parsedUsers = rows.map((u) => {
        let perms = [];
        try {
          perms = JSON.parse(u.permissions || '[]');
        } catch (e) {
          perms = [];
        }
        return { ...u, permissions: perms };
      });
      return NextResponse.json({ success: true, users: parsedUsers });
    }

    if (type === 'blog') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM blog_stats ORDER BY slug ASC'
      );
      return NextResponse.json({ success: true, posts: rows });
    }

    if (type === 'gallery') {
      return NextResponse.json({
        success: true,
        items: [
          { id: 1, title: 'Main Bowl Dhikr Sitting', category: '2025 Event', url: '/assets/crowd-11.jpg' },
          { id: 2, title: 'Opening Du’a Gathering', category: '2024 Event', url: '/assets/crowd-2.jpg' },
          { id: 3, title: 'TBS Canopy Canopy Sections', category: 'Highlights', url: '/assets/tbs-canopy.jpg' },
        ],
      });
    }

    if (type === 'donations_list') {
      let [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM donations ORDER BY id DESC'
      );

      if (rows.length === 0) {
        try {
          await db.query(`
            INSERT INTO donations (donor_name, email, amount, category, tx_ref, status) VALUES
            ('Alhaji Ibrahim Danjuma', 'ibrahim.d@example.com', 250000, 'Nadwat TV Live Broadcast', 'TX-1001', 'completed'),
            ('Hajiya Fatima Bello', 'fatima.bello@example.com', 50000, 'Provide Cooling Fans', 'TX-1002', 'completed'),
            ('Anonymous Donor', 'anonymous@lateefulakbar.com', 15000, 'Prayer Mats & Rugs', 'TX-1003', 'completed'),
            ('Dr. Sulaimon Adebayo', 'sulaimon.ade@example.com', 100000, 'Water & Hydration Points', 'TX-1004', 'completed'),
            ('Khadijah Opeyemi', 'khadijah.op@example.com', 10000, 'General Sadaqah', 'TX-1005', 'completed')
          `);
          [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM donations ORDER BY id DESC'
          );
        } catch (e) {
          console.error('Error auto-seeding donations:', e);
        }
      }

      return NextResponse.json({ success: true, donations: rows });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in Admin Users API GET:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;
    const db = await getDb();

    if (action === 'create_admin_user') {
      const { name, email, password, role, permissions } = payload;
      const cleanName = sanitizeString(name, 100);
      const cleanEmail = sanitizeString(email, 100).toLowerCase();
      const cleanPassword = sanitizeString(password, 100);
      const cleanRole = sanitizeString(role, 50) || 'Content Admin';
      const permsJson = JSON.stringify(permissions || []);

      if (!cleanName || !cleanEmail || !cleanPassword || !isValidEmail(cleanEmail)) {
        return NextResponse.json({ success: false, error: 'Valid name, email, and password required' }, { status: 400 });
      }

      await db.query(
        'INSERT INTO admin_users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)',
        [cleanName, cleanEmail, cleanPassword, cleanRole, permsJson]
      );

      return NextResponse.json({ success: true });
    }

    if (action === 'change_password') {
      const { email, currentPassword, newPassword } = payload;
      const cleanEmail = sanitizeString(email, 100).toLowerCase();
      const cleanNewPassword = sanitizeString(newPassword, 100);

      if (!cleanEmail || !cleanNewPassword) {
        return NextResponse.json({ success: false, error: 'Invalid password details' }, { status: 400 });
      }

      // Check if it's dynamic admin user
      await db.query('UPDATE admin_users SET password = ? WHERE email = ?', [cleanNewPassword, cleanEmail]);
      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    if (action === 'delete_admin_user') {
      const { id } = payload;
      await db.query('DELETE FROM admin_users WHERE id = ?', [Number(id)]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in Admin Users API POST:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
