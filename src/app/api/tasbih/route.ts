import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>('SELECT count, updated_at FROM tasbih WHERE id = 1');
    
    const count = rows[0]?.count ? Number(rows[0].count) : 128450;
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching tasbih count:', error);
    return NextResponse.json({ success: false, count: 128450, error: 'Database unavailable' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const increment = Math.max(1, Math.min(Number(body.increment) || 1, 100)); // Cap increment between 1 and 100 per request

    const db = await getDb();
    await db.query('UPDATE tasbih SET count = count + ? WHERE id = 1', [increment]);
    
    const [rows] = await db.query<RowDataPacket[]>('SELECT count FROM tasbih WHERE id = 1');
    const newCount = rows[0]?.count ? Number(rows[0].count) : 128450;

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error('Error incrementing tasbih count:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' });
  }
}
