import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyAdminToken } from '@/lib/security';

export async function GET(req: Request) {
  try {
    // Authorization Check
    if (!verifyAdminToken(req.headers.get('authorization'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const db = await getDb();

    let totalRegistrations = 0;
    let todayRegistrations = 0;
    let totalReferrals = 0;
    let totalDonations = 0;
    let totalDonors = 0;
    let totalSubscribers = 0;
    let tasbihCount = 0;
    let recentRegs: any[] = [];
    let recentDonations: any[] = [];
    let recentLogs: any[] = [];

    // 1. Registrations count & today's count
    try {
      const [regRows] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total, SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today FROM registrations'
      );
      totalRegistrations = Number(regRows[0]?.total || 0);
      todayRegistrations = Number(regRows[0]?.today || 0);
    } catch (e) {
      console.warn('Stats warning (registrations):', e);
    }

    // 2. Referrals count
    try {
      const [refRows] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM registrations WHERE referred_by IS NOT NULL AND referred_by != ""'
      );
      totalReferrals = Number(refRows[0]?.total || 0);
    } catch (e) {
      console.warn('Stats warning (referrals):', e);
    }

    // 3. Donations total (Prefers mode = 'live', or fallback if legacy)
    try {
      const [donRows] = await db.query<RowDataPacket[]>(
        'SELECT SUM(amount) as total_amount, COUNT(DISTINCT email) as total_donors FROM donations WHERE status = "completed" AND (mode = "live" OR mode IS NULL OR mode = "")'
      );
      totalDonations = Number(donRows[0]?.total_amount || 0);
      totalDonors = Number(donRows[0]?.total_donors || 0);
    } catch (e) {
      console.warn('Stats warning (donations):', e);
    }

    // 4. Newsletter Subscribers count
    try {
      const [subRows] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM newsletter_subscribers'
      );
      totalSubscribers = Number(subRows[0]?.total || 0);
    } catch (e) {
      console.warn('Stats warning (subscribers):', e);
    }

    // 5. Recent Registrations
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT full_name, email, phone, ticket_type, created_at FROM registrations ORDER BY id DESC LIMIT 5'
      );
      recentRegs = rows;
    } catch (e) {
      console.warn('Stats warning (recentRegs):', e);
    }

    // 6. Recent Donations
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT donor_name, amount, category, created_at FROM donations ORDER BY id DESC LIMIT 5'
      );
      recentDonations = rows;
    } catch (e) {
      console.warn('Stats warning (recentDonations):', e);
    }

    // 7. Recent Activity Logs
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT admin_name, action, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 6'
      );
      recentLogs = rows;
    } catch (e) {
      console.warn('Stats warning (recentLogs):', e);
    }

    // 8. Tasbih count
    try {
      const [tasbihRows] = await db.query<RowDataPacket[]>(
        'SELECT count FROM tasbih WHERE id = 1'
      );
      tasbihCount = Number(tasbihRows[0]?.count || 0);
    } catch (e) {
      console.warn('Stats warning (tasbih):', e);
    }

    // 9. Real Registration Growth Trend (Last 7 Days)
    let registrationTrend: any[] = [];
    try {
      const [trendRows] = await db.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(created_at, '%a') as day,
                DATE(created_at) as date_val,
                COUNT(*) as count
         FROM registrations
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%a')
         ORDER BY DATE(created_at) ASC`
      );
      registrationTrend = trendRows;
    } catch (e) {
      console.warn('Stats warning (registrationTrend):', e);
    }

    // 10. Real Donation Category Split (Live Mode & Legacy)
    let donationCategorySplit: any[] = [];
    try {
      const [splitRows] = await db.query<RowDataPacket[]>(
        `SELECT category as name, SUM(amount) as value
         FROM donations
         WHERE status = 'completed' AND (mode = 'live' OR mode IS NULL OR mode = '')
         GROUP BY category`
      );
      const COLOR_PALETTE = ['#01923c', '#0b3d2e', '#9a7b2e', '#34d399', '#d97706', '#0284c7'];
      donationCategorySplit = splitRows.map((r, idx) => ({
        name: (r.name || 'General').charAt(0).toUpperCase() + (r.name || 'General').slice(1),
        value: Number(r.value || 0),
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      }));
    } catch (e) {
      console.warn('Stats warning (donationCategorySplit):', e);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRegistrations,
        todayRegistrations,
        totalReferrals,
        totalDonations,
        totalDonors,
        totalSubscribers,
        tasbihCount,
        recentRegistrations: recentRegs,
        recentDonations: recentDonations,
        recentLogs: recentLogs,
        registrationTrend,
        donationCategorySplit,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
