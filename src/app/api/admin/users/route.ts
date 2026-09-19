import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { sanitizeString, isValidEmail, isValidPassword } from '@/lib/security';
import { logAdminActivity } from '@/app/api/admin/crud/route';
import { sendAdminPasswordChangedEmail } from '@/lib/email';

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
        `SELECT b.*, COALESCE(s.likes, 0) as likes, COALESCE(s.views, 0) as views
         FROM blog_posts b
         LEFT JOIN blog_stats s ON s.slug = b.slug
         ORDER BY b.id DESC`
      );
      return NextResponse.json({ success: true, posts: rows });
    }

    if (type === 'gallery') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM gallery_media ORDER BY id DESC'
      );
      return NextResponse.json({ success: true, items: rows });
    }

    if (type === 'donations_list') {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM donations ORDER BY id DESC'
      );
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
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Created Admin User', `Name: ${cleanName}, Role: ${cleanRole}, Email: ${cleanEmail}`);

      // Send Welcome Credentials Email to the newly created admin
      try {
        const { sendAdminWelcomeEmail } = await import('@/lib/email');
        await sendAdminWelcomeEmail({
          to: cleanEmail,
          name: cleanName,
          role: cleanRole,
          password: cleanPassword,
          permissions: Array.isArray(permissions) ? permissions : [],
        });
      } catch (err) {
        console.error('Error sending admin welcome email:', err);
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'change_password') {
      const { email, currentPassword, newPassword } = payload;
      const cleanEmail = sanitizeString(email, 100).toLowerCase();
      const cleanNewPassword = sanitizeString(newPassword, 100);

      const passCheck = isValidPassword(cleanNewPassword);
      if (!passCheck.valid) {
        return NextResponse.json({ success: false, error: passCheck.reason }, { status: 400 });
      }

      if (!cleanEmail || !cleanNewPassword) {
        return NextResponse.json({ success: false, error: 'Invalid password details' }, { status: 400 });
      }

      // Check if it's dynamic admin user
      await db.query('UPDATE admin_users SET password = ? WHERE email = ?', [cleanNewPassword, cleanEmail]);
      await logAdminActivity(cleanEmail, cleanEmail, 'Changed Password', 'Admin password successfully updated');
      
      // Trigger Security Email Alert
      sendAdminPasswordChangedEmail({
        to: cleanEmail,
        adminName: cleanEmail,
        changeTime: new Date().toUTCString(),
      }).catch((err) => console.error('Error sending admin password alert:', err));

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    if (action === 'delete_admin_user') {
      const { id } = payload;
      await db.query('DELETE FROM admin_users WHERE id = ?', [Number(id)]);
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Deleted Admin User', `User ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_blog_post') {
      const { id, title, category, excerpt, content, image, read_time, author } = payload;
      const cleanTitle = sanitizeString(title, 255);
      const cleanCategory = sanitizeString(category, 100) || 'Field Notes';
      const cleanExcerpt = sanitizeString(excerpt, 1000);
      const cleanContent = sanitizeString(content, 10000);
      const cleanImage = sanitizeString(image, 500) || '/assets/crowd-11.jpg';
      const cleanReadTime = sanitizeString(read_time, 50) || '5 min';
      const cleanAuthor = sanitizeString(author, 100) || 'Nadwat Media';

      let slug = sanitizeString(title, 255).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!slug) slug = `post-${Date.now()}`;

      if (id) {
        await db.query(
          'UPDATE blog_posts SET title = ?, category = ?, excerpt = ?, content = ?, image = ?, read_time = ?, author = ? WHERE id = ?',
          [cleanTitle, cleanCategory, cleanExcerpt, cleanContent, cleanImage, cleanReadTime, cleanAuthor, Number(id)]
        );
        await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Updated Blog Post', `Title: ${cleanTitle}`);
      } else {
        await db.query(
          'INSERT INTO blog_posts (slug, title, category, excerpt, content, image, read_time, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [slug, cleanTitle, cleanCategory, cleanExcerpt, cleanContent, cleanImage, cleanReadTime, cleanAuthor]
        );
        await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Created Blog Post', `Title: ${cleanTitle}`);
      }
      return NextResponse.json({ success: true, slug });
    }

    if (action === 'delete_blog_post') {
      const { id } = payload;
      await db.query('DELETE FROM blog_posts WHERE id = ?', [Number(id)]);
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Deleted Blog Post', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'save_gallery_item') {
      const { id, title, category, url } = payload;
      const cleanTitle = sanitizeString(title, 255);
      const cleanCategory = sanitizeString(category, 100) || 'Gathering';
      const cleanUrl = sanitizeString(url, 500);

      if (id) {
        await db.query(
          'UPDATE gallery_media SET title = ?, category = ?, url = ? WHERE id = ?',
          [cleanTitle, cleanCategory, cleanUrl, Number(id)]
        );
        await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Updated Gallery Item', `Title: ${cleanTitle}`);
      } else {
        await db.query(
          'INSERT INTO gallery_media (title, category, url) VALUES (?, ?, ?)',
          [cleanTitle, cleanCategory, cleanUrl]
        );
        await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Uploaded Gallery Item', `Title: ${cleanTitle}`);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_gallery_item') {
      const { id } = payload;
      await db.query('DELETE FROM gallery_media WHERE id = ?', [Number(id)]);
      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Deleted Gallery Item', `ID: ${id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'send_broadcast') {
      const { subject, body, target, singleEmail } = payload;
      const cleanSubject = sanitizeString(subject, 255);
      const cleanBody = sanitizeString(body, 10000);
      const cleanTarget = sanitizeString(target, 50) || 'all';
      const cleanSingle = sanitizeString(singleEmail, 255);

      if (!cleanSubject || !cleanBody) {
        return NextResponse.json({ success: false, error: 'Subject and body are required' }, { status: 400 });
      }

      let recipients: string[] = [];

      if (cleanTarget === 'single' && cleanSingle) {
        recipients = [cleanSingle];
      } else if (cleanTarget === 'attendees') {
        const [rows] = await db.query<RowDataPacket[]>('SELECT email FROM registrations WHERE email IS NOT NULL AND email != ""');
        recipients = rows.map((r) => r.email);
      } else if (cleanTarget === 'subscribers') {
        const [rows] = await db.query<RowDataPacket[]>('SELECT email FROM newsletter_subscribers WHERE email IS NOT NULL AND email != ""');
        recipients = rows.map((r) => r.email);
      } else {
        // 'all' target -> combined unique emails from both attendees and newsletter subscribers
        const [regRows] = await db.query<RowDataPacket[]>('SELECT email FROM registrations WHERE email IS NOT NULL AND email != ""');
        const [subRows] = await db.query<RowDataPacket[]>('SELECT email FROM newsletter_subscribers WHERE email IS NOT NULL AND email != ""');
        const set = new Set<string>();
        regRows.forEach((r) => set.add(r.email));
        subRows.forEach((r) => set.add(r.email));
        recipients = Array.from(set);
      }

      if (recipients.length === 0) {
        return NextResponse.json({ success: false, error: 'No recipient email addresses found for target' }, { status: 400 });
      }

      const { sendBroadcastEmail } = await import('@/lib/email');
      let sentCount = 0;
      let failCount = 0;

      for (const email of recipients) {
        const res = await sendBroadcastEmail({
          to: email,
          subject: cleanSubject,
          bodyHtml: cleanBody.replace(/\n/g, '<br/>'),
        });
        if (res.success) sentCount++;
        else failCount++;
      }

      await logAdminActivity('admin@lateefulakbar.com', 'Super Admin', 'Sent Email Broadcast', `Subject: ${cleanSubject}, Recipient Count: ${recipients.length}`);

      return NextResponse.json({
        success: true,
        sentCount,
        failCount,
        totalRecipients: recipients.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in Admin Users API POST:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

