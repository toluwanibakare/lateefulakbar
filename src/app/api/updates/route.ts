import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, title, content, priority, created_at FROM event_updates WHERE is_active = 1 ORDER BY id DESC LIMIT 10'
    );

    return NextResponse.json({ success: true, updates: rows });
  } catch (error) {
    console.error('Error fetching public event updates:', error);
    return NextResponse.json({ success: false, updates: [] });
  }
}
