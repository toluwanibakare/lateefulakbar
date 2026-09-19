import nodemailer from 'nodemailer';

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
                <td style="background-color: #ffffff; padding: 28px 24px 20px 24px; text-align: center; border-bottom: 4px solid #0f766e;">
                  <img src="${SITE_URL}/assets/brand/lateefulakbar.PNG" alt="LATEEF Logo" style="height: 64px; max-width: 240px; margin-bottom: 8px; object-fit: contain;" />
                  <h1 style="margin: 8px 0 0 0; color: #064e3b; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">LATEEF-UL-IL-AKBAR-LI-A’AZAM 2027</h1>
                  <p style="margin: 4px 0 0 0; color: #b45309; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Walking in the Footsteps of Light</p>
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
                  <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f766e;">THE LATEEF-UL-IL-AKBAR-LI-A’AZAM</p>
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

function getSmtpConfig() {
  const user = process.env.SMTP_USER || 'lateefulakbar@gmail.com';
  const pass = process.env.SMTP_PASS || 'dvyvgkrwxgjliqgp';
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const from = process.env.FROM_EMAIL || '"Lateeful-Ul-Akbar 2027" <lateefulakbar@gmail.com>';
  return { user, pass, host, port, from };
}

export async function getTransporter() {
  const cfg = getSmtpConfig();
  if (!cfg.user || !cfg.pass) return null;
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

// 1. Attendee Registration Email (mobile-responsive, white header, no QR)
export async function sendRegistrationEmail({
  to,
  name,
  ticketType,
  passCode,
  referralCode,
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

  const safeName = name || 'Guest';
  const referralLink = referralCode ? `${SITE_URL}/register?ref=${referralCode}` : '';
  const logoUrl = `${SITE_URL}/assets/brand/lateefulakbar.PNG`;

  const innerHtml = `
    <!-- Preheader (inbox preview snippet, hidden in body) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Your pass code is ${passCode}. See you at TBS Main Bowl, Lagos on January 24, 2027.
    </div>

    <!-- HEADER on white -->
    <div style="text-align:center;padding:8px 0 4px 0;">
      <img src="${logoUrl}" alt="LATEEF-UL-IL-AKBAR-LI-A’AZAM 2027" width="220" style="width:220px;max-width:70%;height:auto;border:0;outline:none;" />
      <h1 class="hero-title" style="margin:14px 0 4px 0;color:#064e3b;font-size:24px;font-weight:800;letter-spacing:0.3px;line-height:1.25;">LATEEF-UL-IL-AKBAR-LI-A’AZAM 2027</h1>
      <p style="margin:0;color:#b45309;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Walking in the Footsteps of Light</p>
      <div style="width:64px;height:3px;background-color:#d97706;margin:14px auto 0 auto;border-radius:2px;"></div>
    </div>

    <h2 style="margin:24px 0 10px 0;color:#0f172a;font-size:19px;font-weight:700;line-height:1.4;">As-Salāmu ‘Alaykum Warahmatullāhi Wabarakātuh ${safeName},</h2>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#334155;">
      Alhamdulillah! Your registration for <strong>Lateeful Akbar 2027 &ndash; The Grand Spiritual Gathering of Sublime Minds</strong> has been completed.
      Please keep your pass code below safe &mdash; you will present it at the entrance.
    </p>

    <!-- PASS CARD -->
    <div style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;padding:24px 20px;margin:0 0 20px 0;text-align:center;">
      <p style="margin:0 0 6px 0;font-size:11px;color:#047857;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Your Official Pass Code</p>
      <div class="pass-code" style="font-size:30px;font-weight:800;color:#064e3b;letter-spacing:3px;">${passCode}</div>
      <div style="border-top:1px dashed #6ee7b7;margin:16px 0;"></div>
      <p style="margin:0 0 6px 0;font-size:14px;color:#475569;">Name: <strong style="color:#0f172a;">${safeName}</strong></p>
      <p style="margin:0;font-size:14px;color:#475569;">Category: <strong style="color:#0f766e;">${ticketType}</strong></p>
    </div>

    <!-- EVENT DETAILS -->
    <div style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin:0 0 20px 0;">
      <p style="margin:0 0 10px 0;font-size:13px;font-weight:700;color:#0f766e;text-transform:uppercase;letter-spacing:1.5px;">Event Details</p>
      <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#334155;">&#128205; Tafawa Balewa Square (TBS) Main Bowl, Lagos, Nigeria</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">&#128197; Sunday, January 24, 2027</p>
    </div>

    ${referralCode ? `
    <!-- REFERRAL -->
    <div style="background-color:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:18px 20px;margin:0 0 20px 0;">
      <p style="margin:0 0 6px 0;font-size:14px;font-weight:700;color:#6b21a8;">Invite family and friends</p>
      <p style="margin:0 0 10px 0;font-size:13px;line-height:1.6;color:#581c87;">Share your personal link. Every registration through it counts toward your referrals.</p>
      <div style="background-color:#ffffff;border:1px solid #d8b4fe;padding:10px 12px;border-radius:8px;font-family:monospace,monospace;font-size:13px;color:#6b21a8;word-break:break-all;">
        ${referralLink}
      </div>
      <p style="margin:10px 0 0 0;font-size:12px;color:#7e22ce;">Your code: <strong>${referralCode}</strong></p>
    </div>
    ` : ''}

    <!-- ACTIONS -->
    <div style="margin:0 0 8px 0;">
      <a href="${SITE_URL}/register" class="btn" style="display:block;text-align:center;background-color:#d97706;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:700;font-size:15px;margin:0 0 10px 0;">Download Pass / View Event Ticket</a>
      <a href="${SITE_URL}/chat" class="btn" style="display:block;text-align:center;background-color:#ffffff;color:#0f766e;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700;font-size:15px;border:1.5px solid #0f766e;">Chat with Smart LATEEF Assistant</a>
      <a href="${SITE_URL}/about" class="btn" style="display:block;text-align:center;background-color:#f1f5f9;color:#334155;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px;margin-top:10px;">About Event & Venue Details</a>
    </div>

    <p style="margin:18px 0 0 0;font-size:13px;line-height:1.6;color:#64748b;">
      Questions about venue, parking, or the program? Simply reply to this email and our team will assist you.
    </p>

    <style>
      @media only screen and (max-width: 600px) {
        .hero-title { font-size: 21px !important; }
        .pass-code { font-size: 26px !important; letter-spacing: 2px !important; }
      }
    </style>
  `;

  const textVersion = [
    `As-Salāmu ‘Alaykum Warahmatullāhi Wabarakātuh ${safeName},`,
    ``,
    `Alhamdulillah! Your registration for Lateeful Akbar 2027 – The Grand Spiritual Gathering of Sublime Minds has been completed.`,
    ``,
    `Your official pass code: ${passCode}`,
    `Name: ${safeName}`,
    `Category: ${ticketType}`,
    ``,
    `Venue: Tafawa Balewa Square (TBS) Main Bowl, Lagos, Nigeria`,
    `Date: Sunday, January 24, 2027`,
    ...(referralCode
      ? [``, `Invite family and friends with your personal link:`, referralLink, `Your code: ${referralCode}`]
      : []),
    ``,
    `Get your "I Will Be Attending" banner: ${SITE_URL}/attending`,
    `Chat with Smart LATEEF: ${SITE_URL}/chat`,
    ``,
    `Questions? Simply reply to this email.`,
    ``,
    `THE LATEEF-UL-IL-AKBAR-LI-A’AZAM`,
  ].join('\n');

  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Registration Successful – Lateeful Akbar 2027</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1e293b;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;">
              <tr>
                <td class="content-pad" style="padding:28px 28px 8px 28px;">${innerHtml}</td>
              </tr>
              <tr>
                <td style="background-color:#f8fafc;padding:20px 28px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;border-radius:0 0 16px 16px;">
                  <p style="margin:0 0 6px 0;font-weight:700;color:#0f766e;">THE LATEEF-UL-IL-AKBAR-LI-A’AZAM</p>
                  <p style="margin:0 0 10px 0;line-height:1.5;">Tafawa Balewa Square (TBS) Main Bowl, Lagos, Nigeria</p>
                  <p style="margin:0 0 10px 0;">
                    <a href="${SITE_URL}" style="color:#0d9488;text-decoration:none;font-weight:600;">Website</a>
                    &nbsp;&bull;&nbsp;
                    <a href="${SITE_URL}/sadaqah" style="color:#0d9488;text-decoration:none;font-weight:600;">Support</a>
                    &nbsp;&bull;&nbsp;
                    <a href="${SITE_URL}/chat" style="color:#0d9488;text-decoration:none;font-weight:600;">Smart LATEEF</a>
                  </p>
                  <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
                    You received this email because you registered for Lateeful Akbar 2027.<br>
                    <a href="mailto:lateefulakbar@gmail.com?subject=Unsubscribe" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0 0;font-size:11px;color:#94a3b8;">&copy; 2027 THE LATEEF-UL-IL-AKBAR-LI-A’AZAM. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  try {
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
      to,
      replyTo: cfg.user,
      subject: `Registration Successful – Lateeful Akbar 2027`,
      text: textVersion,
      html,
      headers: {
        'List-Unsubscribe': '<mailto:lateefulakbar@gmail.com?subject=Unsubscribe>',
      },
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
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
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
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
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
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
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
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 19px; line-height: 1.4;">As-Salāmu ‘Alaykum Warahmatullāhi Wabarakātuh ${donorName},</h2>
    <p style="font-size: 15px; line-height: 1.7; color: #334155; margin: 0 0 16px 0;">
      <strong>Jazākumullāhu Khayran!</strong> We have successfully received your generous Sadaqah contribution towards <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong>.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 22px; margin: 20px 0;">
      <h3 style="margin: 0 0 14px 0; color: #064e3b; font-size: 15px; border-bottom: 1px solid #dcfce7; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Official Sadaqah Receipt</h3>
      
      <table border="0" cellpadding="6" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr>
          <td width="40%" style="font-weight: 600; color: #047857;">Transaction Ref:</td>
          <td width="60%" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a;">${txRef}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Sadaqah Project:</td>
          <td style="font-weight: 600; color: #0f766e;">${category}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Amount Contributed:</td>
          <td style="font-weight: 800; color: #064e3b; font-size: 22px;">₦${amount.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 15px; line-height: 1.7; color: #334155; margin: 0 0 16px 0;">
      May Allah accept your Sadaqah, multiply your reward, increase you in halal <em>rizq</em> and <em>barakah</em>, and make your contribution a source of continuous goodness. Āmīn.
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
      Thank you for supporting this noble gathering.
    </p>

    <div style="margin: 20px 0 0 0;">
      <a href="${SITE_URL}/sadaqah" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">View Live Sadaqah Projects &rarr;</a>
    </div>
  `;

  try {
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
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

// 6. General Broadcast Email helper
export async function sendBroadcastEmail({
  to,
  subject,
  bodyHtml,
}: {
  to: string;
  subject: string;
  bodyHtml: string;
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Broadcast email to ${to}: Subject=${subject}`);
    return { success: true, simulated: true };
  }

  const innerHtml = `
    <div style="font-size: 15px; line-height: 1.7; color: #334155;">
      ${bodyHtml}
    </div>
  `;

  try {
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
      to,
      subject,
      html: getEmailWrapper(subject, innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error(`Error sending broadcast email to ${to}:`, err);
    return { success: false, error: err };
  }
}

// 7. Admin Account Created Welcome Email
export async function sendAdminWelcomeEmail({
  to,
  name,
  role,
  password,
  permissions,
}: {
  to: string;
  name: string;
  role: string;
  password: string;
  permissions: string[];
}) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Admin welcome email sent to ${to}`);
    return { success: true, simulated: true };
  }

  const loginUrl = `${SITE_URL}/outofworld`;

  const innerHtml = `
    <h2 style="margin: 0 0 16px 0; color: #064e3b; font-size: 20px;">Assalamu Alaikum ${name},</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      You have been granted administrator access to the <strong>Lateeful-Ul-Akbar Li-A’azam 2027</strong> management console.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 14px 0; color: #064e3b; font-size: 16px; border-bottom: 1px solid #dcfce7; padding-bottom: 8px;">Your Admin Credentials</h3>
      
      <table border="0" cellpadding="6" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr>
          <td width="35%" style="font-weight: 600; color: #047857;">Admin Portal URL:</td>
          <td width="65%"><a href="${loginUrl}" style="color: #0d9488; font-weight: bold; text-decoration: underline;">${loginUrl}</a></td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Login Email:</td>
          <td style="font-family: monospace; font-weight: bold;">${to}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Temporary Password:</td>
          <td style="font-family: monospace; font-weight: bold; color: #d97706; background-color: #fef3c7; padding: 4px 8px; border-radius: 4px; display: inline-block;">${password}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Assigned Role:</td>
          <td><span style="font-weight: bold; color: #064e3b;">${role}</span></td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #047857;">Module Access:</td>
          <td style="font-size: 13px; color: #475569;">${permissions && permissions.length > 0 ? permissions.join(', ') : 'All Modules'}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569;">
      To log in, visit the admin portal at <a href="${loginUrl}" style="color: #0d9488; font-weight: 600;">${loginUrl}</a> and sign in with your email and password. For security reasons, please change your password upon your first login under <strong>Settings</strong>.
    </p>
  `;

  try {
    const cfg = getSmtpConfig();
    await transporter.sendMail({
      from: cfg.from,
      to,
      subject: `Admin Account Created - Lateeful-Ul-Akbar Management Console`,
      html: getEmailWrapper('Admin Account Details', innerHtml),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending admin welcome email:', err);
    return { success: false, error: err };
  }
}



