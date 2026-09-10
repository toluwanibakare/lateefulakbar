import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();

    // Query totals by category
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT category, SUM(amount) as categoryTotal, COUNT(*) as totalCount FROM donations WHERE status = 'completed' GROUP BY category`
    );

    const [overallRows] = await db.query<RowDataPacket[]>(
      `SELECT SUM(amount) as grandTotal, COUNT(*) as totalDonors FROM donations WHERE status = 'completed'`
    );

    const categoryTotals: Record<string, number> = {};
    rows.forEach((r) => {
      categoryTotals[r.category] = Number(r.categoryTotal || 0);
    });

    return NextResponse.json({
      success: true,
      categoryTotals,
      grandTotal: Number(overallRows[0]?.grandTotal || 0),
      totalDonors: Number(overallRows[0]?.totalDonors || 0),
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return NextResponse.json({ success: false, categoryTotals: {}, grandTotal: 0, totalDonors: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const { donorName, email, amount, category, txRef } = await req.json();

    if (!amount || !category) {
      return NextResponse.json({ error: 'Amount and category are required' }, { status: 400 });
    }

    const ref = txRef || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const db = await getDb();
    await db.query(
      `INSERT INTO donations (donor_name, email, amount, category, tx_ref, status) VALUES (?, ?, ?, ?, ?, 'completed')`,
      [donorName || 'Anonymous', email || '', amount, category, ref]
    );

    return NextResponse.json({
      success: true,
      message: 'Jazakallahu Khairan for your generous donation!',
      txRef: ref,
    });
  } catch (error) {
    console.error('Error recording donation:', error);
    return NextResponse.json({ error: 'Failed to process donation record' }, { status: 500 });
  }
}
