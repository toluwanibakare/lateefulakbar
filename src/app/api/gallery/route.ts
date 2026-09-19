import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, title, category, url, span FROM gallery_media ORDER BY id DESC'
    );

    return NextResponse.json({ success: true, items: rows });
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return NextResponse.json({ success: false, items: [] });
  }
}
