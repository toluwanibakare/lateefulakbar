import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const DEFAULT_SCHEDULE = [
  { id: 1, time: "08:00 AM", title: "Daily Fortification", note: "Opening fortification, accreditation, seating by canopy, and quiet preparation." },
  { id: 2, time: "09:30 AM", title: "Welcome & Introduction", note: "Opening address from Nadwat Global Assembly, setting intentions together." },
  { id: 3, time: "10:15 AM", title: "Thanksgiving", note: "Reflecting on blessings and giving gratitude for answered prayers." },
  { id: 4, time: "10:45 AM", title: "Islamic Lecture / Spiritual Exhortation", note: "Inspiring talk and spiritual guidance by guest scholars and the convener." },
  { id: 5, time: "11:30 AM", title: "Collective Dhikr & Istighfār", note: "Seeking forgiveness and chanting remembrance in unison." },
  { id: 6, time: "12:15 PM", title: "Salawāt upon Prophet Muhammad ﷺ", note: "Sending blessings upon the Holy Prophet with deep devotion." },
  { id: 7, time: "01:00 PM", title: "Special Yā Lateef Dhikr", note: "The grand collective Yā Lateef tasbīh recitation across the venue." },
  { id: 8, time: "02:00 PM", title: "Guided Duʿā & Supplications", note: "Focused prayers for family, health, business, career, marriage, education, protection, prosperity and life concerns." },
  { id: 9, time: "03:00 PM", title: "Special Prayer for the Ummah", note: "Unifying prayers for peace, security, and relief for Muslims worldwide." },
  { id: 10, time: "03:30 PM", title: "Closing Duʿā & Remarks", note: "Final blessings, closing announcements, and orderly dispersal." },
];

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, time_slot as time, title, note FROM event_schedule WHERE is_active = 1 ORDER BY item_order ASC, id ASC'
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: true, schedule: DEFAULT_SCHEDULE });
    }

    return NextResponse.json({ success: true, schedule: rows });
  } catch (error) {
    console.error('Error fetching event schedule:', error);
    return NextResponse.json({ success: true, schedule: DEFAULT_SCHEDULE });
  }
}
