// src/app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

type Body = {
  slug: string;
  email: string;
  phone?: string;
  numberOfGuests?: number;
};

function makeQrToken() {
  return `q_${randomBytes(16).toString('hex')}`;
}

async function sendInvitationEmail(to: string, eventTitle: string, guestName: string | null, qrDataUrl: string) {
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

  const cid = 'qr-code-' + Date.now();
  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#222;">
      <h2 style="color:#722F37">${eventTitle}</h2>
      <p>Dear ${guestName ?? 'Guest'},</p>
      <p>Thank you for confirming your attendance. Please present the QR code below at the event entrance for verification.</p>
      <div style="margin:20px 0; text-align:center">
        <img src="${cid}" alt="Invitation QR code" style="max-width:240px; height:auto;"/>
      </div>
      <p>If you have any questions, please reach out @08180541571.</p>
      <p style="color:#777; font-size:12px">This email was sent from DigiVite.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `${eventTitle} — Your Invitation QR Code`,
    html,
    attachments: [{
      filename: 'invitation-qr.png',
      content: qrDataUrl.split('base64,')[1], // Extract base64 content
      encoding: 'base64',
      cid: cid // Same CID referenced in the HTML
    }]
  });
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { slug, email, phone, numberOfGuests = 1 } = body ?? {};

    if (!slug || !email) {
      return NextResponse.json({ error: 'Missing slug or email' }, { status: 400 });
    }

    // find guest by slug
    const guest = await prisma.guest.findUnique({ where: { slug } });
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // generate qr token & data url
    const qrToken = makeQrToken();

    // update guest record
    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        email,
        phone: phone ?? guest.phone,
        numberOfGuests,
        status: 'ACCEPTED',
        qrCodeToken: qrToken,
      },
    });

    // generate QR code as data URL (PNG)
    const qrDataUrl = await QRCode.toDataURL(qrToken, { type: 'image/png', margin: 1, width: 400 });

    // fetch event title (for email)
    const event = await prisma.event.findUnique({ where: { id: guest.eventId }, select: { title: true }});
    const eventTitle = event?.title ?? 'Your Event';

    // send email (throws on failure)
    await sendInvitationEmail(email, eventTitle, guest.fullName ?? null, qrDataUrl);

    return NextResponse.json({ ok: true, guest: { id: updated.id, slug: updated.slug } });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('rsvp Error:', err);
       return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("Unexpected error:", err);
    return NextResponse.json({error: 'Server error' }, { status: 500 });
  }
}
