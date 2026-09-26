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

    if (type === 'vendors') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM vendors ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'media') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM media_accreditations ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'referrals') {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT r1.full_name, r1.email, r1.referral_code, r1.pass_code,
                COUNT(r2.id) as total_referrals
         FROM registrations r1
         LEFT JOIN registrations r2 ON (r2.referred_by = r1.referral_code OR r2.referred_by = r1.pass_code)
         GROUP BY r1.id
         HAVING total_referrals > 0
         ORDER BY total_referrals DESC`
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (type === 'campaigns') {
      let [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM sadaqah_campaigns ORDER BY id DESC'
      );
      if (rows.length === 0) {
        try {
          await db.query(`
            INSERT INTO sadaqah_campaigns (title, category, target_qty, current_qty, unit_price, description, image_url, is_active) VALUES
            ('TBS Venue Rental', 'Venue', 0, 0, 22500000.00, 'Main bowl rental and facility access for Tafawa Balewa Square.', '/assets/crowd-12.jpg', 1),
            ('6 Marquee Tents (25m x 100m)', 'tents', 6, 0, 4000000.00, 'Large shaded marquee tents (25m x 100m) for assembly rows.', '/assets/donation-tents.jpg', 1),
            ('40 Digital LED Screens', 'media', 40, 0, 250000.00, 'High-definition digital LED display screens around the bowl.', '/assets/donation-media.jpg', 1),
            ('Stage Setup & Infrastructure', 'Stage', 0, 0, 7500000.00, 'Main elevated stage, podium, backdrop, and structure.', '/assets/crowd-11.jpg', 1),
            ('2,000 Cartons Nestlé Water (60cl)', 'water', 2000, 0, 3600.00, 'Nestlé bottled water cartons (60cl) served to worshippers.', '/assets/donation-water.jpg', 1),
            ('Professional Sound System', 'Sound', 0, 0, 6000000.00, 'High-grade arena audio speakers, amplifiers and mics.', '/assets/crowd-08.jpg', 1),
            ('Generators, Fuel (Diesel/PMS) & Security', 'Power & Security', 0, 0, 5000000.00, 'Heavy-duty power generators, fuel supply, and site security.', '/assets/drone-wide.png', 1),
            ('Cooling (Regular & Mist Fans)', 'cooling', 1000, 0, 3000.00, 'Industrial standing fans and mist cooling fans across rows.', '/assets/donation-cooling.jpg', 1),
            ('Internet & Media Production Equipment', 'Media & Tech', 0, 0, 2900000.00, 'Dedicated high-speed internet, livestream encoders, and cameras.', '/assets/donation-internet.jpg', 1),
            ('Digital Advertising & Publicity', 'Publicity', 0, 0, 1380000.00, 'Publicity, billboards, social media, and digital awareness.', '/assets/event-banner.png', 1),
            ('White Prayer Mats', 'mats', 1000, 0, 85000.00, 'White prayer mats per roll laid before dawn.', '/assets/praying_mat.jpeg', 1)
          `);
          const [seeded] = await db.query<RowDataPacket[]>(
            'SELECT * FROM sadaqah_campaigns ORDER BY id DESC'
          );
          rows = seeded;
        } catch (e) {
          console.error('Error auto-seeding campaigns in admin:', e);
        }
      }
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

    if (type === 'schedule') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM event_schedule ORDER BY item_order ASC, id ASC'
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
      const targetQty = payload.targetQty !== undefined && payload.targetQty !== null && payload.targetQty !== '' ? Number(payload.targetQty) : 0;
      const unitPrice = payload.unitPrice !== undefined && payload.unitPrice !== null && payload.unitPrice !== '' ? Number(payload.unitPrice) : 0;
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
      const targetQty = payload.targetQty !== undefined && payload.targetQty !== null && payload.targetQty !== '' ? Number(payload.targetQty) : 0;
      const currentQty = Number(payload.currentQty) || 0;
      const unitPrice = payload.unitPrice !== undefined && payload.unitPrice !== null && payload.unitPrice !== '' ? Number(payload.unitPrice) : 0;
      const description = sanitizeString(payload.description, 2000);
      const imageUrl = sanitizeString(payload.imageUrl, 500);
      const isActive = payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1;

      await db.query(
        'UPDATE sadaqah_campaigns SET title = ?, category = ?, target_qty = ?, current_qty = ?, unit_price = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?',
        [title, category, targetQty, currentQty, unitPrice, description, imageUrl, isActive, id]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated Sadaqah Campaign', `ID: ${id}, Title: ${title}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_paystack_settings') {
      const mode = sanitizeString(payload.mode, 20) || 'test';
      const testPublicKey = sanitizeString(payload.testPublicKey, 255);
      const testSecretKey = sanitizeString(payload.testSecretKey, 255);
      const livePublicKey = sanitizeString(payload.livePublicKey, 255);
      const liveSecretKey = sanitizeString(payload.liveSecretKey, 255);

      const activePublicKey = mode === 'live' ? livePublicKey : testPublicKey;
      const activeSecretKey = mode === 'live' ? liveSecretKey : testSecretKey;

      await db.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        ['paystack_mode', mode, mode]
      );
      if (testPublicKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_test_public_key', testPublicKey, testPublicKey]
        );
      }
      if (testSecretKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_test_secret_key', testSecretKey, testSecretKey]
        );
      }
      if (livePublicKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_live_public_key', livePublicKey, livePublicKey]
        );
      }
      if (liveSecretKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_live_secret_key', liveSecretKey, liveSecretKey]
        );
      }
      if (activePublicKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_public_key', activePublicKey, activePublicKey]
        );
      }
      if (activeSecretKey) {
        await db.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['paystack_secret_key', activeSecretKey, activeSecretKey]
        );
      }
      await logAdminActivity(adminEmail, adminName, 'Updated Paystack Payment Gateway Settings', `Mode: ${mode}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'create_schedule_item') {
      const timeSlot = sanitizeString(payload.timeSlot || payload.time, 50);
      const title = sanitizeString(payload.title, 255);
      const note = sanitizeString(payload.note, 2000);
      const itemOrder = Number(payload.itemOrder) || 0;

      await db.query(
        'INSERT INTO event_schedule (time_slot, title, note, item_order) VALUES (?, ?, ?, ?)',
        [timeSlot, title, note, itemOrder]
      );
      await logAdminActivity(adminEmail, adminName, 'Created Schedule Item', `Title: ${title}, Time: ${timeSlot}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_schedule_item') {
      const id = Number(payload.id);
      const timeSlot = sanitizeString(payload.timeSlot || payload.time, 50);
      const title = sanitizeString(payload.title, 255);
      const note = sanitizeString(payload.note, 2000);
      const itemOrder = Number(payload.itemOrder) || 0;
      const isActive = payload.is_active !== undefined ? (payload.is_active ? 1 : 0) : 1;

      await db.query(
        'UPDATE event_schedule SET time_slot = ?, title = ?, note = ?, item_order = ?, is_active = ? WHERE id = ?',
        [timeSlot, title, note, itemOrder, isActive, id]
      );
      await logAdminActivity(adminEmail, adminName, 'Updated Schedule Item', `ID: ${id}, Title: ${title}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_schedule_item') {
      const id = Number(payload.id);
      await db.query('DELETE FROM event_schedule WHERE id = ?', [id]);
      await logAdminActivity(adminEmail, adminName, 'Deleted Schedule Item', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'approve_vendor') {
      const id = Number(payload.id);
      const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM vendors WHERE id = ?', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }
      const vendor = rows[0];
      const stallCode = vendor.pass_code || ("ZONE-" + (vendor.category?.charAt(0).toUpperCase() || "V") + "-" + Math.floor(10 + Math.random() * 90));
      const passCode = "VND-" + Math.floor(1000 + Math.random() * 9000);

      await db.query('UPDATE vendors SET status = "approved", pass_code = ? WHERE id = ?', [stallCode, id]);
      await logAdminActivity(adminEmail, adminName, 'Approved Vendor Application', `ID: ${id}, Business: ${vendor.business_name}`);

      const { sendVendorRegistrationEmail } = await import('@/lib/email');
      sendVendorRegistrationEmail({
        to: vendor.email,
        businessName: vendor.business_name,
        contactPerson: vendor.contact_person,
        stallCode,
        passCode,
        category: vendor.category,
        spaces: vendor.spaces || 1,
        totalPrice: vendor.total_price || 0,
      }).catch((err) => console.error('Error sending vendor approval email:', err));

      return NextResponse.json({ success: true });
    }

    if (action === 'decline_vendor') {
      const id = Number(payload.id);
      await db.query('UPDATE vendors SET status = "declined" WHERE id = ?', [id]);
      await logAdminActivity(adminEmail, adminName, 'Declined Vendor Application', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'approve_media') {
      const id = Number(payload.id);
      const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM media_accreditations WHERE id = ?', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Media application not found' }, { status: 404 });
      }
      const mediaApp = rows[0];
      const accreditationNumber = mediaApp.accreditation_number || ("PRESS-" + Math.floor(1000 + Math.random() * 9000));

      await db.query('UPDATE media_accreditations SET status = "approved" WHERE id = ?', [id]);
      await logAdminActivity(adminEmail, adminName, 'Approved Media Accreditation', `ID: ${id}, Name: ${mediaApp.full_name}, Org: ${mediaApp.org_name}`);

      const { sendMediaApprovalEmail } = await import('@/lib/email');
      sendMediaApprovalEmail({
        to: mediaApp.email,
        fullName: mediaApp.full_name,
        orgName: mediaApp.org_name,
        accreditationNumber,
        mediaType: mediaApp.media_type,
      }).catch((err) => console.error('Error sending media approval email:', err));

      return NextResponse.json({ success: true });
    }

    if (action === 'decline_media') {
      const id = Number(payload.id);
      await db.query('UPDATE media_accreditations SET status = "declined" WHERE id = ?', [id]);
      await logAdminActivity(adminEmail, adminName, 'Declined Media Accreditation', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in admin POST action:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
