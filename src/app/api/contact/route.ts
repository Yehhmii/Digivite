import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactFormData = {
  fullName: string;
  email: string;
  serviceType: string;
  message: string;
};

function env(name: string) {
  const v = process.env[name];
  return v === undefined ? '' : v;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, email, serviceType, message } = body as ContactFormData;

    if (!fullName || !email || !serviceType || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false, // true for 465, false for other ports
        // requireTLS: true, // forces TLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // (optional) verify connection (helpful for clearer errors)
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      console.error('SMTP verify failed:', verifyErr);
      return NextResponse.json({ error: 'Mail service not available. Check SMTP settings.' }, { status: 502 });
    }

    // admin notification email (you receive this)
    const adminFrom = env('EMAIL_FROM') || env('SMTP_USER') || 'no-reply@example.com';
    const adminTo = env('ADMIN_RECEIVER') || env('SMTP_USER'); // allow separate recipient

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px">
        <h2>New Contact Form Submission</h2>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <p style="font-size:12px;color:#666">Sent on ${new Date().toLocaleString()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: adminFrom,
      to: adminTo,
      subject: `Digivite Contact: ${serviceType} — ${fullName}`,
      html: adminHtml,
      text: `${serviceType}\n\nFrom: ${fullName} <${email}>\n\n${message}`,
    });

    // confirmation email to the user
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px">
        <h2>Thanks for contacting Digivite</h2>
        <p>Hi ${fullName},</p>
        <p>Thanks for reaching out about <strong>${serviceType}</strong>. We've received your message and will reply within 24–48 hours.</p>
        <div style="margin-top:12px;padding:12px;background:#f5f5f5;border-left:4px solid #222">
          <strong>Your message:</strong>
          <div style="margin-top:8px">${message.replace(/\n/g, '<br/>')}</div>
        </div>
        <p style="margin-top:16px">Best regards,<br/>Digivite Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: adminFrom,
      to: email,
      subject: `Thanks for contacting Digivite — we received your message`,
      html: userHtml,
      text: `Thanks ${fullName},\n\nWe received your message about "${serviceType}". We'll get back to you soon.\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
