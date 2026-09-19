import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const db = await getDb();

    if (slug) {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT b.*, COALESCE(s.likes, 0) as likes, COALESCE(s.views, 0) as views
         FROM blog_posts b
         LEFT JOIN blog_stats s ON s.slug = b.slug
         WHERE b.slug = ? AND b.is_published = 1`,
        [slug]
      );
      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post: rows[0] });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT b.*, COALESCE(s.likes, 0) as likes, COALESCE(s.views, 0) as views
       FROM blog_posts b
       LEFT JOIN blog_stats s ON s.slug = b.slug
       WHERE b.is_published = 1
       ORDER BY b.id DESC`
    );

    return NextResponse.json({ success: true, posts: rows });
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    return NextResponse.json({ success: false, posts: [] });
  }
}
