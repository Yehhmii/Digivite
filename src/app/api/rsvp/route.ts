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

function env(name: string) {
  return process.env[name] ?? '';
}

function makeQrToken() {
  return `q_${randomBytes(16).toString('hex')}`;
}

async function createTransporter() {
  const host = env('SMTP_HOST') || 'smtp.gmail.com';
  const port = Number(env('SMTP_PORT') || 587);
  const secure = (env('SMTP_SECURE') === 'true');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASS'),
    },
    tls: {
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

async function sendInvitationEmail(to: string, eventTitle: string, guestName: string | null, qrDataUrl: string) {
  const transporter = await createTransporter();

  const cid = `qr-${Date.now()}`;

  const base64 = qrDataUrl.split(',')[1] ?? qrDataUrl;
  const buffer = Buffer.from(base64, 'base64');

  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial; color:#222;">
      <h2 style="color:#722F37; margin-bottom:6px">${eventTitle}</h2>
      <p>Dear ${guestName ?? 'Guest'},</p>
      <p>Thank you for confirming your attendance. Please present the QR code below at the event entrance for verification.</p>
      <div style="margin:20px 0; text-align:center">
        <img src="cid:${cid}" alt="Invitation QR code" style="max-width:260px; height:auto;"/>
      </div>
      <p>If you have any questions, please reach out.</p>
      <p style="color:#777; font-size:12px">This email was sent from DigiVite.</p>
    </div>
  `;

  await transporter.sendMail({
    from: env('EMAIL_FROM') || env('SMTP_USER'),
    to,
    subject: `${eventTitle} — Your Invitation QR Code`,
    html,
    attachments: [
      {
        filename: 'invitation-qr.png',
        content: buffer,
        cid,
      },
    ],
  });
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { slug, email, phone, numberOfGuests = 1 } = body ?? {};

    if (!slug || !email) {
      return NextResponse.json({ error: 'Missing slug or email' }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({
      where: { slug },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        numberOfGuests: true,
        qrCodeToken: true,
        rsvpAt: true,
        rsvpStatus: true,
        eventId: true,
      },
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    if (guest.qrCodeToken || guest.rsvpAt) {
      const token = guest.qrCodeToken ?? `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
      const qrDataUrl = await QRCode.toDataURL(token, { type: 'image/png', margin: 1, width: 400 });

      return NextResponse.json({
        already: true,
        guest: {
          id: guest.id,
          fullName: guest.fullName,
          email: guest.email,
          phone: guest.phone,
          numberOfGuests: guest.numberOfGuests,
          rsvpAt: guest.rsvpAt,
          rsvpStatus: guest.rsvpStatus,
          qrCodeToken: guest.qrCodeToken ?? token,
          qrDataUrl,
        }
      }, { status: 200 });
    }

    const qrToken = makeQrToken();
    const qrDataUrl = await QRCode.toDataURL(qrToken, { type: 'image/png', margin: 1, width: 400 });

    // update guest record
    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        email,
        phone: phone ?? guest.phone,
        numberOfGuests,
        status: 'ACCEPTED',
        qrCodeToken: qrToken,
        rsvpAt: new Date(),
        rsvpStatus: 'ACCEPTED',
      },
      select: {
        id: true,
        slug: true,
        fullName: true,
        email: true,
        phone: true,
        numberOfGuests: true,
        qrCodeToken: true,
        rsvpAt: true,
        rsvpStatus: true,
      },
    });


    // fetch event title (for email)
    const event = await prisma.event.findUnique({ where: { id: guest.eventId }, select: { title: true }});
    const eventTitle = event?.title ?? 'The Event';

    try {
      await sendInvitationEmail(email, eventTitle, updated.fullName ?? null, qrDataUrl);
    } catch (e) {
      console.warn('[rsvp] sendInvitationEmail failed (logged, RSVP saved):', e);
    }

    return NextResponse.json({
      already: false,
      guest: {
        ...updated,
        qrDataUrl,
      },
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('rsvp Error:', err);
       return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("Unexpected error:", err);
    return NextResponse.json({error: 'Server error' }, { status: 500 });
  }
}
