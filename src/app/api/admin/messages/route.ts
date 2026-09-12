import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');
    const db = await getDb();

    if (ticketId) {
      const [messages] = await db.query<RowDataPacket[]>(
        `SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC`,
        [ticketId]
      );
      return NextResponse.json({ success: true, messages });
    }

    const [tickets] = await db.query<RowDataPacket[]>(
      `SELECT * FROM support_tickets ORDER BY created_at DESC`
    );

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error in messages API GET:', error);
    return NextResponse.json({ success: false, tickets: [], messages: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ticketId, sender, message, status } = body;
    const db = await getDb();

    if (action === 'update_status' || status) {
      await db.query(
        `UPDATE support_tickets SET status = ? WHERE id = ?`,
        [status || 'resolved', ticketId]
      );
      return NextResponse.json({ success: true });
    }

    if (!ticketId || !message) {
      return NextResponse.json({ success: false, error: 'Ticket ID and message required' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO ticket_messages (ticket_id, sender, message) VALUES (?, ?, ?)`,
      [ticketId, sender || 'Admin Representative', message]
    );

    // Update parent ticket status
    await db.query(
      `UPDATE support_tickets SET status = 'in_progress' WHERE id = ?`,
      [ticketId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in messages API POST:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
