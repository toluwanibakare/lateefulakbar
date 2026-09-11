import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await params;
    const slug = sanitizeString(rawParams.slug, 150);
    const db = await getDb();

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT likes, views FROM blog_stats WHERE slug = ?',
      [slug]
    );

    const likes = rows[0]?.likes || 0;
    const views = rows[0]?.views || 0;

    return NextResponse.json({ success: true, slug, likes, views });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json({ success: false, likes: 0, views: 0 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`blog_${ip}`, 30, 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const rawParams = await params;
    const slug = sanitizeString(rawParams.slug, 150);
    const body = await req.json().catch(() => ({}));
    const action = sanitizeString(body.action, 20) || 'view';

    const db = await getDb();

    if (action === 'like') {
      await db.query(
        `INSERT INTO blog_stats (slug, likes, views) VALUES (?, 1, 0)
         ON DUPLICATE KEY UPDATE likes = likes + 1`,
        [slug]
      );
    } else {
      await db.query(
        `INSERT INTO blog_stats (slug, likes, views) VALUES (?, 0, 1)
         ON DUPLICATE KEY UPDATE views = views + 1`,
        [slug]
      );
    }

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT likes, views FROM blog_stats WHERE slug = ?',
      [slug]
    );

    return NextResponse.json({
      success: true,
      slug,
      likes: rows[0]?.likes || 0,
      views: rows[0]?.views || 0,
    });
  } catch (error) {
    console.error('Error updating blog stats:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' });
  }
}
