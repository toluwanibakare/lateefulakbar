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

    let [tickets] = await db.query<RowDataPacket[]>(
      `SELECT * FROM support_tickets ORDER BY created_at DESC`
    );

    if (tickets.length === 0) {
      try {
        await db.query(`
          INSERT INTO support_tickets (name, email, phone, query, status) VALUES
          ('Rashidat Alabi', 'rashidat.alabi@example.com', '+234 803 111 2233', 'Need clarification on VIP entrance gates and parking permits.', 'pending'),
          ('Mustapha Olanrewaju', 'm.olanrewaju@example.com', '+234 802 444 5566', 'How do I download the PDF Prayer Book before the gathering?', 'in_progress'),
          ('Aisha Bint Dawud', 'aisha.dawud@example.com', '+234 815 777 8899', 'I made a donation for cooling fans, how can I get receipt?', 'resolved')
        `);
        [tickets] = await db.query<RowDataPacket[]>(
          `SELECT * FROM support_tickets ORDER BY created_at DESC`
        );
      } catch (seedErr) {
        console.error('Error auto-seeding support tickets:', seedErr);
      }
    }

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Error in messages API GET:', error);
    return NextResponse.json({ success: false, tickets: [], messages: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, sender, message } = body;

    if (!ticketId || !message) {
      return NextResponse.json({ success: false, error: 'Ticket ID and message required' }, { status: 400 });
    }

    const db = await getDb();
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
