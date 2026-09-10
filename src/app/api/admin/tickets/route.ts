import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();
    const [tickets] = await db.query<RowDataPacket[]>(
      `SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 50`
    );

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ success: false, tickets: [] });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    const db = await getDb();
    await db.query(`UPDATE support_tickets SET status = ? WHERE id = ?`, [status, id]);

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
