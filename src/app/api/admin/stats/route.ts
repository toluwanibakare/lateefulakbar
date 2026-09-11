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

    // 1. Registrations count & today's count
    const [regRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total, SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today FROM registrations'
    );
    const totalRegistrations = regRows[0]?.total || 0;
    const todayRegistrations = regRows[0]?.today || 0;

    // 2. Referrals count
    const [refRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM registrations WHERE referred_by IS NOT NULL AND referred_by != ""'
    );
    const totalReferrals = refRows[0]?.total || 0;

    // 3. Donations total
    const [donRows] = await db.query<RowDataPacket[]>(
      'SELECT SUM(amount) as total_amount, COUNT(DISTINCT email) as total_donors FROM donations WHERE status = "completed"'
    );
    const totalDonations = donRows[0]?.total_amount || 0;
    const totalDonors = donRows[0]?.total_donors || 0;

    // 4. Newsletter Subscribers count
    const [subRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM newsletter_subscribers'
    );
    const totalSubscribers = subRows[0]?.total || 0;

    // 5. Recent Registrations
    const [recentRegs] = await db.query<RowDataPacket[]>(
      'SELECT full_name, email, phone, ticket_type, created_at FROM registrations ORDER BY id DESC LIMIT 5'
    );

    // 6. Recent Donations
    const [recentDonations] = await db.query<RowDataPacket[]>(
      'SELECT donor_name, amount, category, created_at FROM donations ORDER BY id DESC LIMIT 5'
    );

    // 7. Recent Activity Logs
    const [recentLogs] = await db.query<RowDataPacket[]>(
      'SELECT admin_name, action, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 6'
    );

    // 8. Tasbih count
    const [tasbihRows] = await db.query<RowDataPacket[]>(
      'SELECT count FROM tasbih WHERE id = 1'
    );
    const tasbihCount = tasbihRows[0]?.count || 0;

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
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
