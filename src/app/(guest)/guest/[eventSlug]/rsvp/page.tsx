import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import RSVPPageClient from '@/components/guest/RSVPPageClient';

type Props = { params: Promise<{ eventSlug: string }> };

export default async function RSVPPage({ params }: Props) {
  const { eventSlug } = await params;

  // Find guest by slug
  const guest = await prisma.guest.findUnique({
    where: { slug: eventSlug },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      eventId: true,
    },
  });

  if (!guest) {
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: guest.eventId },
    select: { title: true },
  });

  const eventTitle = event?.title ?? 'the event';

  return (
    <RSVPPageClient 
      guestName={guest.fullName}
      eventTitle={eventTitle}
      slug={eventSlug}
    />
  );
}