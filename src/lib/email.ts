import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || '"Lateeful Akbar 2027" <noreply@lateefulakbar2027.com>';

export async function sendRegistrationEmail({
  to,
  name,
  ticketType,
  passCode,
  qrCodeDataUrl,
}: {
  to: string;
  name: string;
  ticketType: string;
  passCode: string;
  qrCodeDataUrl?: string;
}) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.log(`[EMAIL SIMULATION] Registration Pass sent to ${to}: PassCode=${passCode}, Ticket=${ticketType}`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Lateeful Akbar 2027</h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Official Event Registration Pass</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 16px 0; color: #0f766e; font-size: 20px;">Assalamu Alaikum ${name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Your registration for <strong>Lateeful Akbar 2027</strong> has been confirmed. Below are your official event pass details:
          </p>

          <div style="background: #f8fafc; border-left: 4px solid #0d9488; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Pass Code</p>
            <p style="margin: 0 0 16px 0; font-size: 24px; font-weight: 800; color: #0f766e; letter-spacing: 2px;">${passCode}</p>
            
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">Ticket Category:</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${ticketType}</p>
          </div>

          ${qrCodeDataUrl ? `
            <div style="text-align: center; margin: 32px 0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #475569;">Present this QR Code at the entrance:</p>
              <img src="${qrCodeDataUrl}" alt="Event Pass QR Code" style="width: 180px; height: 180px; border: 4px solid #f1f5f9; border-radius: 12px;" />
            </div>
          ` : ''}

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 24px;">
            <p style="margin: 0 0 6px 0; font-weight: 600; font-size: 14px; color: #0f766e;">Event Info:</p>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #475569;">📍 <strong>Venue:</strong> National Mosque Auditorium, Abuja</p>
            <p style="margin: 0; font-size: 14px; color: #475569;">📅 <strong>Date:</strong> Sunday, January 24, 2027 (1-Day Grand Event)</p>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b;">
          Lateeful Akbar 2027 Organizing Committee &bull; Walking in the Footsteps of Light
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Your Event Pass for Lateeful Akbar 2027 [${passCode}]`,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error('Error sending registration email:', err);
    return { success: false, error: err };
  }
}
