import React from 'react';
import prisma from '@/lib/prisma';
import Envelope from '@/components/guest/Envelope';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ eventSlug: string }> };

export default async function GuestLandingPage({ params }: Props) {
  // Await the params Promise
  const { eventSlug } = await params;

  // find guest by slug
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
    return notFound(); // Next.js 404
  }

  const event = await prisma.event.findUnique({
    where: { id: guest.eventId },
    select: { title: true },
  });

  const eventTitle = event?.title ?? 'the event';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header eventTitle={eventTitle} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          
          {/* Main invitation text */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-amber-900 font-light leading-tight">
              You have been invited to{' '} <br/>
              <span className="text-[#D3AF37] font-medium">{eventTitle}</span>
            </h1>
            
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-6"></div>
            
            <p className="text-lg md:text-xl text-amber-800 font-serif font-light max-w-2xl mx-auto leading-relaxed">
              {guest.fullName ? (
                <>
                  Dear <span className="font-medium text-amber-900">{guest.fullName}</span>,{' '}
                </>
              ) : ''}
              Please tap the envelope below to view your invitation. We look forward to celebrating with you.
            </p>
          </div>

          {/* Envelope section */}
          <div className="">
            <Envelope />
          </div>

          {/* Action button */}
          <div className="pt-4">
            <a 
              href={`/guest/${eventSlug}/rsvp`} 
              className="inline-block text-decoration-none"
            >
              <button 
                className="group bg-[#D3AF37]
                hover:from-amber-700 hover:via-amber-800 hover:to-orange-700 text-white px-8 py-4 rounded-full font-serif text-lg tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden"
                type="button" 
                aria-label="Open invitation"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                
                <span className="relative flex items-center gap-3">
                  Tap to open invitation
                  <span className="text-xl animate-pulse">♦</span>
                </span>
              </button>
            </a>
          </div>
          
          {/* Decorative elements */}
          <div className=" opacity-30">
            <div className="flex justify-center items-center gap-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-300"></div>
              <span className="text-amber-500 text-lg animate-pulse">❦</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer 
        message="We eagerly await your response"
        tagline="Your presence would be appriciated"
      />
    </div>
  );
}