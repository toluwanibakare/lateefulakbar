import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || '"Lateeful-Ul-Akbar 2027" <info@lateefulakbar.com>';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lateefulakbar.com';

function getEmailWrapper(title: string, innerHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f8fafc; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
              
              <!-- HEADER -->
              <tr>
                <td style="background: linear-gradient(135deg, #064e3b 0%, #0f766e 100%); padding: 36px 28px; text-align: center; border-bottom: 4px solid #d97706;">
                  <img src="${SITE_URL}/assets/brand/lateefulakbar.PNG" alt="LATEEF Logo" style="height: 64px; max-width: 240px; margin-bottom: 12px; object-fit: contain;" />
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Lateeful-Ul-Akbar Li-A’azam 2027</h1>
                  <p style="margin: 6px 0 0 0; color: #fef3c7; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">Walking in the Footsteps of Light</p>
                </td>
              </tr>

              <!-- MAIN BODY CONTENT -->
              <tr>
                <td style="padding: 32px 28px;">
                  ${innerHtml}
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
                  <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f766e;">Lateeful-Ul-Akbar 2027 Organizing Committee</p>
                  <p style="margin: 0 0 12px 0; line-height: 1.5;">📍 Tafawa Balewa Square (TBS) Main Bowl, Lagos, Nigeria<br>📅 Sunday, January 24, 2027</p>
                  <p style="margin: 0 0 12px 0;">
                    <a href="${SITE_URL}" style="color: #0d9488; text-decoration: none; margin: 0 8px; font-weight: 600;">Visit Website</a> &bull;
                    <a href="${SITE_URL}/sadaqah" style="color: #0d9488; text-decoration: none; margin: 0 8px; font-weight: 600;">Support Event</a> &bull;
                    <a href="${SITE_URL}/chat" style="color: #0d9488; text-decoration: none; margin: 0 8px; font-weight: 600;">Chat Smart LATEEF</a>
                  </p>
                  <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">You received this email because of your registration or interaction with Lateeful-Ul-Akbar 2027.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

async function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// 1. Attendee Registration Email
export async function sendRegistrationEmail({
  to,
  name,
  ticketType,
  passCode,
  referralCode,
  qrCodeDataUrl,
}: {
  to: string;
  name: string;
  ticketType: string;
  passCode: string;
  referralCode?: string;
  qrCodeDataUrl?: string;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Registration Pass sent to ${to}: PassCode=${passCode}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 20px;">Assalamu Alaikum ${name},</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Alhamdulillah! Your official registration for <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong> is confirmed. We are thrilled to welcome you to this sacred grand gathering.
    </p>

    <!-- PASS DETAILS BOX -->
    <div style="background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #047857; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Official Pass Code</p>
      <div style="font-size: 28px; font-weight: 900; color: #064e3b; letter-spacing: 3px; margin-bottom: 12px;">${passCode}</div>
      <p style="margin: 0; font-size: 14px; color: #475569;">Pass Category: <strong style="color: #0f766e;">${ticketType}</strong></p>
    </div>

    ${qrCodeDataUrl ? `
      <div style="text-align: center; margin: 28px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #64748b;">PRESENT AT ENTRANCE FOR FAST GATE SCANNING</p>
        <img src="${qrCodeDataUrl}" alt="Event Pass QR Code" style="width: 170px; height: 170px; border: 4px solid #e2e8f0; border-radius: 12px; padding: 4px; background: white;" />
      </div>
    ` : ''}

    <!-- ACTION CARDS -->
    <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 8px 0; color: #b45309; font-size: 16px; font-weight: 700;">📸 Download Your "I Will Be Attending" Banner</h3>
      <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.5; color: #78350f;">
        Share your anticipation with brothers and sisters! Create and download your custom <strong>"I Will Be Attending"</strong> image card with your photo directly on our website.
      </p>
      <a href="${SITE_URL}/attending" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px;">Download Attending Card &rarr;</a>
    </div>

    <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 8px 0; color: #0369a1; font-size: 16px; font-weight: 700;">🤖 Meet Smart LATEEF AI Assistant</h3>
      <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.5; color: #0c4a6e;">
        Have questions about venue directions, parking, event schedule, or dhikr procedures? <strong>Smart LATEEF</strong> is available 24/7 on the website to answer all your queries in real time.
      </p>
      <a href="${SITE_URL}/chat" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px;">Chat With Smart LATEEF &rarr;</a>
    </div>

    ${referralCode ? `
      <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 6px 0; color: #6b21a8; font-size: 15px; font-weight: 700;">🎁 Invite Friends & Earn Referral Rewards</h3>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #581c87;">Your unique referral link:</p>
        <div style="background: #ffffff; border: 1px solid #d8b4fe; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #6b21a8; word-break: break-all;">
          ${SITE_URL}/?ref=${referralCode}
        </div>
      </div>
    ` : ''}

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 28px;">
      <p style="margin: 0 0 6px 0; font-weight: 700; font-size: 14px; color: #064e3b;">Event Summary:</p>
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;">📍 <strong>Venue:</strong> Tafawa Balewa Square (TBS) Main Bowl, Lagos</p>
      <p style="margin: 0; font-size: 14px; color: #475569;">📅 <strong>Date:</strong> Sunday, January 24, 2027</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Your Event Pass for Lateeful-Ul-Akbar 2027 [${passCode}]`,
      html: getEmailWrapper('Lateeful-Ul-Akbar 2027 Event Pass', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending registration email:', err);
    return { success: false, error: err };
  }
}

// 2. Referral Thank You Email
export async function sendReferralNotificationEmail({
  to,
  referrerName,
  referredName,
  totalReferrals,
}: {
  to: string;
  referrerName: string;
  referredName: string;
  totalReferrals: number;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Referral notification sent to ${to}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 20px;">Jazakallahu Khair ${referrerName}!</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Great news! <strong>${referredName}</strong> just registered for <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong> using your personal referral link!
    </p>

    <div style="background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 4px 0; font-size: 13px; color: #047857; text-transform: uppercase; font-weight: 700;">Total Successful Referrals</p>
      <div style="font-size: 32px; font-weight: 900; color: #064e3b;">${totalReferrals} ${totalReferrals === 1 ? 'Attendee' : 'Attendees'}</div>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      May Allah reward you abundantly for spreading the word about this noble gathering. Keep sharing your link to invite more attendees!
    </p>

    <a href="${SITE_URL}" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 12px;">Visit Lateeful Akbar Portal &rarr;</a>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Thank You for Referring ${referredName} to Lateeful-Ul-Akbar 2027!`,
      html: getEmailWrapper('Referral Success - Lateeful-Ul-Akbar 2027', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending referral notification email:', err);
    return { success: false, error: err };
  }
}

// 3. Vendor Registration Pass & Receipt Email
export async function sendVendorRegistrationEmail({
  to,
  businessName,
  contactPerson,
  stallCode,
  passCode,
  category,
  spaces,
  totalPrice,
}: {
  to: string;
  businessName: string;
  contactPerson: string;
  stallCode: string;
  passCode: string;
  category: string;
  spaces: number;
  totalPrice: number;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Vendor registration email sent to ${to}: StallCode=${stallCode}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 20px;">Assalamu Alaikum ${contactPerson},</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Thank you for registering <strong>${businessName}</strong> as an official vendor at <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong>.
    </p>

    <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; color: #b45309; font-size: 18px; border-bottom: 1px solid #fef3c7; padding-bottom: 8px;">Official Vendor Stall Pass</h3>
      
      <table border="0" cellpadding="6" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr>
          <td width="40%" style="font-weight: 600; color: #78350f;">Stall Zone Code:</td>
          <td width="60%" style="font-weight: 800; color: #b45309; font-size: 18px;">${stallCode}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #78350f;">Vendor Pass Code:</td>
          <td style="font-weight: 700; color: #1e293b;">${passCode}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #78350f;">Category:</td>
          <td>${category}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #78350f;">Reserved Spaces:</td>
          <td>${spaces} Stall Space(s)</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #78350f;">Total Amount:</td>
          <td style="font-weight: 800; color: #064e3b; font-size: 16px;">₦${totalPrice.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      Our Vendor Operations team will contact you prior to the event for setup timetables, security badges, and site access protocols at TBS Main Bowl, Lagos.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Vendor Pass Confirmation - ${businessName} [${stallCode}]`,
      html: getEmailWrapper('Vendor Registration - Lateeful-Ul-Akbar 2027', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending vendor registration email:', err);
    return { success: false, error: err };
  }
}

// 4. Admin Password Reset / Security Alert Email
export async function sendAdminPasswordChangedEmail({
  to,
  adminName,
  changeTime,
}: {
  to: string;
  adminName: string;
  changeTime: string;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Admin password change security email sent to ${to}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #991b1b; font-size: 20px;">Security Notification: Password Changed</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Hello <strong>${adminName}</strong>,
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      This email confirms that the administrative password for <strong>${to}</strong> on the Lateeful-Ul-Akbar portal was successfully changed on <strong>${changeTime}</strong>.
    </p>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 18px; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 1.5;">
        <strong>Did not perform this change?</strong> If you did not initiate this password update, please contact the lead administrator immediately or update your access key via the emergency endpoint.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `[SECURITY ALERT] Admin Password Changed - Lateeful-Ul-Akbar`,
      html: getEmailWrapper('Admin Security Alert - Lateeful-Ul-Akbar', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending admin password changed email:', err);
    return { success: false, error: err };
  }
}

// 5. Sadaqah / Donation Receipt Email
export async function sendDonationReceiptEmail({
  to,
  donorName,
  amount,
  category,
  txRef,
}: {
  to: string;
  donorName: string;
  amount: number;
  category: string;
  txRef: string;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Donation receipt email sent to ${to}: Amount=₦${amount}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 20px;">Jazakallahu Khair ${donorName},</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      May Allah bless you for your generous contribution towards <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong>. Your Sadaqah helps support the organization and comfort of thousands of attendees.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 14px 0; color: #064e3b; font-size: 16px; border-bottom: 1px solid #dcfce7; padding-bottom: 8px;">Official Contribution Receipt</h3>
      
      <table border="0" cellpadding="6" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr>
          <td width="40%" style="font-weight: 600; color: #047857;">Transaction Ref:</td>
          <td width="60%" style="font-family: monospace; font-size: 13px;">${txRef}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Contribution Area:</td>
          <td>${category}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Amount Donated:</td>
          <td style="font-weight: 800; color: #064e3b; font-size: 20px;">₦${amount.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains." (Qur'an 2:261)
    </p>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Donation Receipt - Lateeful-Ul-Akbar 2027 [${txRef}]`,
      html: getEmailWrapper('Sadaqah Contribution Receipt', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending donation receipt email:', err);
    return { success: false, error: err };
  }
}

