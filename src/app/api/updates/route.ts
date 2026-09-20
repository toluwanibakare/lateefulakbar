import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, title, content, priority, created_at FROM event_updates WHERE is_active = 1 ORDER BY id DESC LIMIT 10'
    );

    const [settings] = await db.query<RowDataPacket[]>(
      "SELECT setting_key, setting_value FROM app_settings WHERE setting_key IN ('live_broadcast_url', 'live_broadcast_active')"
    );
    const settingsMap: Record<string, string> = {};
    settings.forEach((r) => {
      settingsMap[r.setting_key] = r.setting_value;
    });

    return NextResponse.json({
      success: true,
      updates: rows,
      streamUrl: settingsMap['live_broadcast_url'] || 'https://www.youtube.com/embed/0x1LqBHjWWE?rel=0',
      isLive: settingsMap['live_broadcast_active'] === 'true' || settingsMap['live_broadcast_active'] === '1',
    });
  } catch (error) {
    console.error('Error fetching public event updates:', error);
    return NextResponse.json({ success: false, updates: [], streamUrl: '', isLive: false });
  }
}
