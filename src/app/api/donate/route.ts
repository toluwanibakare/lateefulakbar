import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';

export async function GET() {
  try {
    const db = await getDb();

    // Query active donation campaigns & thresholds set by admin
    let [campaigns] = await db.query<RowDataPacket[]>(
      `SELECT * FROM sadaqah_campaigns WHERE is_active = 1 ORDER BY id ASC`
    );

    // Auto-seed default campaigns if table is currently empty
    if (campaigns.length === 0) {
      try {
        await db.query(`
          INSERT INTO sadaqah_campaigns (title, category, target_qty, current_qty, unit_price, description, image_url, is_active) VALUES
          ('Prayer Mats & Rugs', 'mats', 500, 310, 15000.00, 'Clean mats for the canopies, laid before dawn.', '/assets/praying_mat.jpeg', 1),
          ('Water & Hydration Points', 'water', 1000, 780, 5000.00, 'Cool packs moved through the rows all morning.', '/assets/donation-water.jpg', 1),
          ('Provide Cooling Fans', 'cooling', 200, 134, 25000.00, 'Industrial fans and shade for the midday heat.', '/assets/donation-cooling.jpg', 1),
          ('Nadwat TV Live Broadcast', 'media', 50, 22, 100000.00, 'Cameras, drone and HD livestream production.', '/assets/donation-media.jpg', 1)
        `);
        const [seeded] = await db.query<RowDataPacket[]>(
          `SELECT * FROM sadaqah_campaigns WHERE is_active = 1 ORDER BY id ASC`
        );
        campaigns = seeded;
      } catch (seedErr) {
        console.error('Error auto-seeding sadaqah campaigns:', seedErr);
      }
    }

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
      campaigns,
      categoryTotals,
      grandTotal: Number(overallRows[0]?.grandTotal || 0),
      totalDonors: Number(overallRows[0]?.totalDonors || 0),
    });
  } catch (error) {
    console.error('Error fetching donation stats & campaigns:', error);
    return NextResponse.json({ success: false, campaigns: [], categoryTotals: {}, grandTotal: 0, totalDonors: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`donate_${ip}`, 20, 60 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many donation processing requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const donorName = sanitizeString(body.donorName, 150);
    const email = body.email && isValidEmail(body.email) ? body.email.trim() : '';
    const amount = Number(body.amount);
    const category = sanitizeString(body.category, 100);
    const txRef = sanitizeString(body.txRef, 100);

    if (isNaN(amount) || amount <= 0 || !category) {
      return NextResponse.json({ error: 'Valid amount and category are required' }, { status: 400 });
    }

    const ref = txRef || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const db = await getDb();

    await db.query(
      `INSERT INTO donations (donor_name, email, amount, category, tx_ref, status) VALUES (?, ?, ?, ?, ?, 'completed')`,
      [donorName || 'Anonymous', email, amount, category, ref]
    );

    // Update current quantity on matching campaign
    await db.query(
      `UPDATE sadaqah_campaigns SET current_qty = current_qty + 1 WHERE category = ? OR title = ?`,
      [category, category]
    );

    return NextResponse.json({
      success: true,
      message: 'Donation recorded successfully',
      txRef: ref,
    });
  } catch (error) {
    console.error('Error logging donation:', error);
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 });
  }
}
