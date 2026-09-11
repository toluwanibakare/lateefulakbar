import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyAdminToken, sanitizeString } from '@/lib/security';

export async function GET(req: Request) {
  try {
    // Authorization Guard
    const isAuthorized = verifyAdminToken(req.headers.get('authorization'));
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const db = await getDb();
    const [tickets] = await db.query<RowDataPacket[]>(
      `SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 50`
    );

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ success: false, tickets: [] }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Authorization Guard
    const isAuthorized = verifyAdminToken(req.headers.get('authorization'));
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id, status } = await req.json();
    const cleanId = Number(id);
    const cleanStatus = sanitizeString(status, 50);

    if (!cleanId || !cleanStatus) {
      return NextResponse.json({ error: 'Valid ID and status required' }, { status: 400 });
    }

    const db = await getDb();
    await db.query(`UPDATE support_tickets SET status = ? WHERE id = ?`, [cleanStatus, cleanId]);

    return NextResponse.json({ success: true, id: cleanId, status: cleanStatus });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
