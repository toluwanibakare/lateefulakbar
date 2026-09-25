import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';
import { sendMediaSubmissionAdminEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`media_acc_${ip}`, 10, 60 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many media accreditation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const fullName = sanitizeString(body.fullName, 255);
    const phone = sanitizeString(body.phone, 50);
    const email = body.email ? body.email.trim() : '';
    const city = sanitizeString(body.city || '', 100);
    const orgName = sanitizeString(body.orgName, 255);
    const mediaType = sanitizeString(body.mediaType || 'Digital Media', 100);
    const role = sanitizeString(body.role || '', 100);
    const socialHandles = sanitizeString(body.socialHandles || '', 255);
    const purpose = sanitizeString(body.purpose || '', 1000);
    const coverageType = sanitizeString(body.coverageType || 'Photography', 100);
    const crewCount = parseInt(body.crewCount || '1', 10);
    const crewDetails = sanitizeString(body.crewDetails || '', 1000);
    const equipment = sanitizeString(body.equipment || '', 1000);
    const interviewAccess = sanitizeString(body.interviewAccess || 'No', 10);
    const specialRequests = sanitizeString(body.specialRequests || '', 1000);

    if (!fullName || !phone || !email || !isValidEmail(email) || !orgName) {
      return NextResponse.json(
        { error: 'Valid full name, phone, email, and organization name are required.' },
        { status: 400 }
      );
    }

    const accreditationNumber = "PRESS-" + Math.floor(1000 + Math.random() * 9000);

    const db = await getDb();
    const [result]: any = await db.query(
      `INSERT INTO media_accreditations 
       (full_name, phone, email, city, org_name, media_type, role, social_handles, purpose, coverage_type, crew_count, crew_details, equipment, interview_access, special_requests, accreditation_number, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        fullName,
        phone,
        email,
        city,
        orgName,
        mediaType,
        role,
        socialHandles,
        purpose,
        coverageType,
        crewCount,
        crewDetails,
        equipment,
        interviewAccess,
        specialRequests,
        accreditationNumber,
      ]
    );

    const recordId = result?.insertId || accreditationNumber;

    // Send admin notification email
    sendMediaSubmissionAdminEmail({
      fullName,
      orgName,
      email,
      phone,
      mediaType,
    }).catch((err) => console.error('Error sending media admin email:', err));

    return NextResponse.json({
      success: true,
      data: {
        id: String(recordId),
        accreditationNumber,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Media accreditation API error:', error);
    return NextResponse.json({ error: 'Failed to submit media accreditation application.' }, { status: 500 });
  }
}
