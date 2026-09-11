import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyAdminToken, checkRateLimit } from '@/lib/security';

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>('SELECT count, updated_at FROM tasbih WHERE id = 1');
    
    const count = rows[0]?.count !== undefined ? Number(rows[0].count) : 0;
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching tasbih count:', error);
    return NextResponse.json({ success: false, count: 0, error: 'Database unavailable' });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`tasbih_${ip}`, 60, 60 * 1000); // 60 increments per min max per IP

    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const increment = Math.max(1, Math.min(Number(body.increment) || 1, 100)); // Cap max increment at 100 per request

    const db = await getDb();
    await db.query('UPDATE tasbih SET count = count + ? WHERE id = 1', [increment]);
    
    const [rows] = await db.query<RowDataPacket[]>('SELECT count FROM tasbih WHERE id = 1');
    const newCount = rows[0]?.count !== undefined ? Number(rows[0].count) : 0;

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error('Error incrementing tasbih count:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' });
  }
}

// Admin API to directly update or reset the global Tasbih count
export async function PUT(req: Request) {
  try {
    if (!verifyAdminToken(req.headers.get('authorization'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const newCount = Math.max(0, Number(body.count) || 0);

    const db = await getDb();
    await db.query('UPDATE tasbih SET count = ? WHERE id = 1', [newCount]);

    return NextResponse.json({ success: true, count: newCount });
  } catch (error) {
    console.error('Error updating admin tasbih count:', error);
    return NextResponse.json({ success: false, error: 'Admin update failed' }, { status: 500 });
  }
}
