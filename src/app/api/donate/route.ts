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
          ('TBS Venue Rental', 'Venue', 0, 0, 22500000.00, 'Main bowl rental and facility access for Tafawa Balewa Square.', '/assets/crowd-12.jpg', 1),
          ('6 Marquee Tents (25m x 100m)', 'tents', 6, 0, 4000000.00, 'Large shaded marquee tents (25m x 100m) for assembly rows.', '/assets/donation-tents.jpg', 1),
          ('40 Digital LED Screens', 'media', 40, 0, 250000.00, 'High-definition digital LED display screens around the bowl.', '/assets/donation-media.jpg', 1),
          ('Stage Setup & Infrastructure', 'Stage', 0, 0, 7500000.00, 'Main elevated stage, podium, backdrop, and structure.', '/assets/crowd-11.jpg', 1),
          ('2,000 Cartons Nestlé Water (60cl)', 'water', 2000, 0, 3600.00, 'Nestlé bottled water cartons (60cl) served to worshippers.', '/assets/donation-water.jpg', 1),
          ('Professional Sound System', 'Sound', 0, 0, 6000000.00, 'High-grade arena audio speakers, amplifiers and mics.', '/assets/crowd-08.jpg', 1),
          ('Generators, Fuel (Diesel/PMS) & Security', 'Power & Security', 0, 0, 5000000.00, 'Heavy-duty power generators, fuel supply, and site security.', '/assets/drone-wide.png', 1),
          ('Cooling (Regular & Mist Fans)', 'cooling', 1000, 0, 3000.00, 'Industrial standing fans and mist cooling fans across rows.', '/assets/donation-cooling.jpg', 1),
          ('Internet & Media Production Equipment', 'Media & Tech', 0, 0, 2900000.00, 'Dedicated high-speed internet, livestream encoders, and cameras.', '/assets/donation-internet.jpg', 1),
          ('Digital Advertising & Publicity', 'Publicity', 0, 0, 1380000.00, 'Publicity, billboards, social media, and digital awareness.', '/assets/event-banner.png', 1),
          ('White Prayer Mats', 'mats', 1000, 0, 85000.00, 'White prayer mats per roll laid before dawn.', '/assets/praying_mat.jpeg', 1)
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

    // Query completed transactions for donor transparency
    const [transactions] = await db.query<RowDataPacket[]>(
      `SELECT donor_name, amount, category, mode, created_at FROM donations WHERE status = 'completed' ORDER BY id DESC LIMIT 100`
    );

    const categoryTotals: Record<string, number> = {};
    rows.forEach((r) => {
      categoryTotals[r.category] = Number(r.categoryTotal || 0);
    });

    return NextResponse.json({
      success: true,
      campaigns,
      categoryTotals,
      transactions,
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
    const mode = body.mode ? sanitizeString(body.mode, 20) : 'live';

    if (isNaN(amount) || amount <= 0 || !category) {
      return NextResponse.json({ error: 'Valid amount and category are required' }, { status: 400 });
    }

    const ref = txRef || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const db = await getDb();

    await db.query(
      `INSERT INTO donations (donor_name, email, amount, category, tx_ref, mode, status) VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
      [donorName || 'Anonymous', email, amount, category, ref, mode]
    );

    // Update current quantity on matching campaign
    await db.query(
      `UPDATE sadaqah_campaigns SET current_qty = current_qty + 1 WHERE category = ? OR title = ?`,
      [category, category]
    );

    // Send Sadaqah Receipt Email on actual completion
    if (email) {
      const { sendDonationReceiptEmail } = await import('@/lib/email');
      sendDonationReceiptEmail({
        to: email,
        donorName: donorName || 'Noble Donor',
        amount,
        category: category || 'General Sadaqah',
        txRef: ref,
      }).catch((err) => console.error('Error sending donation receipt email:', err));
    }

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
