import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';
import { sendVendorRegistrationEmail, sendVendorSubmissionAdminEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`vendor_reg_${ip}`, 10, 60 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many vendor registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const businessName = sanitizeString(body.businessName, 255);
    const contactPerson = sanitizeString(body.contactPerson, 255);
    const phone = sanitizeString(body.phone, 50);
    const email = body.email ? body.email.trim() : '';
    const address = sanitizeString(body.address || '', 500);
    const socialHandle = sanitizeString(body.socialHandle || '', 100);
    const category = sanitizeString(body.category, 100);
    const subCategory = sanitizeString(body.subCategory || '', 255);
    const description = sanitizeString(body.description || '', 1000);
    const spaces = parseInt(body.spaces || '1', 10);
    const electricity = sanitizeString(body.electricity || 'No', 10);
    const powerDetails = sanitizeString(body.powerDetails || '', 500);
    const staffCount = parseInt(body.staffCount || '2', 10);
    const totalPrice = parseFloat(body.totalPrice || '0');
    const paymentRefInput = sanitizeString(body.paymentRef || '', 100);

    if (!businessName || !contactPerson || !phone || !email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid business name, contact person, phone and email are required.' },
        { status: 400 }
      );
    }

    const passCode = "VND-" + Math.floor(1000 + Math.random() * 9000);
    const stallCode = "ZONE-" + (category.charAt(0).toUpperCase()) + "-" + Math.floor(10 + Math.random() * 90);
    const paymentRef = paymentRefInput || ("PAY-" + Math.random().toString(36).slice(2, 8).toUpperCase());

    const db = await getDb();
    await db.query(
      `INSERT INTO vendors 
       (business_name, contact_person, phone, email, address, social_handle, category, sub_category, description, spaces, electricity, power_details, staff_count, total_price, pass_code, payment_ref, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        businessName,
        contactPerson,
        phone,
        email,
        address,
        socialHandle,
        category,
        subCategory,
        description,
        spaces,
        electricity,
        powerDetails,
        staffCount,
        totalPrice,
        stallCode,
        paymentRef,
      ]
    );

    // Send notification email to Admin
    sendVendorSubmissionAdminEmail({
      businessName,
      contactPerson,
      email,
      phone,
      category,
      totalPrice,
    }).catch((err: any) => console.error('Error sending vendor admin notification:', err));

    return NextResponse.json({
      success: true,
      passCode,
      stallCode,
      paymentRef,
      status: 'pending',
    });
  } catch (error) {
    console.error('Vendor registration API error:', error);
    return NextResponse.json({ error: 'Failed to submit vendor registration.' }, { status: 500 });
  }
}


