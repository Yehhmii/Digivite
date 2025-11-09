import React from 'react';
import prisma from '@/lib/prisma';
import Carousel from '@/components/guest/Carousel';
import Envelope from '@/components/guest/Envelope';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { FaClover } from "react-icons/fa6";
import { FaHeartbeat, FaHandHoldingHeart } from "react-icons/fa";
import { GiEternalLove, GiLoveSong, GiLoveMystery, GiBigDiamondRing } from "react-icons/gi";

type Props = { params: Promise<{ eventSlug: string }> };

export default async function GuestLandingPage({ params }: Props) {
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
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: guest.eventId },
    select: { title: true },
  });

  const eventTitle = event?.title ?? 'the event';

  const carouselImages = [
    '/couple-1.jpeg',
    '/couple-2.jpeg',
    '/couple-3.jpeg',
    '/couple-4.jpeg',
    '/couple-5.jpeg'
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: "url('/guestbackgroud1.png')" }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10">
          <Header eventTitle="M'J FOREVER25" />
          
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
            
            <div className="text-center mb-12 space-y-4 animate__animated animate__fadeInUp">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair text-white font-light leading-tight">
                You're invited to
              </h1>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-dm-serif text-[#D4AF37] font-light tracking-wide">
                The Wedding Of Mary-Joy & Olajide
              </h2>
            </div>

            {/* Image Carousel */}
            <div className="relative w-full max-w-5xl mb-16 overflow-hidden">
              <div className="mt-6 w-full max-w-3xl mx-auto">
                <Carousel images={carouselImages} speed={70} itemBaseWidth={150} />
              </div>
            </div>

            {/* Message Card Section */}
            <div className="relative max-w-3xl mx-auto ">
              <div className="message-card p-6 md:p-10 text-center h-52">
                <p className="text-xl md:text-2xl font-playfair text-white">
                  Dear{' '}
                  <span className="text-[#D4AF37] font-semibold">
                    {guest.fullName || 'Beloved Guest'}
                  </span>
                </p>

                <p className="mt-4 text-base md:text-lg pb-5 font-dm-serif text-white/90 leading-relaxed">
                  Please tap the button below to view your invitation. We look forward to celebrating this magical day with you.
                </p>
              </div>
              <div className="pointer-wrap">
                <div className="pointer" />
              </div>
            </div>

           {/* Envelope Section */}
              <div className="mt-8 envelope-animate">
                <Envelope guestName={guest.fullName ?? 'Beloved Guest'} />
              </div>
              
              <div className="mt-12">
                <a 
                  href={`/guest/${eventSlug}/rsvp`} 
                  className="inline-block text-decoration-none"
                >
                  <button 
                    className="group relative px-12 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-dm-serif text-lg tracking-[0.1em] uppercase transition-all duration-500 hover:bg-[#D4AF37] hover:text-black overflow-hidden"
                    type="button" 
                    aria-label="Open invitation"
                  >
                    <div className="absolute inset-0 bg-[#D4AF37] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                    <span className="relative z-10 font-light">Open Invitation</span>
                  </button>
                </a>
              </div>
            </div>

            {/* Decorative Love Elements */}
            <div className="absolute top-20 left-10 text-[#D4AF37]/30 text-3xl animate-bounce hidden md:block"><FaHeartbeat className='text-red-800 w-16 h-16'/></div>
            <div className="absolute top-32 right-16 text-[#722F37]/40 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>💕</div>
            
            <div className="absolute bottom-60 right-12 text-[#722F37]/30 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}><FaClover className='text-amber-600 w-12 h-12'/></div>
            <div className="absolute top-1/2 left-8 text-[#D4AF37]/25 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}><GiBigDiamondRing className='text-amber-200'/></div>
            <div className="absolute top-1/3 right-8 text-[#722F37]/35 text-2xl animate-pulse" style={{ animationDelay: '2.5s' }}><FaHandHoldingHeart className='text-white w-12 h-12'/></div>
            
            {/* Mobile decorative elements */}
            <div className="absolute top-16 left-4 text-[#D4AF37]/20 text-xl animate-pulse md:hidden"><GiEternalLove className='text-white'/></div>
            <div className="absolute top-24 right-4 text-[#722F37]/30 text-lg animate-bounce md:hidden" style={{ animationDelay: '1s' }}><GiLoveSong className='text-white'/></div>
            <div className="absolute bottom-32 left-4 text-[#D4AF37]/25 text-xl animate-bounce md:hidden" style={{ animationDelay: '2s' }}><GiEternalLove className='text-white'/></div>
            <div className="absolute bottom-40 right-4 text-[#722F37]/20 text-lg animate-pulse md:hidden" style={{ animationDelay: '0.5s' }}><GiLoveMystery className='text-white'/></div>
          
        </div>
      </div>

      <Footer 
        message="We eagerly await your response"
        tagline="Your presence would be appreciated"
      />

    </div>
  );
}